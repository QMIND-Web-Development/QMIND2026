/** Convert supported Drive share links to an allowlisted preview URL. */
export function getDrivePreviewUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.hostname !== "drive.google.com" || url.port || url.username || url.password) return null;
    const match = url.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)(?:\/(?:view|preview|edit))?\/?$/);
    const id = match?.[1] || (["/open", "/uc"].includes(url.pathname) ? url.searchParams.get("id") : null);
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) return null;
    const preview = new URL(`https://drive.google.com/file/d/${id}/preview`);
    const resourceKey = url.searchParams.get("resourcekey");
    if (resourceKey) preview.searchParams.set("resourcekey", resourceKey);
    return preview.toString();
  } catch {
    return null;
  }
}
