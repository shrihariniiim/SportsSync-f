import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Zap, Users, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useGeolocation } from '../../hooks/useSocket';
import { venueService, gameService } from '../../services/index';
import VenueCard from '../../components/venue/VenueCard.jsx';
import { GameCard } from '../../components/game/GameCard.jsx';
import { SkeletonCard, EmptyState } from '../../components/common/index.jsx';
import { SPORT_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function Home() {
  const { user } = useAuth();
  const { coordinates, requestLocation } = useGeolocation();
  const [nearbyVenues, setNearbyVenues] = useState([]);
  const [openGames,    setOpenGames]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeSport,  setActiveSport]  = useState('');

  useEffect(() => {
    if (!coordinates) requestLocation();
  }, []);

  useEffect(() => {
    fetchData();
  }, [coordinates, activeSport]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { limit: 6, ...(activeSport && { sport: activeSport }) };

      if (coordinates) {
        params.lat = coordinates.lat;
        params.lng = coordinates.lng;
        params.radius = 15;
        const [vRes, gRes] = await Promise.all([
          venueService.getNearby(params),
          gameService.getAll({ ...params, status: 'open', limit: 4 }),
        ]);
        setNearbyVenues(vRes.data.data.venues);
        setOpenGames(gRes.data.data.games);
      } else {
        const [vRes, gRes] = await Promise.all([
          venueService.getAll(params),
          gameService.getAll({ status: 'open', limit: 4 }),
        ]);
        setNearbyVenues(vRes.data.data.venues);
        setOpenGames(gRes.data.data.games);
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero greeting */}
      <div className="bg-gradient-to-r from-forest to-primary-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-primary-100 text-sm mb-5">Ready to play? Find a venue or join a game near you.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/explore" className="flex items-center gap-2 bg-white text-forest font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-primary-50 transition-colors">
            <Search size={16} /> Find Venues
          </Link>
          <Link to="/games/create" className="flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/30 transition-colors border border-white/30">
            <Zap size={16} /> Create a Game
          </Link>
        </div>
        {!coordinates && (
          <button onClick={requestLocation} className="mt-3 flex items-center gap-1.5 text-primary-100 text-xs hover:text-white transition-colors">
            <MapPin size={13} /> Enable location for nearby results
          </button>
        )}
      </div>

      {/* Sport filter */}
      <div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveSport('')} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeSport ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            All Sports
          </button>
          {SPORT_TYPES.map((s) => (
            <button key={s.value} onClick={() => setActiveSport(s.value === activeSport ? '' : s.value)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeSport === s.value ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Venues */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">
              {coordinates ? '📍 Nearby Venues' : '🏟️ Venues'}
            </h2>
            <p className="text-xs text-gray-500">{coordinates ? 'Sorted by distance' : 'Browse all venues'}</p>
          </div>
          <Link to="/explore" className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline">
            See all <ChevronRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : nearbyVenues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyVenues.map((venue) => <VenueCard key={venue._id} venue={venue} />)}
          </div>
        ) : (
          <EmptyState icon="🏟️" title="No venues found" description="Try changing your sport filter or enabling location access." />
        )}
      </section>

      {/* Open Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">🎮 Open Games</h2>
            <p className="text-xs text-gray-500">Join an ongoing game near you</p>
          </div>
          <Link to="/games" className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline">
            See all <ChevronRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : openGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {openGames.map((game) => <GameCard key={game._id} game={game} />)}
          </div>
        ) : (
          <EmptyState icon="🎮" title="No open games" description="Be the first! Create a game and invite players."
            action={<Link to="/games/create" className="btn-primary btn">Create a Game</Link>} />
        )}
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/trainers', icon: '🏋️', title: 'Find Trainers', desc: 'Book certified coaches' },
          { to: '/bookings/my', icon: '📋', title: 'My Bookings', desc: 'View your history' },
          { to: '/profile', icon: '👤', title: 'My Profile', desc: 'Update availability' },
        ].map(({ to, icon, title, desc }) => (
          <Link key={to} to={to} className="card-hover p-5 flex items-center gap-4">
            <span className="text-3xl">{icon}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <ChevronRight size={16} className="ml-auto text-gray-300" />
          </Link>
        ))}
      </section>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
