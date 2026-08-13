/** Orígenes permitidos (coma-separados en CORS_ORIGIN). Sin barra final. */
export function parseCorsOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

export function isCorsOriginAllowed(requestOrigin: string | undefined, allowed: string[]): boolean {
  if (!requestOrigin) return true;
  const normalized = requestOrigin.replace(/\/$/, '');
  return allowed.includes(normalized);
}
