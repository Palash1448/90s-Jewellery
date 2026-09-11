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
