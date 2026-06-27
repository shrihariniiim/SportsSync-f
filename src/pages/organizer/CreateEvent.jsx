import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { eventService } from '../../services/index';
import { SPORT_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await eventService.create({ ...data, entryFee: parseInt(data.entryFee) || 0, maxParticipants: parseInt(data.maxParticipants) });
      toast.success('Event created!');
      navigate('/organizer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="section-title">Create Event</h1>
        <p className="section-sub">Set up a tournament, league, or casual event</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
        <div>
          <label className="label">Event Title *</label>
          <input className={`input ${errors.title ? 'input-error' : ''}`}
            placeholder="e.g. Chennai Summer Football Tournament"
            {...register('title', { required: 'Title required' })} />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Sport *</label>
            <select className="input" {...register('sport', { required: true })}>
              <option value="">Select Sport</option>
              {SPORT_TYPES.map((s) => <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Event Type</label>
            <select className="input" {...register('eventType')}>
              <option value="casual">Casual</option>
              <option value="tournament">Tournament</option>
              <option value="league">League</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>
          <div>
            <label className="label">Start Date *</label>
            <input type="datetime-local" className="input" {...register('startDate', { required: true })} />
          </div>
          <div>
            <label className="label">End Date</label>
            <input type="datetime-local" className="input" {...register('endDate')} />
          </div>
          <div>
            <label className="label">Entry Fee (₹)</label>
            <input type="number" min="0" className="input" placeholder="0 for free" {...register('entryFee')} />
          </div>
          <div>
            <label className="label">Max Participants</label>
            <input type="number" min="2" className="input" placeholder="32" {...register('maxParticipants')} />
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea rows={3} className="input resize-none" placeholder="Describe the event format, rules, prizes..."
            {...register('description')} />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : '🏆 Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
