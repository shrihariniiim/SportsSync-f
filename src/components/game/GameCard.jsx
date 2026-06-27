import { Link } from 'react-router-dom';
import { Users, MapPin, Calendar, IndianRupee, Clock } from 'lucide-react';
import { friendlyDate, formatCurrency } from '../../utils/formatters';
import { SPORT_TYPES, GAME_STATUS_MAP, BOOKING_STATUS_MAP } from '../../utils/constants';
import { Avatar } from '../common/index.jsx';

// ─── GameCard ─────────────────────────────────────────────────────────────────
export function GameCard({ game }) {
  const { _id, title, sport, date, startTime, requiredPlayers, currentPlayers, costPerPlayer, skillLevel, status, creator, venue, participants } = game;

  const sportInfo   = SPORT_TYPES.find((s) => s.value === sport);
  const statusInfo  = GAME_STATUS_MAP[status] || GAME_STATUS_MAP.open;
  const spotsLeft   = requiredPlayers - currentPlayers;
  const fillPercent = Math.round((currentPlayers / requiredPlayers) * 100);

  return (
    <Link to={`/games/${_id}`} className="card-hover block">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{sportInfo?.emoji || '🏅'}</span>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{title}</h3>
              <p className="text-xs text-gray-500 capitalize">{sportInfo?.label} · {skillLevel}</p>
            </div>
          </div>
          <span className={statusInfo.color}>{statusInfo.label}</span>
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar size={12} className="text-gray-400 shrink-0" />
            {friendlyDate(date)} {startTime && `at ${startTime}`}
          </div>
          {venue?.name && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin size={12} className="text-gray-400 shrink-0" />
              {venue.name}
            </div>
          )}
        </div>

        {/* Fill progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 flex items-center gap-1"><Users size={11} /> {currentPlayers}/{requiredPlayers} players</span>
            {spotsLeft > 0 ? <span className="text-primary-600 font-medium">{spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left</span> : <span className="text-red-500 font-medium">Full</span>}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${fillPercent === 100 ? 'bg-red-400' : 'bg-primary-500'}`} style={{ width: `${fillPercent}%` }} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <Avatar user={creator} size="xs" />
            <span className="text-xs text-gray-500">{creator?.name}</span>
          </div>
          {costPerPlayer > 0 && (
            <div className="flex items-center gap-0.5 text-sm font-bold text-primary-700">
              <IndianRupee size={12} />
              {costPerPlayer.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-500">/player</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── BookingCard ──────────────────────────────────────────────────────────────
export function BookingCard({ booking }) {
  const { _id, bookingNumber, venue, sport, date, startTime, endTime, amount, bookingStatus } = booking;

  const statusInfo = BOOKING_STATUS_MAP[bookingStatus] || BOOKING_STATUS_MAP.pending;
  const sportInfo  = SPORT_TYPES.find((s) => s.value === sport);
  const mainImage  = venue?.images?.[0] || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&q=60';

  return (
    <Link to={`/bookings/${_id}`} className="card-hover block">
      <div className="flex gap-4 p-4">
        <img src={mainImage} alt={venue?.name} className="w-20 h-20 rounded-lg object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{venue?.name}</h3>
            <span className={statusInfo.color}>{statusInfo.label}</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{bookingNumber}</p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1"><Calendar size={11} />{friendlyDate(date)}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{startTime} – {endTime}</span>
            {sportInfo && <span className="flex items-center gap-1">{sportInfo.emoji} {sportInfo.label}</span>}
          </div>
          {amount?.total != null && (
            <div className="mt-2 flex items-center gap-1 text-sm font-bold text-gray-900">
              <IndianRupee size={12} />{amount.total.toLocaleString('en-IN')}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
