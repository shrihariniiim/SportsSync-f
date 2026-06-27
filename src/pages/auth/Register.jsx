import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SPORT_TYPES, SKILL_LEVELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'player',     label: '🏃 Player',      desc: 'Book venues & join games' },
  { value: 'turf_owner', label: '🏟️ Turf Owner',   desc: 'List & manage your venues' },
  { value: 'trainer',    label: '🏋️ Trainer',      desc: 'Offer coaching sessions'   },
  { value: 'organizer',  label: '🏆 Organizer',    desc: 'Host events & tournaments'  },
];

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'player' } });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { register: registerUser } = useAuth();
  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (data.preferredSports) data.preferredSports = Array.isArray(data.preferredSports) ? data.preferredSports : [data.preferredSports];
      await registerUser(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest to-primary-700 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">⚽</div>
            <h1 className="text-2xl font-bold text-gray-900">Join SportSync</h1>
            <p className="text-sm text-gray-500 mt-1">India's sports marketplace platform</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role selection */}
            <div>
              <label className="label">I am a...</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(({ value, label, desc }) => (
                  <label key={value} className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${selectedRole === value ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" value={value} className="sr-only" {...register('role')} />
                    <div className="font-semibold text-sm text-gray-900">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Common fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name</label>
                <input className={`input ${errors.name ? 'input-error' : ''}`} placeholder="Your full name"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div className="col-span-2">
                <label className="label">Email Address</label>
                <input type="email" className={`input ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com"
                  {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="label">Phone</label>
                <input type="tel" className="input" placeholder="9876543210" {...register('phone')} />
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className={`input pr-10 ${errors.password ? 'input-error' : ''}`} placeholder="Min 6 chars"
                    {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>
            </div>

            {/* Role-specific fields */}
            {selectedRole === 'player' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700">Player Details</h4>
                <div>
                  <label className="label">Skill Level</label>
                  <select className="input" {...register('skillLevel')}>
                    {SKILL_LEVELS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label mb-2">Preferred Sports</label>
                  <div className="flex flex-wrap gap-2">
                    {SPORT_TYPES.map((s) => (
                      <label key={s.value} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" value={s.value} className="rounded text-primary-600" {...register('preferredSports')} />
                        <span className="text-sm text-gray-700">{s.emoji} {s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'turf_owner' && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700">Business Details</h4>
                <div>
                  <label className="label">Business Name</label>
                  <input className="input" placeholder="Your sports arena name" {...register('businessName')} />
                </div>
                <div>
                  <label className="label">GST Number (optional)</label>
                  <input className="input" placeholder="22AAAAA0000A1Z5" {...register('gstNumber')} />
                </div>
              </div>
            )}

            {selectedRole === 'trainer' && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700">Trainer Details</h4>
                <div>
                  <label className="label">Years of Experience</label>
                  <input type="number" min="0" className="input" placeholder="5" {...register('experience', { valueAsNumber: true })} />
                </div>
              </div>
            )}

            {selectedRole === 'organizer' && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Organization Details</h4>
                <label className="label">Organization Name</label>
                <input className="input" placeholder="Chennai Sports Club" {...register('organizationName')} />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
