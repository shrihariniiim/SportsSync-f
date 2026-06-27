import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, Menu, X, ChevronDown, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useSocket';
import { getInitials, getAvatarBg } from '../../utils/formatters';

const NAV_LINKS = {
  player:     [{ to: '/home',        label: 'Explore'   }, { to: '/games',  label: 'Games'    }, { to: '/trainers', label: 'Trainers' }, { to: '/events', label: 'Events' }],
  turf_owner: [{ to: '/owner/dashboard', label: 'Dashboard' }, { to: '/owner/venues', label: 'Venues' }, { to: '/owner/bookings', label: 'Bookings' }, { to: '/owner/revenue', label: 'Revenue' }],
  trainer:    [{ to: '/trainer/dashboard', label: 'Dashboard' }, { to: '/trainer/sessions', label: 'Sessions' }],
  organizer:  [{ to: '/organizer/dashboard', label: 'Dashboard' }, { to: '/organizer/events', label: 'Events' }],
  admin:      [{ to: '/admin/dashboard', label: 'Dashboard' }, { to: '/admin/users', label: 'Users' }, { to: '/admin/venues', label: 'Venues' }],
};

const DASHBOARD_ROUTES = {
  player: '/home', turf_owner: '/owner/dashboard', trainer: '/trainer/dashboard',
  organizer: '/organizer/dashboard', admin: '/admin/dashboard',
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const links = (user?.role && NAV_LINKS[user.role]) || NAV_LINKS.player;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="page-container flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-forest shrink-0">
          <span className="text-2xl">⚽</span>
          <span className="hidden sm:inline">SportSync</span>
        </Link>

        {/* Desktop nav links */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Link to="/notifications" className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold bg-red-500 text-white rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarBg(user?.name)} shrink-0 overflow-hidden`}>
                    {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : getInitials(user?.name)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-slide-down" onMouseLeave={() => setProfileOpen(false)}>
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="badge badge-green mt-1 capitalize">{user?.role?.replace('_', ' ')}</span>
                    </div>
                    <Link to={DASHBOARD_ROUTES[user?.role] || '/home'} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={15} /> Profile
                    </Link>
                    <button onClick={() => { setProfileOpen(false); logout(); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"    className="btn-ghost btn-sm hidden sm:inline-flex">Sign In</Link>
              <Link to="/register" className="btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-50 md:hidden">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && isAuthenticated && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-slide-down">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
