# Repository Guidance

## Project context

This repository powers the public QMIND website. It is public-facing and represents QMIND and Queen's University, so every change can affect the organization's reputation, applicants, students, partners, faculty, and the university community.

## Non-negotiable standards

- Every line of code must exist for a specific, understood reason. Prefer the smallest clear change that solves the actual problem; do not add speculative abstractions, dependencies, UI, copy, or configuration.
- Site content must represent QMIND and Queen's University in a positive, accurate, respectful, inclusive, and professional manner.
- Do not make unsupported claims about QMIND, Queen's University, partners, research results, student outcomes, rankings, or project capabilities. Preserve approved wording unless the requested change provides authoritative replacement copy.
- Treat applicants' information, resumes, contact details, and demographic responses as sensitive. Never expose secrets, private data, service-role credentials, or unnecessary personal information in client code, logs, tests, migrations, or documentation.
- Keep public interactions accessible, understandable, and respectful. Check keyboard access, focus behavior, semantic HTML, validation messages, responsive layouts, and reduced-motion behavior when changing UI.

## Implementation guidance

- This is a Next.js App Router application. Keep route-specific code under `app/` and reuse existing components, styles, Supabase helpers, and design patterns where they fit.
- Supabase schema changes belong in a new, chronologically named file under `supabase/migrations/`. Do not edit an already-applied migration. Make migrations safe to rerun when practical, preserve existing ids and user content, and avoid destructive changes unless explicitly requested.
- Careers eligibility is separate from project catalogue visibility. Use the existing `projects.is_hiring` flag together with `published` and the applicable category checks; do not hide a project from the public Projects section merely to remove it from Careers.
- Project photos use the existing `projects.projectImages` field and photo-gallery/storage flow. Preserve existing image paths when changing project data.
- Do not modify unrelated work in a dirty working tree. Do not commit `.env` files, credentials, generated build output, or unrelated local directories.

## Verification

Run the checks relevant to the change before handing it off:

```powershell
npm run test:careers-security
npx tsc --noEmit
npm run build
```

For public-facing changes, inspect the rendered result at representative desktop and mobile widths and verify the changed user flow, error states, and any affected database access paths.

## Git and release safety

- Review the complete diff before committing, including migration ordering and generated files.
- Never force-push, reset shared history, or remove production data without explicit authorization.
- Before pushing, confirm the target branch, migration order, test results, and that no secrets or unrelated files are included.
