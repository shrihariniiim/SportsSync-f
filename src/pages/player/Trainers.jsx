import { useState, useEffect } from 'react';
import { trainerService } from '../../services/index';
import TrainerCard from '../../components/trainer/TrainerCard.jsx';
import { EmptyState, SkeletonCard } from '../../components/common/index.jsx';
import { SPORT_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState({ sport: '', maxPrice: '', minRating: '' });

  useEffect(() => { fetchTrainers(); }, [filters]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const { data } = await trainerService.getAll(filters);
      setTrainers(data.data.trainers);
    } catch { toast.error('Failed to load trainers'); }
    finally  { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Find a Trainer</h1>
        <p className="section-sub">Book certified coaches for personal sessions</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select className="input w-auto" value={filters.sport} onChange={(e) => setFilters((f) => ({ ...f, sport: e.target.value }))}>
          <option value="">All Sports</option>
          {SPORT_TYPES.map((s) => <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>)}
        </select>
        <select className="input w-auto" value={filters.minRating} onChange={(e) => setFilters((f) => ({ ...f, minRating: e.target.value }))}>
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : trainers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map((t) => <TrainerCard key={t._id} trainer={t} />)}
        </div>
      ) : (
        <EmptyState icon="🏋️" title="No trainers found" description="Try changing your sport filter." />
      )}
    </div>
  );
}
