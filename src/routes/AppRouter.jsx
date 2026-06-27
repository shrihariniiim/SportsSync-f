import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, UnauthorizedPage } from '../components/common/index.jsx';
import Navbar from '../components/common/Navbar.jsx';

// Auth pages
import Login       from '../pages/auth/Login.jsx';
import Register    from '../pages/auth/Register.jsx';
import OAuthCallback from '../pages/auth/OAuthCallback.jsx';

// Player pages
import Home         from '../pages/player/Home.jsx';
import VenueSearch  from '../pages/player/VenueSearch.jsx';
import VenueDetail  from '../pages/player/VenueDetail.jsx';
import BookingCheckout from '../pages/player/BookingCheckout.jsx';
import MyBookings   from '../pages/player/MyBookings.jsx';
import Games        from '../pages/player/Games.jsx';
import CreateGame   from '../pages/player/CreateGame.jsx';
import GameDetail   from '../pages/player/GameDetail.jsx';
import Trainers     from '../pages/player/Trainers.jsx';
import PlayerProfile from '../pages/player/PlayerProfile.jsx';
import NotificationsPage from '../pages/player/NotificationsPage.jsx';

// Turf Owner pages
import OwnerDashboard  from '../pages/turfOwner/Dashboard.jsx';
import ManageVenues    from '../pages/turfOwner/ManageVenues.jsx';
import AddVenue        from '../pages/turfOwner/AddVenue.jsx';
import EditVenue       from '../pages/turfOwner/EditVenue.jsx';
import OwnerBookings   from '../pages/turfOwner/Bookings.jsx';
import Revenue         from '../pages/turfOwner/Revenue.jsx';

// Trainer pages
import TrainerDashboard from '../pages/trainer/TrainerDashboard.jsx';
import TrainerProfile   from '../pages/trainer/EditProfile.jsx';

// Organizer pages
import OrganizerDashboard from '../pages/organizer/OrganizerDashboard.jsx';
import CreateEvent        from '../pages/organizer/CreateEvent.jsx';
import ManageEvents       from '../pages/organizer/ManageEvents.jsx';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import ManageUsers    from '../pages/admin/ManageUsers.jsx';
import AdminVenues    from '../pages/admin/ManageVenues.jsx';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="page-container py-6">{children}</main>
  </div>
);

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"           element={<Navigate to="/home" replace />} />
      <Route path="/login"      element={<Login />} />
      <Route path="/register"   element={<Register />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/unauthorized"   element={<Layout><UnauthorizedPage /></Layout>} />

      {/* Player routes */}
      <Route path="/home" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><Layout><VenueSearch /></Layout></ProtectedRoute>} />
      <Route path="/venues/:id" element={<ProtectedRoute><Layout><VenueDetail /></Layout></ProtectedRoute>} />
      <Route path="/bookings/checkout" element={<ProtectedRoute allowedRoles={['player','admin']}><Layout><BookingCheckout /></Layout></ProtectedRoute>} />
      <Route path="/bookings/my" element={<ProtectedRoute><Layout><MyBookings /></Layout></ProtectedRoute>} />
      <Route path="/games" element={<ProtectedRoute><Layout><Games /></Layout></ProtectedRoute>} />
      <Route path="/games/create" element={<ProtectedRoute allowedRoles={['player','admin']}><Layout><CreateGame /></Layout></ProtectedRoute>} />
      <Route path="/games/:id" element={<ProtectedRoute><Layout><GameDetail /></Layout></ProtectedRoute>} />
      <Route path="/trainers" element={<ProtectedRoute><Layout><Trainers /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><PlayerProfile /></Layout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Layout><NotificationsPage /></Layout></ProtectedRoute>} />

      {/* Turf Owner routes */}
      <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['turf_owner','admin']}><Layout><OwnerDashboard /></Layout></ProtectedRoute>} />
      <Route path="/owner/venues"    element={<ProtectedRoute allowedRoles={['turf_owner','admin']}><Layout><ManageVenues /></Layout></ProtectedRoute>} />
      <Route path="/owner/venues/add" element={<ProtectedRoute allowedRoles={['turf_owner','admin']}><Layout><AddVenue /></Layout></ProtectedRoute>} />
      <Route path="/owner/venues/edit/:id" element={<ProtectedRoute allowedRoles={['turf_owner','admin']}><Layout><EditVenue /></Layout></ProtectedRoute>} />
      <Route path="/owner/bookings"  element={<ProtectedRoute allowedRoles={['turf_owner','admin']}><Layout><OwnerBookings /></Layout></ProtectedRoute>} />
      <Route path="/owner/revenue"   element={<ProtectedRoute allowedRoles={['turf_owner','admin']}><Layout><Revenue /></Layout></ProtectedRoute>} />

      {/* Trainer routes */}
      <Route path="/trainer/dashboard" element={<ProtectedRoute allowedRoles={['trainer','admin']}><Layout><TrainerDashboard /></Layout></ProtectedRoute>} />
      <Route path="/trainer/profile"   element={<ProtectedRoute allowedRoles={['trainer','admin']}><Layout><TrainerProfile /></Layout></ProtectedRoute>} />

      {/* Organizer routes */}
      <Route path="/organizer/dashboard" element={<ProtectedRoute allowedRoles={['organizer','admin']}><Layout><OrganizerDashboard /></Layout></ProtectedRoute>} />
      <Route path="/organizer/events/create" element={<ProtectedRoute allowedRoles={['organizer','admin']}><Layout><CreateEvent /></Layout></ProtectedRoute>} />
      <Route path="/organizer/events" element={<ProtectedRoute allowedRoles={['organizer','admin']}><Layout><ManageEvents /></Layout></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
      <Route path="/admin/users"     element={<ProtectedRoute allowedRoles={['admin']}><Layout><ManageUsers /></Layout></ProtectedRoute>} />
      <Route path="/admin/venues"    element={<ProtectedRoute allowedRoles={['admin']}><Layout><AdminVenues /></Layout></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Layout><div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-400">404 — Page not found</h2></div></Layout>} />
    </Routes>
  );
}
