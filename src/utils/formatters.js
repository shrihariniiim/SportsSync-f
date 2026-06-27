import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';

// ─── Date helpers ─────────────────────────────────────────────────────────────
export const formatDate = (date, pattern = 'dd MMM yyyy') =>
  date ? format(new Date(date), pattern) : '—';

export const formatDateTime = (date) =>
  date ? format(new Date(date), 'dd MMM yyyy, h:mm a') : '—';

export const timeAgo = (date) =>
  date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : '';

export const friendlyDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isToday(d))    return `Today, ${format(d, 'h:mm a')}`;
  if (isTomorrow(d)) return `Tomorrow, ${format(d, 'h:mm a')}`;
  return format(d, 'EEE, dd MMM');
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
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

export const getAvatarBg = (name = '') => {
  const colors = ['bg-violet-500','bg-blue-500','bg-green-500','bg-amber-500','bg-rose-500','bg-teal-500','bg-indigo-500'];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};
