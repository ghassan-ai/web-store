const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Cpath d='M80 130h40M100 90v40' stroke='%239ca3af' stroke-width='4' stroke-linecap='round'/%3E%3Ccircle cx='100' cy='75' r='20' fill='none' stroke='%239ca3af' stroke-width='4'/%3E%3Ctext x='100' y='170' text-anchor='middle' fill='%239ca3af' font-size='12' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";

export function handleImgError(e) {
  e.target.onerror = null;
  e.target.src = PLACEHOLDER;
}

export function isExternalUrl(src) {
  if (!src) return false;
  return src.startsWith("http://") || src.startsWith("https://");
}
