import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { gameService } from '../../services/index';
import { useGeolocation } from '../../hooks/useSocket';
import { SPORT_TYPES, SKILL_LEVELS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function CreateGame() {
  const navigate = useNavigate();
  const { coordinates } = useGeolocation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { skillLevel: 'any', isPublic: true, requiredPlayers: 4 },
  });
  const [loading, setLoading] = useState(false);

  const requiredPlayers = watch('requiredPlayers');
  const totalCost       = watch('totalCost');
  const costPerPlayer   = requiredPlayers && totalCost
    ? Math.ceil(parseInt(totalCost) / parseInt(requiredPlayers))
    : 0;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        requiredPlayers: parseInt(data.requiredPlayers),
        totalCost:       parseInt(data.totalCost) || 0,
        ...(coordinates && { lat: coordinates.lat, lng: coordinates.lng }),
      };
      const { data: res } = await gameService.create(payload);
      toast.success('Game created successfully!');
      navigate(`/games/${res.data.game._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="section-title">Create a Game</h1>
        <p className="section-sub">Invite players to join your game</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
        <div>
          <label className="label">Game Title *</label>
          <input className={`input ${errors.title ? 'input-error' : ''}`}
            placeholder="e.g. Sunday Football — Need 3 More!"
            {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Sport *</label>
            <select className={`input ${errors.sport ? 'input-error' : ''}`}
              {...register('sport', { required: 'Sport is required' })}>
              <option value="">Select Sport</option>
              {SPORT_TYPES.map((s) => <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>)}
            </select>
            {errors.sport && <p className="text-xs text-red-500 mt-1">{errors.sport.message}</p>}
          </div>
          <div>
            <label className="label">Skill Level</label>
            <select className="input" {...register('skillLevel')}>
              <option value="any">Any Level</option>
              {SKILL_LEVELS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Date *</label>
            <input type="date" min={new Date().toISOString().split('T')[0]} className={`input ${errors.date ? 'input-error' : ''}`}
              {...register('date', { required: 'Date is required' })} />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label className="label">Start Time *</label>
            <input type="time" className={`input ${errors.startTime ? 'input-error' : ''}`}
              {...register('startTime', { required: 'Start time required' })} />
            {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Players Needed *</label>
            <input type="number" min="2" max="22" className={`input ${errors.requiredPlayers ? 'input-error' : ''}`}
              {...register('requiredPlayers', { required: true, min: 2, valueAsNumber: true })} />
          </div>
          <div>
            <label className="label">Total Cost (₹)</label>
            <input type="number" min="0" className="input" placeholder="0 for free"
              {...register('totalCost', { valueAsNumber: true })} />
          </div>
        </div>

        {costPerPlayer > 0 && (
          <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-xl text-sm text-primary-700 border border-primary-100">
            💰 Cost per player: <strong>₹{costPerPlayer}</strong>
          </div>
        )}

        <div>
          <label className="label">Description</label>
          <textarea rows={3} className="input resize-none" placeholder="Any additional details, rules, or notes..."
            {...register('description')} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isPublic" className="rounded text-primary-600" defaultChecked {...register('isPublic')} />
          <label htmlFor="isPublic" className="text-sm text-gray-700">Make this game public (visible to all players)</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : '🎮 Create Game'}
          </button>
        </div>
      </form>
    </div>
  );
}
