import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Award, Calendar, Clock, IndianRupee, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { trainerService, reviewService } from '../../services/index';
import { Avatar, LoadingSpinner, StarRating } from '../../components/common/index.jsx';
import { SPORT_TYPES } from '../../utils/constants';
import { friendlyDate, formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function TrainerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trainer, setTrainer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    date: '',
    startTime: '10:00',
    sport: '',
    sessionType: 'individual',
    notes: '',
  });

  useEffect(() => {
    fetchTrainerData();
  }, [id]);

  const fetchTrainerData = async () => {
    setLoading(true);
    try {
      const [trainerRes, reviewsRes] = await Promise.all([
        trainerService.getById(id),
        reviewService.getTrainerReviews(id).catch(() => ({ data: { data: { reviews: [] } } })),
      ]);

      const t = trainerRes.data.data.trainer;
      setTrainer(t);
      if (t.sports?.[0]) {
        setBookingForm((prev) => ({ ...prev, sport: t.sports[0] }));
      }
      setReviews(reviewsRes.data?.data?.reviews || []);
    } catch (err) {
      toast.error('Trainer not found');
      navigate('/trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!bookingForm.date) {
      toast.error('Please select a session date');
      return;
    }

    setBookingLoading(true);
    try {
      await trainerService.book(id, bookingForm);
      toast.success('Session booking request sent successfully!');
      setBookingModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not book trainer session');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!trainer) return null;

  const { bio, sports, experience, pricing, rating, reviewCount, certifications } = trainer;
  const trainerUser = trainer.user;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/trainers')}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Trainers
      </button>

      {/* Profile Overview Card */}
      <div className="card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-gray-100">
          <Avatar user={trainerUser} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{trainerUser?.name}</h1>
              {certifications?.length > 0 && (
                <span className="badge badge-green flex items-center gap-1 text-xs">
                  <Award size={13} /> Certified Coach
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {experience} year{experience !== 1 ? 's' : ''} professional coaching experience
            </p>
            {rating > 0 ? (
              <div className="flex items-center gap-2">
                <StarRating rating={rating} />
                <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({reviewCount} verified reviews)</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">New Coach · No reviews yet</span>
            )}
          </div>
          <button
            onClick={() => setBookingModalOpen(true)}
            className="btn-primary btn-lg w-full sm:w-auto shrink-0 shadow-md"
          >
            Book Session
          </button>
        </div>

        {/* Bio */}
        {bio && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2">About the Trainer</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{bio}</p>
          </div>
        )}

        {/* Sports / Specialties */}
        {sports?.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {sports.map((sport) => {
                const s = SPORT_TYPES.find((t) => t.value === sport);
                return (
                  <span key={sport} className="sport-chip text-sm py-1.5 px-3">
                    {s?.emoji} {s?.label || sport}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-2">Certifications & Credentials</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {certifications.map((cert, index) => (
                <li key={index} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl text-xs text-gray-700 font-medium">
                  <CheckCircle size={15} className="text-primary-600 shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pricing Packages */}
        {pricing?.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">Session Rates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pricing.map((p, index) => (
                <div key={index} className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-primary-700 capitalize">
                      {p.sessionType} Session
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.durationMinutes || 60} minutes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 flex items-center gap-0.5">
                      <IndianRupee size={15} />{p.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Player Reviews ({reviews.length})</h2>
          </div>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar user={r.user} size="sm" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{r.user?.name}</p>
                        <p className="text-[10px] text-gray-400">{friendlyDate(r.createdAt)}</p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={14} />
                  </div>
                  {r.comment && <p className="text-xs text-gray-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-500">No reviews yet for this trainer.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Book Training Session</h3>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sport</label>
                <select
                  value={bookingForm.sport}
                  onChange={(e) => setBookingForm({ ...bookingForm, sport: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select sport</option>
                  {sports?.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Session Date</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Time</label>
                  <input
                    type="time"
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Session Type</label>
                <select
                  value={bookingForm.sessionType}
                  onChange={(e) => setBookingForm({ ...bookingForm, sessionType: e.target.value })}
                  className="input"
                >
                  <option value="individual">Individual 1-on-1</option>
                  <option value="group">Group Coaching</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notes / Goals</label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder="e.g. Focus on backhand technique, fitness endurance..."
                  className="input resize-none h-20 text-xs"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn-primary flex-1"
                >
                  {bookingLoading ? <Loader2 size={16} className="animate-spin inline" /> : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
