import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { gameService } from '../../services/index';
import { GameCard } from '../../components/game/GameCard.jsx';
import { EmptyState, SkeletonCard } from '../../components/common/index.jsx';
import { SPORT_TYPES, SKILL_LEVELS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function Games() {
  const [games,       setGames]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [filters,     setFilters]     = useState({ sport: '', skillLevel: '', status: 'open' });

  useEffect(() => { fetchGames(1); }, [filters]);

  const fetchGames = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12, ...filters };
      const { data } = await gameService.getAll(params);
      setGames(data.data.games);
      setTotal(data.data.pagination.total);
      setPage(p);
    } catch { toast.error('Failed to load games'); }
    finally  { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Games</h1>
          <p className="section-sub">Find or create pickup games near you</p>
        </div>
        <Link to="/games/create" className="btn-primary gap-2">
          <Plus size={16} /> Create Game
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select className="input w-auto" value={filters.sport} onChange={(e) => setFilters((f) => ({ ...f, sport: e.target.value }))}>
          <option value="">All Sports</option>
          {SPORT_TYPES.map((s) => <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>)}
        </select>
        <select className="input w-auto" value={filters.skillLevel} onChange={(e) => setFilters((f) => ({ ...f, skillLevel: e.target.value }))}>
          <option value="">Any Skill</option>
          {SKILL_LEVELS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="input w-auto" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="open">Open Games</option>
          <option value="full">Full Games</option>
          <option value="">All Games</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((g) => <GameCard key={g._id} game={g} />)}
        </div>
      ) : (
        <EmptyState icon="🎮" title="No games found" description="Be the first to create a game!"
          action={<Link to="/games/create" className="btn-primary btn">Create a Game</Link>} />
      )}

      {total > 12 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => fetchGames(page - 1)} className="btn-secondary">Previous</button>
          <span className="flex items-center text-sm text-gray-500">Page {page} of {Math.ceil(total / 12)}</span>
          <button disabled={page >= Math.ceil(total / 12)} onClick={() => fetchGames(page + 1)} className="btn-secondary">Next</button>
        </div>
      )}
    </div>
  );
}
