# Hiring prompts

Videos are hosted on Google Drive and displayed in a preview iframe. Supabase stores each project's written prompt and optional Drive link. No storage bucket or new environment variables are needed.

## Setup

Apply the three `20260906` migrations in filename order in the Supabase SQL Editor (or your migration pipeline). Skip any already applied. The third, `202609060003_optional_prompt_text.sql`, makes `prompt_text` optional so video-only rows do not need a transcript.

1. Find the project's `id` in the `projects` table.
2. In Google Drive, set the video's General access to **Anyone with the link**, role **Viewer**, then copy its share link.
3. In Table Editor > `hiring_project_prompts`, insert a row with `project_id` matching that project. For a video prompt, set `video_url` to the Drive share link (for example `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`) and leave `prompt_text` NULL. Paste the URL, not iframe HTML.
4. For a custom text prompt, put the question in `prompt_text` and leave `video_url` NULL. Paragraph breaks are preserved. Projects with no row or neither field configured keep their generated text question.
5. Refresh `/careers`, rank the project first, and continue to Application questions. Check playback while signed out of Google. Change the top-ranked project and confirm the prompt changes.

The app converts Drive `/file/d/ID/view`, `/file/d/ID/preview`, `/open?id=ID`, and `/uc?id=ID` links to preview URLs, preserving any `resourcekey`. Invalid or non-Drive URLs are ignored and the written question remains visible.

Video-only prompts show the iframe and an Open video in Google Drive link, without a generated text question underneath. The app cannot detect permission or playback errors inside Google's iframe. You may optionally fill `prompt_text` with a transcript to display beneath the video. Applicants still submit a shareable video response regardless of prompt format.

To remove a video, set `video_url` to NULL. To replace one, update its Drive link. Prompt edits are managed by trusted Supabase dashboard administrators; no browser write policies are added. If prompt configuration cannot load, the page logs the error code and continues with generated text questions.
