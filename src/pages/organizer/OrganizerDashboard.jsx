import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { eventService } from '../../services/index';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';
import { EmptyState, LoadingSpinner } from '../../components/common/index.jsx';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getMyEvents()
      .then(({ data }) => setEvents(data.data.events))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Organizer Dashboard</h1>
          <p className="section-sub">Welcome, {user?.organizationName || user?.name}</p>
        </div>
        <Link to="/organizer/events/create" className="btn-primary gap-2"><Plus size={16} /> Create Event</Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: '🏆', label: 'Total Events', value: events.length },
          { icon: '📋', label: 'Published',    value: events.filter((e) => e.status === 'published').length },
          { icon: '👥', label: 'Registrations',value: events.reduce((s, e) => s + e.registrations?.length, 0) },
        ].map(({ icon, label, value }) => (
          <div key={label} className="card p-5 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>
      ) : events.length === 0 ? (
        <EmptyState icon="🏆" title="No events yet"
          description="Create your first event or tournament."
          action={<Link to="/organizer/events/create" className="btn-primary btn">Create Event</Link>} />
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e._id} className="card p-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{e.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{e.sport} · {formatDate(e.startDate)} · {e.registrations?.length} registrations</p>
              </div>
              <span className={`badge ${e.status === 'published' ? 'badge-green' : e.status === 'draft' ? 'badge-yellow' : 'badge-gray'}`}>{e.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
