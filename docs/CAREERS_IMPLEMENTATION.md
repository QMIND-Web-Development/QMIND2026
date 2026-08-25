# QMIND Careers application system

This document describes the Careers application workflow added to the QMIND website, including the applicant experience, validation, persistence, resume storage, Google Sheets export, and reviewer dashboards.

## Overview

The feature adds a public `/careers` route where candidates can:

1. Review hiring dates and general information.
2. Browse current Consulting and Research projects.
3. Select and rank exactly three distinct projects.
4. Complete applicant information and application questions.
5. Complete an optional demographic survey.
6. Review and submit an immutable application.

The complete data flow is:

```text
Careers form
    -> Next.js server action and Zod validation
    -> Private resume upload to Supabase Storage
    -> Immutable application row in Supabase
    -> Protected Apps Script webhook
    -> Google Sheets raw data and reviewer dashboards
```

Supabase is the source of truth. Google Sheets is the operations and review surface.

## Files added or changed

### Applicant experience

- `app/careers/page.tsx`
  - Creates the `/careers` route.
  - Loads published Consulting and Research projects from Supabase.
  - Defines Careers-specific page metadata.
- `app/careers/CareersApplication.tsx`
  - Implements the complete multi-section form.
  - Manages ranked project selection, validation, navigation, review, and submission.
- `app/careers/careers.module.scss`
  - Defines responsive QMIND-branded styling.
- `app/careers/config.ts`
  - Stores opening and closing dates, file restrictions, referral choices, video prompts, and demographic questions.
- `app/careers/types.ts`
  - Contains shared project and application types.

### Submission pipeline

- `app/careers/actions.ts`
  - Revalidates all application data on the server.
  - Validates selected projects against live Supabase records.
  - Uploads resumes.
  - Inserts the application.
  - Exports the application to Google Sheets.
- `app/careers/spreadsheet.ts`
  - Sends application data to the configured Apps Script deployment.
  - Includes the server-only webhook secret in the JSON payload.
  - Treats an Apps Script rejection as an export failure.
- `app/utils/supabase/admin.ts`
  - Creates a server-only Supabase client using the service-role key.

### Infrastructure

- `supabase/migrations/202608220001_create_applications.sql`
  - Creates the `applications` table.
  - Creates and configures the private `application-resumes` bucket.
  - Enables row-level security on applications.
- `docs/google-sheets-webhook.gs`
  - Receives authenticated application exports.
  - Appends raw application data.
  - Prevents duplicate application IDs.
  - Creates and refreshes reviewer views.
- `.env.example`
  - Documents every required environment variable.

### Existing files changed

- `app/components/Navbar.tsx`
  - Adds the Careers navigation item.
  - Adjusts responsive desktop spacing for the additional link.
- `next.config.js`
  - Makes the Supabase image hostname conditional.
  - Prevents development startup from failing when the Supabase URL is absent.

## Applicant workflow

### Project selection

Projects are loaded from the existing `projects` table when they meet both conditions:

- `published` is `true`
- `category` is `Consulting` or `Research`

Applicants can filter the catalogue by category, expand project descriptions, and select exactly three projects.

The selection order represents:

1. Top choice
2. Second choice
3. Third choice

Applicants can move choices up or down or remove a choice. Each ranked item displays its Consulting or Research category.

After the third project is selected:

- The unselected project catalogue is hidden.
- Focus moves to a nearby completion prompt.
- A Next section button appears beside the completed ranking.
- Removing a choice restores the catalogue.

### Applicant information

The form collects:

- Full name
- Pronouns, optional
- Queen's email
- Preferred email
- Graduation year
- Faculty
- Major
- Resume

Queen's email addresses must end in `@queensu.ca`.

### Resume restrictions

- Accepted extensions: `.pdf` and `.docx`
- Maximum size: 8 MB
- Storage bucket: `application-resumes`
- Bucket visibility: private

The server checks extension, MIME type, and size again before uploading. The Google Sheet stores the private storage path, not a public resume URL.

### Application questions

The form includes:

- LinkedIn profile, optional
- GitHub profile, optional
- Other project interests, optional
- Shareable video URL
- Why do you want to join QMIND?, maximum 200 words
- Skills and experiences, maximum 200 words
- Fun fact
- Referral source
- Optional social-channel confirmation

The video prompt is selected from the first-choice project's category. Prompts are configured in `app/careers/config.ts` and can later be replaced with project-specific prompts.

Applicants submitting Google Drive video links are reminded to allow anyone with the link to view the file.

### Demographic survey

The demographic survey is a dedicated optional section. It currently includes provisional questions for:

- Gender identity
- Racialized-community identity
- First-generation university status
- Disability or neurodivergence identity

Every question includes `Prefer not to answer`. The page states that responses are not used to evaluate applications.

Leadership should review the exact questions and response options before the hiring cycle opens. Questions are maintained in `app/careers/config.ts` and do not require a database migration.

### Consent and submission

The required consent statement is:

> I consent to QMIND collecting and using my application information for recruitment and selection.

Applicants review their identity and project ranking before submission. After a successful submission, the interface displays a reference ID and does not provide an editing path.

Preferred email is unique in the database. A second application using the same preferred email is rejected.

## Server validation

Client validation improves usability, but the server action is authoritative. It validates:

- Required fields
- Email formats
- Queen's email domain
- URL formats
- Word limits
- Consent
- Exactly three unique project IDs
- Resume type and size
- Whether all selected projects remain published Consulting or Research projects

The browser never receives the Supabase service-role key or Google webhook secret.

