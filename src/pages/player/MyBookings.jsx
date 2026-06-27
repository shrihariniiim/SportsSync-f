import { useState, useEffect } from 'react';
import { bookingService } from '../../services/index';
import { BookingCard } from '../../components/game/GameCard.jsx';
import { EmptyState, SkeletonCard } from '../../components/common/index.jsx';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const TABS = [
  { value: '',          label: 'All'       },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending',   label: 'Pending'   },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function MyBookings() {
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState('');
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);

  useEffect(() => { fetchBookings(1); }, [activeTab]);

  const fetchBookings = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 10 };
      if (activeTab) params.status = activeTab;
      const { data } = await bookingService.getMyBookings(params);
      setBookings(data.data.bookings);
      setTotal(data.data.pagination.total);
      setPage(p);
    } catch { toast.error('Failed to load bookings'); }
    finally  { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="section-title">My Bookings</h1>
        <p className="section-sub">{total} booking{total !== 1 ? 's' : ''} total</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto bg-gray-100 p-1 rounded-xl">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((b) => <BookingCard key={b._id} booking={b} />)}
        </div>
      ) : (
        <EmptyState
          icon="📋"
          title="No bookings yet"
          description="Book a venue to get started!"
          action={<Link to="/explore" className="btn-primary btn">Browse Venues</Link>}
        />
      )}

      {total > 10 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => fetchBookings(page - 1)} className="btn-secondary">Previous</button>
          <span className="flex items-center text-sm text-gray-500">Page {page}</span>
          <button disabled={page >= Math.ceil(total / 10)} onClick={() => fetchBookings(page + 1)} className="btn-secondary">Next</button>
        </div>
      )}
    </div>
  );
}
