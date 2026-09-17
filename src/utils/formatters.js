import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';

// ─── Date helpers ─────────────────────────────────────────────────────────────
export const parseSafeDate = (date) => {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(date);
};

export const formatDate = (date, pattern = 'dd MMM yyyy') => {
  const d = parseSafeDate(date);
  return d && !Number.isNaN(d.getTime()) ? format(d, pattern) : '—';
};

export const formatDateTime = (date) => {
  const d = parseSafeDate(date);
  return d && !Number.isNaN(d.getTime()) ? format(d, 'dd MMM yyyy, h:mm a') : '—';
};

export const timeAgo = (date) => {
  const d = parseSafeDate(date);
  return d && !Number.isNaN(d.getTime()) ? formatDistanceToNow(d, { addSuffix: true }) : '';
};

export const friendlyDate = (date) => {
  const d = parseSafeDate(date);
  if (!d || Number.isNaN(d.getTime())) return '—';
  const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
  if (isToday(d))    return hasTime ? `Today, ${format(d, 'h:mm a')}` : 'Today';
  if (isTomorrow(d)) return hasTime ? `Tomorrow, ${format(d, 'h:mm a')}` : 'Tomorrow';
  return format(d, 'EEE, dd MMM');
};

export const localDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ─── Currency ─────────────────────────────────────────────────────────────────
export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);

// ─── Distance ─────────────────────────────────────────────────────────────────
export const formatDistance = (km) => {
  if (km == null) return '';
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
};

// ─── Misc ─────────────────────────────────────────────────────────────────────
export const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const truncate = (str, len = 80) =>
  str && str.length > len ? `${str.slice(0, len)}...` : str;

export const getInitials = (name = '') =>
  (name || '').trim().split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '?';

export const getAvatarBg = (name = '') => {
  const colors = ['bg-violet-500','bg-blue-500','bg-green-500','bg-amber-500','bg-rose-500','bg-teal-500','bg-indigo-500'];
  if (!name || typeof name !== 'string' || name.length === 0) return colors[0];
  const charCode = name.charCodeAt(0) || 0;
  const idx = Math.abs(charCode) % colors.length;
  return colors[idx] || colors[0];
};
