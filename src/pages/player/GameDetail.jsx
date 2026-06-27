import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Calendar, MapPin, ChevronLeft, Loader2 } from 'lucide-react';
import { gameService } from '../../services/index';
import { useAuth } from '../../hooks/useAuth';
import { Avatar, LoadingSpinner } from '../../components/common/index.jsx';
import { SPORT_TYPES, GAME_STATUS_MAP } from '../../utils/constants';
import { friendlyDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game,    setGame]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => { fetchGame(); }, [id]);

  const fetchGame = async () => {
    try {
      const { data } = await gameService.getById(id);
      setGame(data.data.game);
    } catch { toast.error('Game not found'); navigate('/games'); }
    finally { setLoading(false); }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      const { data } = await gameService.join(id);
      if (data.data.waitlisted) {
        toast.success("You've been added to the waitlist!");
      } else {
        toast.success('Joined game successfully!');
      }
      fetchGame();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not join game');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      await gameService.leave(id);
      toast.success('Left game');
      fetchGame();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not leave game');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!game)   return null;

  const sportInfo  = SPORT_TYPES.find((s) => s.value === game.sport);
  const statusInfo = GAME_STATUS_MAP[game.status] || GAME_STATUS_MAP.open;
  const isCreator  = game.creator?._id === user?._id;
  const isParticipant = game.participants?.some((p) => p.user?._id === user?._id);
  const isWaitlisted  = game.waitlist?.some((w) => (w._id || w) === user?._id);
  const fillPercent   = Math.round((game.currentPlayers / game.requiredPlayers) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ChevronLeft size={16} /> Back to games
      </button>

      <div className="card p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{sportInfo?.emoji || '🏅'}</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{game.title}</h1>
              <p className="text-sm text-gray-500 capitalize">{sportInfo?.label} · {game.skillLevel} level</p>
            </div>
          </div>
          <span className={statusInfo.color + ' text-sm'}>{statusInfo.label}</span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
            <Calendar size={16} className="text-primary-500" />
            <div>
              <p className="text-xs text-gray-400">Date & Time</p>
              <p className="font-medium">{friendlyDate(game.date)} {game.startTime && `at ${game.startTime}`}</p>
            </div>
          </div>
          {game.venue?.name && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
              <MapPin size={16} className="text-primary-500" />
              <div>
                <p className="text-xs text-gray-400">Venue</p>
                <p className="font-medium">{game.venue.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Player fill */}
        <div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="flex items-center gap-1.5 font-medium text-gray-700">
              <Users size={15} /> {game.currentPlayers} / {game.requiredPlayers} players
            </span>
            {game.currentPlayers < game.requiredPlayers
              ? <span className="text-primary-600 font-medium">{game.requiredPlayers - game.currentPlayers} spots left</span>
              : <span className="text-red-500 font-medium">Game Full</span>
            }
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${fillPercent === 100 ? 'bg-red-400' : 'bg-primary-500'}`}
              style={{ width: `${fillPercent}%` }} />
          </div>
        </div>

        {/* Cost */}
        {game.costPerPlayer > 0 && (
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
            <span className="text-sm font-medium text-primary-800">Cost per player</span>
            <span className="text-xl font-bold text-primary-700">₹{game.costPerPlayer}</span>
          </div>
        )}

        {/* Description */}
        {game.description && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">About this game</h3>
            <p className="text-sm text-gray-600">{game.description}</p>
          </div>
        )}

        {/* Participants */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Participants ({game.currentPlayers})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {game.participants?.map((p) => (
              <div key={p._id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                <Avatar user={p.user} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.user?.name}</p>
                  {p.user?._id === game.creator?._id && <p className="text-xs text-primary-600">Creator</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
          <Avatar user={game.creator} size="md" />
          <div>
            <p className="text-sm font-medium text-gray-900">{game.creator?.name}</p>
            <p className="text-xs text-gray-500">Game organizer</p>
          </div>
        </div>

        {/* Actions */}
        {!isCreator && game.status !== 'cancelled' && game.status !== 'completed' && (
          <div>
            {isParticipant ? (
              <button onClick={handleLeave} className="btn-danger w-full">Leave Game</button>
            ) : isWaitlisted ? (
              <button disabled className="btn-secondary w-full opacity-60">On Waitlist</button>
            ) : (
              <button onClick={handleJoin} disabled={joining} className="btn-primary w-full btn-lg">
                {joining ? <><Loader2 size={16} className="animate-spin" /> Joining...</> : game.currentPlayers >= game.requiredPlayers ? 'Join Waitlist' : `🎮 Join Game${game.costPerPlayer > 0 ? ` — ₹${game.costPerPlayer}` : ''}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
