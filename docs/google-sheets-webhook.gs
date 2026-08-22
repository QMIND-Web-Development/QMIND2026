/**
 * QMIND careers Google Sheets webhook.
 *
 * Bind this script to the recruitment spreadsheet, then add a Script Property
 * named WEBHOOK_SECRET and SPREADSHEET_ID before deploying it as a web app.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const request = JSON.parse(e.postData.contents);
    const expectedSecret = PropertiesService.getScriptProperties()
      .getProperty("WEBHOOK_SECRET");

    if (!expectedSecret || request.webhookSecret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const application = request.application;
    if (!application || !application.applicationId) {
      return jsonResponse({ ok: false, error: "Invalid application" });
    }

    lock.waitLock(10000);

    const sheet = getApplicationsSheet();
    const existing = sheet
      .getRange("A:A")
      .createTextFinder(application.applicationId)
      .matchEntireCell(true)
      .findNext();

    if (existing) {
      return jsonResponse({ ok: true, duplicate: true });
    }

    sheet.appendRow([
      safeCell(application.applicationId),
      safeCell(application.submittedAt),
      safeCell(application.fullName),
      safeCell(application.pronouns),
      safeCell(application.queensEmail),
      safeCell(application.preferredEmail),
      safeCell(application.graduationYear),
      safeCell(application.faculty),
      safeCell(application.major),
      safeCell(application.rankedProjectTitles[0]),
      safeCell(application.rankedProjectTitles[1]),
      safeCell(application.rankedProjectTitles[2]),
      safeCell(application.additionalProjects),
      safeCell(application.linkedIn),
      safeCell(application.github),
      safeCell(application.videoUrl),
      safeCell(application.whyQmind),
      safeCell(application.skillsExperience),
      safeCell(application.funFact),
      safeCell(application.referralSource),
      safeCell(application.referralOther),
      application.socialConfirmed === true,
      safeCell(JSON.stringify(application.demographicResponses || {})),
      application.consent === true,
      safeCell(application.resumeStoragePath),
    ]);

    appendReviewQueueRow(application);
    refreshProjectDemand();
    refreshDemographicSummary();

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

/**
 * Run this once from the Apps Script editor after configuring Script Properties.
 * It creates and formats the reviewer-facing tabs from existing applications.
 */
function setupWorkbook() {
  formatApplicationsSheet();
  rebuildReviewQueue();
  buildApplicantViewer();
  refreshProjectDemand();
  refreshDemographicSummary();
}

function getSpreadsheet() {
  const spreadsheetId = PropertiesService.getScriptProperties()
    .getProperty("SPREADSHEET_ID");

  if (!spreadsheetId) {
    throw new Error("SPREADSHEET_ID is not configured");
  }

  return SpreadsheetApp.openById(spreadsheetId);
}

function getOrCreateSheet(name) {
  const spreadsheet = getSpreadsheet();
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function styleHeader(sheet, columnCount) {
  sheet.getRange(1, 1, 1, columnCount)
    .setBackground("#161616")
    .setFontColor("#f7f7f4")
    .setFontWeight("bold")
    .setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
}

function formatApplicationsSheet() {
  const sheet = getApplicationsSheet();
  const lastRow = Math.max(sheet.getLastRow(), 2);
  const lastColumn = sheet.getLastColumn();

  styleHeader(sheet, lastColumn);
  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, lastRow, lastColumn).createFilter();
  }

  sheet.getRange(2, 1, lastRow - 1, lastColumn)
    .setVerticalAlignment("top")
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.getRange(2, 17, lastRow - 1, 3)
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  sheet.setColumnWidth(1, 245);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 170);
  sheet.setColumnWidths(4, 6, 135);
  sheet.setColumnWidths(10, 3, 190);
  sheet.setColumnWidths(14, 3, 180);
  sheet.setColumnWidths(17, 3, 360);
  sheet.setColumnWidths(20, 6, 160);

  const bandings = sheet.getBandings();
  if (bandings.length === 0 && sheet.getLastRow() > 1) {
    sheet.getRange(1, 1, sheet.getLastRow(), lastColumn)
      .applyRowBanding(SpreadsheetApp.BandingTheme.GREY, true, false);
    styleHeader(sheet, lastColumn);
  }
}