## Supabase data model

The `applications` table stores:

- UUID application ID
- Submission timestamp
- Applicant and academic information
- Profile and video URLs
- Long and short answers
- Referral and social-channel responses
- Demographic responses as JSON
- Consent
- Ranked project IDs and titles
- Private resume storage path
- Spreadsheet synchronization status

The database constraint requires exactly three project IDs and three project titles.

The `spreadsheet_status` field can contain:

- `pending`: database insert succeeded and export has not completed
- `synced`: Apps Script accepted the application
- `failed`: the export request failed or Apps Script rejected it
- `not_configured`: webhook variables were unavailable

## Google Sheets integration

### Required Script Properties

The Apps Script project requires:

- `WEBHOOK_SECRET`
- `SPREADSHEET_ID`

`SPREADSHEET_ID` is the value between `/d/` and `/edit` in the spreadsheet URL.

### Web-app deployment

The Apps Script must be deployed as a web app with:

- Execute as: the script owner
- Access: Anyone
- URL: the production `/exec` URL

The secret authenticates server requests because the deployment must be externally reachable.

Whenever `google-sheets-webhook.gs` changes, create a new deployment version through Deploy, Manage deployments.

### Raw application export

The `Applications` worksheet contains the canonical export. The webhook:

- Checks the shared secret.
- Checks for the application UUID in column A.
- Rejects duplicate row creation.
- Sanitizes values beginning with spreadsheet formula characters.
- Appends one row for each new application.

### Reviewer workspace

Run `setupWorkbook()` once from the Apps Script editor. It creates:

#### Review Queue

- Applicant and project summary
- Review-status dropdown
- Assigned reviewer
- Interview decision
- Reviewer notes
- Filters and frozen headers

Re-running setup preserves reviewer fields by application ID.

#### Applicant Viewer

Select an application ID from a dropdown to read the full application vertically. This avoids navigating a very wide raw-data row.

#### Project Demand

Displays first-choice, second-choice, third-choice, and total-interest counts for each selected project.

#### Demographic Summary

Displays aggregate response counts without applicant names.

#### Applications

Remains the raw export with frozen headers, filtering, widths, and wrapping appropriate to each field.

New webhook submissions update the Review Queue, Project Demand, and Demographic Summary automatically.

## Environment variables

Create `.env.local` from `.env.example` and configure:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_SHEETS_WEBHOOK_URL=
GOOGLE_SHEETS_WEBHOOK_SECRET=
```

Rules:

- Never commit `.env.local`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` through a `NEXT_PUBLIC_` variable.
- Use the Apps Script `/exec` URL, not `/dev`.
- Restart the Next.js server after changing environment variables.

## Initial setup checklist

1. Copy `.env.example` to `.env.local`.
2. Add Supabase URL, anonymous key, and service-role key.
3. Apply the Supabase migration.
4. Create the Google Sheet.
5. Add `docs/google-sheets-webhook.gs` to its Apps Script project.
6. Add `WEBHOOK_SECRET` and `SPREADSHEET_ID` Script Properties.
7. Deploy the Apps Script as a web app.
8. Add its `/exec` URL and secret to `.env.local`.
9. Run `setupWorkbook()` from Apps Script.
10. Restart Next.js.
11. Submit a test application.
12. Confirm the database row, private resume object, spreadsheet row, and reviewer dashboards.

## Operational notes

### Changing hiring dates

Edit `CAREERS_CONFIG` in `app/careers/config.ts`.

The closing date is currently displayed as `To be announced`. A future improvement should enforce opening and closing timestamps on the server, rather than display them only.

### Changing demographic questions

Edit `DEMOGRAPHIC_QUESTIONS` in `app/careers/config.ts`. Responses are stored as JSON, so adding or renaming questions does not require a schema change.

### Changing video prompts

Video prompts are generated in `app/careers/config.ts` from each listing's title, descriptions, impact statement, tags, and category. Add a more specific keyword pattern above the fallback when a new project type needs a distinct prompt. Prompts should remain 1–3 sentences and be answerable from the applicant's experience.

### Updating Apps Script

Saving code in the editor does not update the production webhook by itself. Create a new web-app deployment version after every production change.

### Failed spreadsheet exports

1. Check `applications.spreadsheet_status`.
2. Confirm both Google environment variables loaded.
3. Confirm the `/exec` URL is current.
4. Confirm Script Properties match `.env.local`.
5. Check Apps Script Executions for errors.
6. Confirm `SPREADSHEET_ID` points to the intended workbook.

Supabase remains the source of truth if spreadsheet export fails. A failed record can be replayed without creating another database application, and Apps Script prevents duplicate spreadsheet rows using the application UUID.

## Security and privacy decisions

- Service-role access is server-only.
- Resumes are stored in a private bucket.
- Public resume URLs are not written to Sheets.
- Applications cannot be updated by public users.
- The webhook uses a high-entropy shared secret.
- Spreadsheet cells are protected against formula injection.
- Demographic summaries are separated from named review data.
- Preferred email uniqueness prevents accidental duplicate submissions.

Reviewer access to the spreadsheet and Supabase project should be limited to authorized QMIND hiring personnel.

## Known follow-ups

- Confirm the application closing date.
- Obtain leadership approval for demographic wording.
- Decide whether to replace category-level video prompts with project-specific prompts.
- Add server-side opening and closing enforcement.
- Add a protected resume-download workflow for reviewers.
- Consider the authenticated PM Portal reach goal.
- Define a data-retention and deletion schedule after the hiring cycle.
