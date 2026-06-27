import { useState, useEffect } from 'react';
import { venueService, bookingService } from '../../services/index';
import { BOOKING_STATUS_MAP } from '../../utils/constants';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { EmptyState, LoadingSpinner } from '../../components/common/index.jsx';
import toast from 'react-hot-toast';

export default function OwnerBookings() {
  const [venues,    setVenues]    = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [activeVenue, setActiveVenue] = useState('');
  const [loading,   setLoading]   = useState(true);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);

  useEffect(() => { fetchVenues(); }, []);
  useEffect(() => { if (activeVenue) fetchBookings(1); }, [activeVenue]);

  const fetchVenues = async () => {
    try {
      const { data } = await venueService.getMyVenues();
      setVenues(data.data.venues);
      if (data.data.venues[0]) setActiveVenue(data.data.venues[0]._id);
    } catch {}
    finally { setLoading(false); }
  };

  const fetchBookings = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await bookingService.getVenueBookings(activeVenue, { page: p, limit: 20 });
      setBookings(data.data.bookings);
      setTotal(data.data.pagination.total);
      setPage(p);
    } catch { toast.error('Failed to load bookings'); }
    finally  { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Venue Bookings</h1>
        <p className="section-sub">{total} total bookings</p>
      </div>

      {venues.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {venues.map((v) => (
            <button key={v._id} onClick={() => setActiveVenue(v._id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${activeVenue === v._id ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}>
              {v.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : bookings.length === 0 ? (
        <EmptyState icon="📋" title="No bookings yet" description="Bookings for this venue will appear here." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Booking #', 'Player', 'Sport', 'Date', 'Time', 'Status', 'Amount'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => {
                  const st = BOOKING_STATUS_MAP[b.bookingStatus] || BOOKING_STATUS_MAP.pending;
                  return (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{b.bookingNumber}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{b.player?.name}</p>
                          <p className="text-xs text-gray-400">{b.player?.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{b.sport}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(b.date)}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.startTime} – {b.endTime}</td>
                      <td className="px-4 py-3"><span className={st.color}>{st.label}</span></td>
                      <td className="px-4 py-3 font-semibold text-gray-900">₹{b.amount?.total?.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {total > 20 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => fetchBookings(page - 1)} className="btn-secondary">Previous</button>
          <span className="flex items-center text-sm text-gray-500">Page {page}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => fetchBookings(page + 1)} className="btn-secondary">Next</button>
        </div>
      )}
    </div>
  );
}
