import { useState, useEffect } from 'react';
import { Search, CheckCircle } from 'lucide-react';
import { adminService } from '../../services/index';
import { LoadingSpinner, EmptyState } from '../../components/common/index.jsx';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminManageVenues() {
  const [venues,  setVenues]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [filter,  setFilter]  = useState('');

  useEffect(() => { fetchVenues(1); }, [filter]);

  const fetchVenues = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 20, ...(filter !== '' && { isVerified: filter }) };
      const { data } = await adminService.getVenues(params);
      setVenues(data.data.venues);
      setTotal(data.data.pagination.total);
      setPage(p);
    } catch { toast.error('Failed to load venues'); }
    finally  { setLoading(false); }
  };

  const verifyVenue = async (id) => {
    try {
      await adminService.verifyVenue(id);
      setVenues((v) => v.map((x) => x._id === id ? { ...x, isVerified: true, isActive: true } : x));
      toast.success('Venue verified and activated');
    } catch { toast.error('Verification failed'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Manage Venues</h1>
        <p className="section-sub">{total} total venues</p>
      </div>

      <div className="flex gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {[
            { value: '',      label: 'All'          },
            { value: 'false', label: 'Pending'       },
            { value: 'true',  label: 'Verified'      },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : venues.length === 0 ? (
        <EmptyState icon="🏟️" title="No venues found" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Venue', 'Owner', 'City', 'Sports', 'Status', 'Added', 'Action'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {venues.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {v.images?.[0] ? (
                          <img src={v.images[0]} alt={v.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">🏟️</div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{v.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{v.venueType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{v.owner?.name}</p>
                      <p className="text-xs text-gray-400">{v.owner?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{v.address?.city}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.sports?.slice(0, 2).map((s) => (
                          <span key={s} className="badge badge-gray capitalize">{s}</span>
                        ))}
                        {v.sports?.length > 2 && <span className="badge badge-gray">+{v.sports.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`badge ${v.isVerified ? 'badge-green' : 'badge-yellow'}`}>
                          {v.isVerified ? 'Verified' : 'Pending'}
                        </span>
                        <span className={`badge ${v.isActive ? 'badge-blue' : 'badge-gray'}`}>
                          {v.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(v.createdAt)}</td>
                    <td className="px-4 py-3">
                      {!v.isVerified && (
                        <button
                          onClick={() => verifyVenue(v._id)}
                          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        >
                          <CheckCircle size={13} /> Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {total > 20 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => fetchVenues(page - 1)} className="btn-secondary">Previous</button>
          <span className="flex items-center text-sm text-gray-500">Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => fetchVenues(page + 1)} className="btn-secondary">Next</button>
        </div>
      )}
    </div>
  );
}
