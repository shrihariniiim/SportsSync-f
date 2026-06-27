import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/index';
import { LoadingSpinner } from '../../components/common/index.jsx';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [commission, setCommission] = useState(0.1);

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.getCommission()])
      .then(([s, c]) => { setStats(s.data.data); setCommission(c.data.data.commissionRate); })
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const updateCommission = async (rate) => {
    try {
      await adminService.updateCommission(parseFloat(rate));
      setCommission(parseFloat(rate));
      toast.success('Commission rate updated');
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const statCards = [
    { icon: '👥', label: 'Total Users',     value: stats?.users     || 0, to: '/admin/users',   color: 'bg-blue-50 text-blue-600' },
    { icon: '🏟️', label: 'Total Venues',    value: stats?.venues    || 0, to: '/admin/venues',  color: 'bg-green-50 text-green-600' },
    { icon: '📋', label: 'Bookings',        value: stats?.bookings  || 0, to: '/admin/bookings',color: 'bg-purple-50 text-purple-600' },
    { icon: '💰', label: 'Platform Revenue',value: `₹${(stats?.platformRevenue || 0).toLocaleString('en-IN')}`, to: '/admin/revenue', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-sub">SportSync platform overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon, label, value, to, color }) => (
          <Link key={label} to={to} className="card-hover p-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-xl mb-3`}>{icon}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/users"   className="card-hover p-5 flex items-center gap-3"><span className="text-2xl">👥</span><span className="font-medium">Manage Users</span></Link>
        <Link to="/admin/venues"  className="card-hover p-5 flex items-center gap-3"><span className="text-2xl">🏟️</span><span className="font-medium">Manage Venues</span></Link>
        <Link to="/admin/revenue" className="card-hover p-5 flex items-center gap-3"><span className="text-2xl">📊</span><span className="font-medium">Revenue Reports</span></Link>
      </div>

      {/* Commission config */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Platform Commission</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Current rate: <strong>{(commission * 100).toFixed(0)}%</strong></p>
            <p className="text-xs text-gray-400 mt-1">This percentage is deducted from each booking and retained by SportSync</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="input w-auto"
              value={commission}
              onChange={(e) => updateCommission(e.target.value)}
            >
              {[0.05, 0.08, 0.10, 0.12, 0.15, 0.20].map((r) => (
                <option key={r} value={r}>{(r * 100).toFixed(0)}%</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
