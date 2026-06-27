import { useState, useEffect } from 'react';
import { Search, ShieldOff, Shield, Loader2 } from 'lucide-react';
import { adminService } from '../../services/index';
import { Avatar, LoadingSpinner, EmptyState } from '../../components/common/index.jsx';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const ROLES = ['', 'player', 'turf_owner', 'trainer', 'organizer', 'admin'];

export default function ManageUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState('');

  useEffect(() => { fetchUsers(1); }, [role]);

  const fetchUsers = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 20, ...(role && { role }), ...(search && { search }) };
      const { data } = await adminService.getUsers(params);
      setUsers(data.data.users);
      setTotal(data.data.pagination.total);
      setPage(p);
    } catch { toast.error('Failed to load users'); }
    finally  { setLoading(false); }
  };

  const toggleBlock = async (userId, isBlocked) => {
    try {
      await adminService.toggleBlock(userId);
      setUsers((u) => u.map((x) => x._id === userId ? { ...x, isBlocked: !x.isBlocked } : x));
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'}`);
    } catch { toast.error('Action failed'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Manage Users</h1>
        <p className="section-sub">{total} total users</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers(1)}
          />
        </div>
        <select className="input w-auto" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          {ROLES.filter(Boolean).map((r) => (
            <option key={r} value={r}>{r.replace('_', ' ')}</option>
          ))}
        </select>
        <button onClick={() => fetchUsers(1)} className="btn-primary">Search</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : users.length === 0 ? (
        <EmptyState icon="👥" title="No users found" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['User', 'Role', 'Phone', 'Joined', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className={`hover:bg-gray-50 transition-colors ${u.isBlocked ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar user={u} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge capitalize ${u.role === 'admin' ? 'badge-red' : u.role === 'turf_owner' ? 'badge-blue' : 'badge-gray'}`}>
                        {u.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.isBlocked ? 'badge-red' : 'badge-green'}`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => toggleBlock(u._id, u.isBlocked)}
                          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                            u.isBlocked
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {u.isBlocked ? <><Shield size={13} /> Unblock</> : <><ShieldOff size={13} /> Block</>}
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
          <button disabled={page <= 1} onClick={() => fetchUsers(page - 1)} className="btn-secondary">Previous</button>
          <span className="flex items-center text-sm text-gray-500">Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => fetchUsers(page + 1)} className="btn-secondary">Next</button>
        </div>
      )}
    </div>
  );
}
