import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { trainerService } from '../../services/index';
import { SPORT_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const sports = Array.isArray(data.sports) ? data.sports : [];
      await trainerService.createProfile({ ...data, sports, experience: parseInt(data.experience) || 0 });
      toast.success('Trainer profile created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="section-title">Trainer Profile</h1>
        <p className="section-sub">Set up your coaching profile to attract students</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 card p-6">
        <div>
          <label className="label">Bio</label>
          <textarea rows={4} className="input resize-none" placeholder="Tell students about your coaching experience, achievements, and style..."
            {...register('bio')} />
        </div>

        <div>
          <label className="label">Years of Experience</label>
          <input type="number" min="0" className="input" placeholder="5" {...register('experience')} />
        </div>

        <div>
          <label className="label mb-2">Sports You Coach</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SPORT_TYPES.map((s) => (
              <label key={s.value} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" value={s.value} className="rounded text-primary-600" {...register('sports')} />
                <span className="text-sm">{s.emoji} {s.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Session Price (₹) — Individual</label>
            <input type="number" min="0" className="input" placeholder="500" {...register('individualPrice')} />
          </div>
          <div>
            <label className="label">Session Duration (min)</label>
            <input type="number" min="30" className="input" placeholder="60" {...register('duration')} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Trainer Profile'}
        </button>
      </form>
    </div>
  );
}