function reviewQueueHeaders() {
  return [
    "Application ID",
    "Submitted at",
    "Full name",
    "Faculty",
    "Major",
    "Graduation year",
    "Top choice",
    "Second choice",
    "Third choice",
    "LinkedIn",
    "GitHub",
    "Video",
    "Review status",
    "Assigned reviewer",
    "Interview decision",
    "Reviewer notes",
  ];
}

function appendReviewQueueRow(application) {
  const sheet = getOrCreateSheet("Review Queue");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(reviewQueueHeaders());
    formatReviewQueue(sheet);
  }

  const existing = sheet.getRange("A:A")
    .createTextFinder(application.applicationId)
    .matchEntireCell(true)
    .findNext();
  if (existing) return;

  sheet.appendRow([
    safeCell(application.applicationId),
    safeCell(application.submittedAt),
    safeCell(application.fullName),
    safeCell(application.faculty),
    safeCell(application.major),
    safeCell(application.graduationYear),
    safeCell(application.rankedProjectTitles[0]),
    safeCell(application.rankedProjectTitles[1]),
    safeCell(application.rankedProjectTitles[2]),
    safeCell(application.linkedIn),
    safeCell(application.github),
    safeCell(application.videoUrl),
    "New",
    "",
    "Pending",
    "",
  ]);
}

function rebuildReviewQueue() {
  const source = getApplicationsSheet();
  const target = getOrCreateSheet("Review Queue");
  const savedReviewData = {};

  if (target.getLastRow() > 1) {
    target.getRange(2, 1, target.getLastRow() - 1, 16).getValues()
      .forEach(function (row) {
        savedReviewData[String(row[0])] = row.slice(12, 16);
      });
  }

  target.clear();
  target.appendRow(reviewQueueHeaders());

  if (source.getLastRow() > 1) {
    const rows = source.getRange(2, 1, source.getLastRow() - 1, 25).getValues();
    const output = rows.map(function (row) {
      const review = savedReviewData[String(row[0])] || ["New", "", "Pending", ""];
      return [
        row[0], row[1], row[2], row[7], row[8], row[6],
        row[9], row[10], row[11], row[13], row[14], row[15],
        review[0], review[1], review[2], review[3],
      ];
    });
    target.getRange(2, 1, output.length, output[0].length).setValues(output);
  }

  formatReviewQueue(target);
}

function formatReviewQueue(sheet) {
  styleHeader(sheet, 16);
  const lastRow = Math.max(sheet.getLastRow(), 2);
  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, lastRow, 16).createFilter();
  }
  sheet.getRange(2, 13, lastRow - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(["New", "In review", "Interview", "Accepted", "Rejected"], true)
      .build()
  );
  sheet.getRange(2, 15, lastRow - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending", "Yes", "No"], true)
      .build()
  );
  sheet.getRange(2, 1, lastRow - 1, 16).setVerticalAlignment("top");
  sheet.getRange(2, 16, lastRow - 1, 1).setWrap(true);
  sheet.setColumnWidth(1, 245);
  sheet.setColumnWidth(2, 145);
  sheet.setColumnWidth(3, 170);
  sheet.setColumnWidths(4, 3, 125);
  sheet.setColumnWidths(7, 3, 190);
  sheet.setColumnWidths(10, 3, 180);
  sheet.setColumnWidths(13, 3, 135);
  sheet.setColumnWidth(16, 320);
}

