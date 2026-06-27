import { useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../hooks/useSocket';
import { timeAgo } from '../../utils/formatters';
import { EmptyState } from '../../components/common/index.jsx';

const NOTIF_ICONS = {
  booking_confirmed: '✅', booking_cancelled: '❌', slot_available: '🔔',
  game_joined: '🎮', game_full: '🎯', payment_received: '💰',
  new_review: '⭐', event_registered: '🏆', trainer_booked: '🏋️', system: 'ℹ️',
};

export default function NotificationsPage() {
  const { items, unreadCount, fetchNotifications, markRead, markAllRead } = useNotifications();

  useEffect(() => { fetchNotifications(); }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-gray-500">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-ghost btn-sm gap-1.5">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <button
              key={n._id}
              onClick={() => !n.isRead && markRead(n._id)}
              className={`w-full text-left card p-4 flex items-start gap-3 transition-colors hover:bg-gray-50 ${!n.isRead ? 'border-l-4 border-l-primary-500' : ''}`}
            >
              <span className="text-2xl shrink-0 mt-0.5">{NOTIF_ICONS[n.type] || '🔔'}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                <p className={`text-xs mt-0.5 ${n.isRead ? 'text-gray-400' : 'text-gray-600'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-2" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
