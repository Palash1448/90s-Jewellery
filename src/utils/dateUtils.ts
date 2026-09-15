/**
 * Date normalization and formatting utilities for Firebase & local models.
 */

export function parseFirebaseDate(raw: any): Date {
  if (!raw) return new Date();

  // Already a Date object
  if (raw instanceof Date) {
    return isNaN(raw.getTime()) ? new Date() : raw;
  }

  // Firestore Timestamp with .toDate()
  if (typeof raw === 'object' && typeof raw.toDate === 'function') {
    return raw.toDate();
  }

  // Firestore Timestamp serialized / raw object with seconds
  if (typeof raw === 'object' && typeof raw.seconds === 'number') {
    return new Date(raw.seconds * 1000 + (raw.nanoseconds ? raw.nanoseconds / 1000000 : 0));
  }

  // ISO string or numeric timestamp
  if (typeof raw === 'string' || typeof raw === 'number') {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d;
  }

  return new Date();
}

/**
 * Format order date for display in table / card (e.g., "11 Sep 2026")
 */
export function formatOrderDate(
  raw: any,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
): string {
  if (!raw) return '—';
  try {
    const date = parseFirebaseDate(raw);
    return date.toLocaleDateString('en-IN', options);
  } catch {
    return '—';
  }
}

/**
 * Format date and time for detailed view (e.g., "11 Sep 2026, 6:15 PM")
 */
export function formatOrderDateTime(raw: any): string {
  if (!raw) return '—';
  try {
    const date = parseFirebaseDate(raw);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
}

/**
 * Returns a date formatted as "YYYY-MM-DD" in local time for HTML5 date inputs & comparisons.
 */
export function getLocalDateKey(raw: any): string {
  if (!raw) return '';
  try {
    const d = parseFirebaseDate(raw);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}

/**
 * Returns today's date in local "YYYY-MM-DD" format.
 */
export function getTodayDateKey(): string {
  return getLocalDateKey(new Date());
}

/**
 * Returns yesterday's date in local "YYYY-MM-DD" format.
 */
export function getYesterdayDateKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateKey(d);
}

/**
 * Checks if a raw date matches a target "YYYY-MM-DD" string.
 */
export function isSameDay(raw: any, targetDateKey: string): boolean {
  if (!raw || !targetDateKey) return false;
  return getLocalDateKey(raw) === targetDateKey;
}

/**
 * Checks if a raw date falls within start & end "YYYY-MM-DD" bounds (inclusive).
 */
export function isDateInRange(raw: any, startDateKey?: string, endDateKey?: string): boolean {
  if (!raw) return false;
  const orderDateKey = getLocalDateKey(raw);
  if (!orderDateKey) return false;

  if (startDateKey && orderDateKey < startDateKey) return false;
  if (endDateKey && orderDateKey > endDateKey) return false;

  return true;
}

/**
 * Returns a user-friendly label for a given YYYY-MM-DD date key.
 * e.g., "Today (15 Sep 2026)", "Yesterday (14 Sep 2026)", or "15 Sep 2026"
 */
export function formatFriendlyDateKey(dateKey: string): string {
  if (!dateKey) return '';
  const todayKey = getTodayDateKey();
  const yesterdayKey = getYesterdayDateKey();

  const [y, m, d] = dateKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const formatted = dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (dateKey === todayKey) {
    return `Today (${formatted})`;
  }
  if (dateKey === yesterdayKey) {
    return `Yesterday (${formatted})`;
  }
  return formatted;
}

