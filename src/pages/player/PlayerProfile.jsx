import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/slices/authSlice';
import { authService } from '../../services/index';
import { Avatar } from '../../components/common/index.jsx';
import { SPORT_TYPES, SKILL_LEVELS, AVAILABILITY_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function PlayerProfile() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [loading,     setLoading]     = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const { register, handleSubmit } = useForm({ defaultValues: {
    name:          user?.name || '',
    phone:         user?.phone || '',
    skillLevel:    user?.skillLevel || 'beginner',
    preferredSports: user?.preferredSports || [],
    availabilityStatus: user?.availability?.status || 'unavailable',
  }});

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await authService.updateMe({
        name: data.name,
        phone: data.phone,
        skillLevel: data.skillLevel,
        preferredSports: data.preferredSports,
        'availability.status': data.availabilityStatus,
      });
      dispatch(updateUser(res.data.user));
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await authService.updateAvatar(fd);
      dispatch(updateUser({ avatar: data.data.avatarUrl }));
      toast.success('Avatar updated!');
    } catch { toast.error('Failed to upload avatar'); }
    finally { setAvatarLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="section-title">My Profile</h1>
        <p className="section-sub">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar user={user} size="xl" />
            <label className="absolute -bottom-1 -right-1 p-1.5 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
              {avatarLoading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge badge-green mt-1 capitalize">{user?.role?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" {...register('name', { required: true })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" type="tel" {...register('phone')} />
          </div>
        </div>

        {user?.role === 'player' && (
          <>
            <div>
              <label className="label">Skill Level</label>
              <select className="input" {...register('skillLevel')}>
                {SKILL_LEVELS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="label mb-2">Preferred Sports</label>
              <div className="flex flex-wrap gap-3">
                {SPORT_TYPES.map((s) => (
                  <label key={s.value} className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" value={s.value} className="rounded text-primary-600" {...register('preferredSports')} />
                    <span className="text-sm text-gray-700">{s.emoji} {s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Availability</label>
              <select className="input" {...register('availabilityStatus')}>
                {AVAILABILITY_STATUS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
        </button>
      </form>
    </div>
  );
}
