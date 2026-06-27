import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Avatar } from '../../components/common/index.jsx';

export default function TrainerDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Trainer Dashboard</h1>
          <p className="section-sub">Welcome, {user?.name?.split(' ')[0]}</p>
        </div>
        <Link to="/trainer/profile" className="btn-primary">Edit Profile</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '🏋️', label: 'Total Sessions', value: 0 },
          { icon: '⭐', label: 'Average Rating', value: '—' },
          { icon: '👥', label: 'Students',       value: 0 },
          { icon: '💰', label: 'This Month',     value: '₹0' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="card p-5 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="card p-8 text-center">
        <p className="text-gray-500 mb-4">Set up your trainer profile to start receiving bookings</p>
        <Link to="/trainer/profile" className="btn-primary">Complete Profile</Link>
      </div>
    </div>
  );
}
