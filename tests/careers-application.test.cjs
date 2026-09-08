const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const component = fs.readFileSync(
  path.join(__dirname, "..", "app", "careers", "CareersApplication.tsx"),
  "utf8"
);

test("keeps the resume input mounted while applicants change sections", () => {
  assert.match(
    component,
    /<section hidden=\{step !== 1\} aria-labelledby="information-heading">/
  );
  assert.doesNotMatch(component, /\{step === 1 && \(\s*<section aria-labelledby="information-heading">/);
});

test("returns applicants to the first invalid section on submit", () => {
  assert.match(component, /function onInvalid\(validationErrors: FieldErrors<FormValues>\)/);
  assert.match(component, /handleSubmit\(onSubmit, onInvalid\)/);
  assert.match(component, /setStep\(invalidStep === -1 \? sections.length - 1 : invalidStep\)/);
});
