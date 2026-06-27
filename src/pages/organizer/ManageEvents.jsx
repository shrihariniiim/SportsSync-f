import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { eventService } from '../../services/index';
import { formatDate } from '../../utils/formatters';
import { EmptyState, LoadingSpinner } from '../../components/common/index.jsx';

export default function ManageEvents() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getMyEvents()
      .then(({ data }) => setEvents(data.data.events))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await eventService.update(id, { status });
      setEvents((ev) => ev.map((e) => e._id === id ? { ...e, status } : e));
    } catch {}
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="section-title">My Events</h1>
        <Link to="/organizer/events/create" className="btn-primary gap-2"><Plus size={16} /> New Event</Link>
      </div>

      {events.length === 0 ? (
        <EmptyState icon="🏆" title="No events yet"
          action={<Link to="/organizer/events/create" className="btn-primary btn">Create Event</Link>} />
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e._id} className="card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{e.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{e.sport} · {formatDate(e.startDate)}</p>
                </div>
                <span className={`badge ${e.status === 'published' ? 'badge-green' : e.status === 'draft' ? 'badge-yellow' : 'badge-gray'} capitalize`}>
                  {e.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{e.registrations?.length || 0} registrations</span>
                {e.maxParticipants && <span className="text-sm text-gray-400">/ {e.maxParticipants} max</span>}
                <div className="ml-auto flex gap-2">
                  {e.status === 'draft' && (
                    <button onClick={() => updateStatus(e._id, 'published')} className="btn-primary btn-sm">Publish</button>
                  )}
                  {e.status === 'published' && (
                    <button onClick={() => updateStatus(e._id, 'cancelled')} className="btn-danger btn-sm">Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
