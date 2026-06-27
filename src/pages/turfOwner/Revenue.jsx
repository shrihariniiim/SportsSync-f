import { EmptyState } from '../../components/common/index.jsx';
import { TrendingUp, IndianRupee, BarChart2 } from 'lucide-react';

export default function Revenue() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Revenue</h1>
        <p className="section-sub">Track your earnings and payouts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '💰', label: 'This Month', value: '—', sub: 'Connect Razorpay to see earnings' },
          { icon: '📈', label: 'Total Earned', value: '—', sub: 'Lifetime earnings' },
          { icon: '⏳', label: 'Pending Payout', value: '—', sub: 'Processing' },
        ].map(({ icon, label, value, sub }) => (
          <div key={label} className="card p-5 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm font-medium text-gray-700 mt-1">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="card p-8">
        <EmptyState
          icon="💳"
          title="Connect Razorpay Account"
          description="Link your bank account to receive automatic payouts after each booking. SportSync takes a 10% platform fee."
          action={
            <a href="https://razorpay.com/route/marketplace" target="_blank" rel="noopener noreferrer" className="btn-primary btn">
              Set Up Payouts
            </a>
          }
        />
      </div>
    </div>
  );
}
