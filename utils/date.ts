export const parseDate = (
  value: Date | string | null | undefined,
): Date | null => {
  if (value == null) return null;
  const d = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatDateTime = (
  value: Date | string | null | undefined,
): string => {
  const d = parseDate(value);
  if (!d) return '—';
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const formatDateOnly = (
  value: Date | string | null | undefined,
): string => {
  const d = parseDate(value);
  if (!d) return '—';
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
};

/** `yyyy-mm-dd` from a date input; used with deadline "before" (deadline &lt; start of next day). */
export const deadlineExclusiveUpperBound = (ymd: string): Date => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d + 1);
};

/** `yyyy-mm-dd` from a date input; used with deadline "after" (deadline &gt; end of that day). */
export const deadlineLowerBoundAfterDay = (ymd: string): Date => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999);
};
