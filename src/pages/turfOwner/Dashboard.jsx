import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, BookOpen, MapPin, DollarSign, Plus, ChevronRight, TrendingUp } from 'lucide-react';
import { venueService, bookingService } from '../../services/index';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';
import { SkeletonCard } from '../../components/common/index.jsx';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [venues,   setVenues]   = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [vRes] = await Promise.all([venueService.getMyVenues()]);
      setVenues(vRes.data.data.venues);
      if (vRes.data.data.venues[0]) {
        const bRes = await bookingService.getVenueBookings(vRes.data.data.venues[0]._id, { limit: 5 });
        setBookings(bRes.data.data.bookings);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const totalRevenue  = 0;  // would come from analytics
  const confirmedToday = bookings.filter((b) => b.bookingStatus === 'confirmed').length;

  const stats = [
    { label: 'My Venues',      value: venues.length,     icon: '🏟️', to: '/owner/venues'   },
    { label: 'Recent Bookings',value: bookings.length,   icon: '📋', to: '/owner/bookings' },
    { label: 'Confirmed Today', value: confirmedToday,   icon: '✅', to: '/owner/bookings' },
    { label: 'View Revenue',   value: '→',               icon: '💰', to: '/owner/revenue'  },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Owner Dashboard</h1>
          <p className="section-sub">Welcome back, {user?.name?.split(' ')[0]}</p>
        </div>
        <Link to="/owner/venues/add" className="btn-primary gap-2">
          <Plus size={16} /> Add Venue
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, to }) => (
          <Link key={label} to={to} className="card-hover p-5 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </Link>
        ))}
      </div>

      {/* My Venues */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">My Venues</h2>
          <Link to="/owner/venues" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            Manage all <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array(2).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : venues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {venues.map((v) => (
              <div key={v._id} className="card p-4 flex items-center gap-4">
                {v.images?.[0] ? (
                  <img src={v.images[0]} alt={v.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center text-2xl shrink-0">🏟️</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{v.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={11} />{v.address?.city}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className={`badge ${v.isActive ? 'badge-green' : 'badge-gray'}`}>{v.isActive ? 'Active' : 'Inactive'}</span>
                    {v.isVerified && <span className="badge badge-blue">Verified</span>}
                  </div>
                </div>
                <Link to={`/owner/venues`} className="btn-ghost btn-sm">Manage</Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't added any venues yet.</p>
            <Link to="/owner/venues/add" className="btn-primary">Add Your First Venue</Link>
          </div>
        )}
      </div>

      {/* Recent bookings */}
      {bookings.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/owner/bookings" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Booking #', 'Player', 'Date', 'Status', 'Amount'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{b.bookingNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{b.player?.name}</td>
                    <td className="px-4 py-3 text-gray-600">{b.startTime} {b.date ? new Date(b.date).toLocaleDateString('en-IN') : ''}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${b.bookingStatus === 'confirmed' ? 'badge-green' : b.bookingStatus === 'cancelled' ? 'badge-red' : 'badge-yellow'}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">₹{b.amount?.total?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
