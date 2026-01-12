export function calculateDuration(
  arrival: Date | string | null | undefined,
  departure: Date | string | null | undefined
): number {
  const toDate = (v: Date | string | null | undefined): Date | null => {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  const a = toDate(arrival);
  const d = toDate(departure);

  if (!a || !d) return 0;

  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((end.getTime() - start.getTime()) / msPerDay);

  return Math.max(diff, 0);
}
