const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const component = fs.readFileSync(
  path.join(__dirname, "..", "app", "careers", "CareersApplication.tsx"),
  "utf8"
);
const actions = fs.readFileSync(
  path.join(__dirname, "..", "app", "careers", "actions.ts"),
  "utf8"
);

test("keeps application fields mounted while applicants change sections", () => {
  assert.match(
    component,
    /<section hidden=\{step !== 1\} aria-labelledby="information-heading">/
  );
  for (const step of [2, 3, 4]) {
    assert.match(component, new RegExp(`<section hidden=\\{step !== ${step}\\}`));
  }
  assert.doesNotMatch(component, /\{step === [1234] && \(\s*<section/);
  assert.match(component, /shouldUnregister: false/);
});

test("stores the selected resume as a File instead of relying on FileList after navigation", () => {
  assert.match(component, /resumeRegistration\.onChange\(\{\s*target: \{ name: resumeRegistration\.name, value: selectedFile \}/);
  assert.match(component, /body\.set\("resume", resume\)/);
  assert.doesNotMatch(component, /setValue\("resume"/);
  assert.doesNotMatch(component, /body\.set\("resume", data\.resume\[0\]\)/);
});

test("returns applicants to the first invalid section on submit", () => {
  assert.match(component, /function onInvalid\(validationErrors: FieldErrors<FormValues>\)/);
  assert.match(component, /void handleSubmit\(onSubmit, onInvalid\)\(event\)/);
  assert.match(component, /setStep\(invalidStep === -1 \? sections.length - 1 : invalidStep\)/);
  assert.doesNotMatch(component, /setSubmissionError\("Please review the highlighted fields and try again\."\)/);
});

test("does not let Enter submit the form before the review section", () => {
  assert.match(component, /function onFormSubmit\(event: FormEvent<HTMLFormElement>\)/);
  assert.match(component, /if \(step !== sections.length - 1\) \{\s*event\.preventDefault\(\);\s*return;/);
  assert.match(component, /<form className=\{styles\.form\} onSubmit=\{onFormSubmit\} noValidate>/);
});

test("uses the same application field validation in the browser and on the server", () => {
  assert.match(component, /applicationDetailsSchema\s*\.extend\(\{\s*resume: resumeSchema/);
  assert.match(actions, /applicationDetailsSchema\.extend\(\{/);
  assert.match(component, /\["demographicResponses"\]/);
});
