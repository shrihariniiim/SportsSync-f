import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { trainerService } from '../../services/index';
import { SPORT_TYPES } from '../../utils/constants';
import { LoadingSpinner } from '../../components/common/index.jsx';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await trainerService.getMyProfile();
      if (data?.data?.trainer) {
        const t = data.data.trainer;
        setIsExisting(true);
        reset({
          bio: t.bio || '',
          experience: t.experience || 0,
          sports: t.sports || [],
          individualPrice: t.pricing?.[0]?.price || '',
          duration: t.pricing?.[0]?.durationMinutes || 60,
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const sports = Array.isArray(data.sports) ? data.sports : (data.sports ? [data.sports] : []);
      const payload = {
        bio: data.bio,
        experience: parseInt(data.experience) || 0,
        sports,
        pricing: [{
          sessionType: 'individual',
          price: parseFloat(data.individualPrice) || 0,
          durationMinutes: parseInt(data.duration) || 60,
        }],
      };

      if (isExisting) {
        await trainerService.updateProfile(payload);
        toast.success('Trainer profile updated!');
      } else {
        await trainerService.createProfile(payload);
        setIsExisting(true);
        toast.success('Trainer profile created!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="section-title">{isExisting ? 'Edit Trainer Profile' : 'Set Up Trainer Profile'}</h1>
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
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Saving...</>
          ) : (
            isExisting ? 'Update Trainer Profile' : 'Save Trainer Profile'
          )}
        </button>
      </form>
    </div>
  );
}
