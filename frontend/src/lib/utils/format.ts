import { format, formatDistance, parseISO } from 'date-fns';

export function formatDate(date: string | Date, pattern: string = 'MMM d, yyyy'): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, pattern);
}

export function formatRelativeTime(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(parsedDate, new Date(), { addSuffix: true });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

