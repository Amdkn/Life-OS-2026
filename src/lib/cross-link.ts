/** Cross-link router — parse and navigate aspace:// deep links */

/* ═══ Types ═══ */

export interface CrossLink {
  appId: string;
  page?: string;
  subPage?: string;
  params?: Record<string, string>;
}

/* ═══ Parser ═══ */

/** Parse an aspace:// URL into structured CrossLink */
export function parseCrossLink(url: string): CrossLink | null {
  const match = url.match(/^aspace:\/\/app\/([^/]+)\/?(.*)$/);
  if (!match) return null;

  const appId = match[1];
  const pathParts = match[2].split('/').filter(Boolean);

  return {
    appId,
    page: pathParts[0] || undefined,
    subPage: pathParts[1] || undefined,
  };
}

/** Build an aspace:// URL from parts */
export function buildCrossLink(appId: string, page?: string, subPage?: string): string {
  let url = `aspace://app/${appId}`;
  if (page) url += `/${page}`;
  if (subPage) url += `/${subPage}`;
  return url;
}
