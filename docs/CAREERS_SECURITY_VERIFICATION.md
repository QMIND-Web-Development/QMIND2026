# Careers security verification

Reviewed all five original PR migrations, then executed them and the two new
security migrations in filename order in isolated PGlite/PostgreSQL. The test
fixture supplies the pre-existing `projects` table and Supabase roles/storage
schema; it does not claim to reproduce all deployed policies or extensions.

| Migration | Result |
| --- | --- |
| `202608220001_create_applications` | Creates application RLS with default-deny reads and a private 8 MiB PDF/DOCX bucket. |
| `202609060001_hiring_project_prompts` | Public reads are limited to prompts for published Consulting/Research projects. Browser writes are denied. |
| `202609060002_hiring_drive_video_urls` | Compatible with the preceding migration; adding an existing URL column is a no-op. Does not remove any legacy video bucket or policies. |
| `202609060003_optional_prompt_text` | Makes prompt text nullable; the existing nonblank check continues to reject empty text while allowing NULL. |
| `202609060004_seed_2026_hiring_projects` | Creates ten projects and prompts; rerunning does not duplicate them. Preserves existing IDs, images, PM email and GitHub URL for a matching title. Intentionally sets matching projects to published and year 2026, and replaces their descriptions/prompts. |
| `202609060005_private_application_demographics` | Moves existing responses transactionally into a restricted private schema, revokes browser access to applications, and adds a restrictive storage policy excluding resumes even when older broad policies exist. Application and demographic insertion is atomic. |
| `202609060006_careers_email_verification` | Private challenge storage and service-role-only RPCs enforce expiry, attempt limits, single use, and resend limits under row/advisory locks. |

Automated coverage (`npm run test:careers-security`) includes both `anon` and
`authenticated` role checks, service-role access, broad existing storage
policies, unpublished/non-hiring prompt filtering, data preservation, rollback
on private-insert failure, email proof tampering and address changes, formula
escaping during workbook rebuilds, and demographic exclusion from exports.

## Live checks on September 6, 2026

Read-only checks against the locally configured Supabase project confirmed the
resume bucket is private, limited to 8,388,608 bytes, and permits only PDF/DOCX
MIME types. No applicant contents were retrieved, no live records were changed,
and no emails were sent.

The configured `NEXT_PUBLIC_SUPABASE_ANON_KEY` was an `sb_secret_...` key. Thus
the initial count query labeled "anon" actually used privileged credentials;
its result is **not evidence of an RLS bypass by the anonymous role**. The
check script now rejects this configuration, and Next.js startup/build rejects
secret/service-role keys in that public variable. The local environment value
was not changed, and the secret itself is not reproduced in this report.

A read-only scan found that exact key in seven existing local `.next/static`
JavaScript bundles. Treat the key as exposed and rotate it. This confirms local
bundling, not which bundles were deployed publicly.

Replace that value with a publishable/anon key, rotate the exposed secret, and
rebuild/redeploy. Anonymous live access and
the deployed migration ledger remain unverified: a proper public key and/or
authorized SQL connection are required. Repository migrations passing locally
does not establish that they have been applied to the remote database.

## Deployment remaining

Follow [Security update rollout](CAREERS_IMPLEMENTATION.md#security-update-rollout).
The two new migrations have not been applied remotely. Resend and the
verification secret require configuration. The Apps Script must be redeployed
and its setup function run; clearing cells cannot erase old spreadsheet
version history or copies, so existing reviewers should move to a fresh cleaned
workbook if sensitive demographics were already present.

Bearer resume-link behavior is intentionally unchanged at the user's request.
General submission rate limiting from review issue 4 was not included in the
requested fixes; email verification itself has resend and attempt limits.