function buildApplicantViewer() {
  const sheet = getOrCreateSheet("Applicant Viewer");
  sheet.clear();
  sheet.getRange("A1:B1").merge().setValue("Applicant Viewer")
    .setBackground("#161616").setFontColor("#f7f7f4")
    .setFontWeight("bold").setFontSize(18);
  sheet.getRange("A2").setValue("Application ID").setFontWeight("bold");
  sheet.getRange("B2").setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInRange(getApplicationsSheet().getRange("A2:A"), true)
      .build()
  );

  const fields = [
    ["Full name", "C"], ["Pronouns", "D"], ["Queen's email", "E"],
    ["Preferred email", "F"], ["Graduation year", "G"], ["Faculty", "H"],
    ["Major", "I"], ["Top choice", "J"], ["Second choice", "K"],
    ["Third choice", "L"], ["LinkedIn", "N"], ["GitHub", "O"],
    ["Video", "P"], ["Why QMIND", "Q"], ["Skills and experience", "R"],
    ["Fun fact", "S"], ["Referral source", "T"], ["Demographics", "W"],
  ];

  fields.forEach(function (field, index) {
    const row = index + 4;
    sheet.getRange(row, 1).setValue(field[0]).setFontWeight("bold");
    sheet.getRange(row, 2).setFormula(
      '=IFERROR(XLOOKUP($B$2,Applications!$A:$A,Applications!$' + field[1] + ':$' + field[1] + '),"")'
    );
  });

  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 650);
  sheet.getRange(4, 2, fields.length, 1).setWrap(true).setVerticalAlignment("top");
  sheet.setFrozenRows(2);
}

function refreshProjectDemand() {
  const source = getApplicationsSheet();
  const target = getOrCreateSheet("Project Demand");
  const counts = {};

  if (source.getLastRow() > 1) {
    source.getRange(2, 10, source.getLastRow() - 1, 3).getValues()
      .forEach(function (choices) {
        choices.forEach(function (project, rank) {
          if (!project) return;
          if (!counts[project]) counts[project] = [0, 0, 0];
          counts[project][rank] += 1;
        });
      });
  }

  const rows = Object.keys(counts).map(function (project) {
    const values = counts[project];
    return [project, values[0], values[1], values[2], values[0] + values[1] + values[2]];
  }).sort(function (a, b) { return b[4] - a[4]; });

  target.clear();
  target.appendRow(["Project", "First choice", "Second choice", "Third choice", "Total interest"]);
  if (rows.length) target.getRange(2, 1, rows.length, 5).setValues(rows);
  styleHeader(target, 5);
  target.setColumnWidth(1, 320);
  target.setColumnWidths(2, 4, 125);
}

function refreshDemographicSummary() {
  const source = getApplicationsSheet();
  const target = getOrCreateSheet("Demographic Summary");
  const counts = {};

  if (source.getLastRow() > 1) {
    source.getRange(2, 23, source.getLastRow() - 1, 1).getValues()
      .forEach(function (row) {
        if (!row[0]) return;
        try {
          const responses = JSON.parse(row[0]);
          Object.keys(responses).forEach(function (question) {
            const answer = responses[question] || "Prefer not to answer";
            const key = question + "||" + answer;
            counts[key] = (counts[key] || 0) + 1;
          });
        } catch (error) {
          // Preserve dashboard generation even if an older row has invalid JSON.
        }
      });
  }

  const rows = Object.keys(counts).map(function (key) {
    const parts = key.split("||");
    return [parts[0], parts[1], counts[key]];
  }).sort(function (a, b) {
    return a[0].localeCompare(b[0]) || b[2] - a[2];
  });

  target.clear();
  target.appendRow(["Question", "Response", "Applicants"]);
  if (rows.length) target.getRange(2, 1, rows.length, 3).setValues(rows);
  styleHeader(target, 3);
  target.setColumnWidth(1, 260);
  target.setColumnWidth(2, 220);
  target.setColumnWidth(3, 110);
}

function getApplicationsSheet() {
  const spreadsheet = getSpreadsheet();
  const sheetName = "Applications";
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Application ID",
      "Submitted at",
      "Full name",
      "Pronouns",
      "Queen's email",
      "Preferred email",
      "Graduation year",
      "Faculty",
      "Major",
      "Top choice",
      "Second choice",
      "Third choice",
      "Other project interests",
      "LinkedIn",
      "GitHub",
      "Video URL",
      "Why QMIND",
      "Skills and experience",
      "Fun fact",
      "Referral source",
      "Referral other",
      "Social channels confirmed",
      "Demographic responses",
      "Consent",
      "Private resume storage path",
    ]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function safeCell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
