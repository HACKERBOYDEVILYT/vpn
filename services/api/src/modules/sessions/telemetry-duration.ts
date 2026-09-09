export function calculateConnectedDuration(
  connectedAt: Date | string | null,
  endedAt: Date | string | null = null
): number {
  if (!connectedAt) {
    return 0;
  }

  const start = new Date(connectedAt).getTime();

  if (!Number.isFinite(start)) {
    return 0;
  }

  const end = endedAt
    ? new Date(endedAt).getTime()
    : Date.now();

  if (!Number.isFinite(end) || end < start) {
    return 0;
  }

  return Math.floor((end - start) / 1000);
}
