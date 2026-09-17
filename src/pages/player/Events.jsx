import { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin, Users, IndianRupee, Loader2, Award, ChevronRight } from 'lucide-react';
import { eventService } from '../../services/index';
import { EmptyState, SkeletonCard } from '../../components/common/index.jsx';
import { SPORT_TYPES } from '../../utils/constants';
import { friendlyDate, formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const EVENT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'tournament', label: '🏆 Tournament' },
  { value: 'league', label: '⚡ League' },
  { value: 'friendly', label: '🤝 Friendly' },
  { value: 'workshop', label: '🎓 Workshop' },
];

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [filters, setFilters] = useState({
    sport: '',
    eventType: '',
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { status: 'published' };
      if (filters.sport) params.sport = filters.sport;
      if (filters.eventType) params.eventType = filters.eventType;
      const { data } = await eventService.getAll(params);
      setEvents(data.data.events);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    setRegisteringId(eventId);
    try {
      await eventService.register(eventId);
      toast.success('Successfully registered for this event!');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not register for event');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="section-title">Tournaments & Events</h1>
        <p className="section-sub">Compete in local leagues, open tournaments, and workshops</p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3">
        <select
          className="input w-auto text-sm"
          value={filters.sport}
          onChange={(e) => setFilters((f) => ({ ...f, sport: e.target.value }))}
        >
          <option value="">All Sports</option>
          {SPORT_TYPES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.emoji} {s.label}
            </option>
          ))}
        </select>

        <select
          className="input w-auto text-sm"
          value={filters.eventType}
          onChange={(e) => setFilters((f) => ({ ...f, eventType: e.target.value }))}
        >
          {EVENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Event list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((evt) => {
            const sportInfo = SPORT_TYPES.find((s) => s.value === evt.sport);
            const isRegistered = evt.participants?.some(
              (p) => (p.user?._id || p.user || p)?.toString() === user?._id?.toString()
            );
            const isFull = evt.maxParticipants && evt.currentParticipants >= evt.maxParticipants;

            return (
              <div key={evt._id} className="card p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-3xl">{sportInfo?.emoji || '🏆'}</span>
                    <span className="badge badge-green text-xs capitalize">
                      {evt.eventType || 'Event'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{evt.title}</h3>
                  <p className="text-xs text-gray-500 capitalize mb-3">
                    {sportInfo?.label || evt.sport} · Organized by {evt.organizer?.name || 'SportSync'}
                  </p>

                  {evt.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                      {evt.description}
                    </p>
                  )}

                  <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-primary-600 shrink-0" />
                      <span>{friendlyDate(evt.startDate)} {evt.endDate && `– ${friendlyDate(evt.endDate)}`}</span>
                    </div>
                    {evt.venue?.name && (
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-primary-600 shrink-0" />
                        <span className="truncate">{evt.venue.name}</span>
                      </div>
                    )}
                    {evt.prizePool > 0 && (
                      <div className="flex items-center gap-2 text-amber-700 font-semibold">
                        <Trophy size={13} className="text-amber-500 shrink-0" />
                        <span>Prize Pool: {formatCurrency(evt.prizePool)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Entry Fee</p>
                    <p className="text-sm font-bold text-gray-900">
                      {evt.entryFee > 0 ? formatCurrency(evt.entryFee) : 'Free Entry'}
                    </p>
                  </div>

                  <div>
                    {isRegistered ? (
                      <span className="badge badge-green py-2 px-3 text-xs font-semibold">
                        ✓ Registered
                      </span>
                    ) : isFull ? (
                      <span className="badge badge-red py-2 px-3 text-xs font-semibold">
                        Event Full
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(evt._id)}
                        disabled={registeringId === evt._id}
                        className="btn-primary py-2 px-4 text-xs font-semibold"
                      >
                        {registeringId === evt._id ? (
                          <Loader2 size={14} className="animate-spin inline mr-1" />
                        ) : (
                          'Register Now'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="🏆"
          title="No events found"
          description="Check back later or adjust your sport filter to discover upcoming events."
        />
      )}
    </div>
  );
}
