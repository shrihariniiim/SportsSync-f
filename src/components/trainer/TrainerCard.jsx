import { Link } from 'react-router-dom';
import { Star, MapPin, Award, IndianRupee } from 'lucide-react';
import { Avatar } from '../common/index.jsx';
import { SPORT_TYPES } from '../../utils/constants';

export default function TrainerCard({ trainer }) {
  const { _id, user, bio, sports, experience, pricing, rating, reviewCount, totalSessions, certifications } = trainer;

  const lowestPrice = pricing?.length ? Math.min(...pricing.map((p) => p.price)) : null;

  return (
    <Link to={`/trainers/${_id}`} className="card-hover block">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar user={user} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm">{user?.name}</h3>
            <p className="text-xs text-gray-500 mb-1">{experience} yr{experience !== 1 ? 's' : ''} experience</p>
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
              </div>
            )}
          </div>
          {certifications?.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-primary-600 font-medium">
              <Award size={13} /> Certified
            </div>
          )}
        </div>

        {/* Bio */}
        {bio && <p className="text-xs text-gray-600 mb-3 line-clamp-2">{bio}</p>}

        {/* Sports */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {sports?.slice(0, 3).map((sport) => {
            const s = SPORT_TYPES.find((t) => t.value === sport);
            return (
              <span key={sport} className="sport-chip">
                {s?.emoji} {s?.label || sport}
              </span>
            );
          })}
        </div>

        {/* Stats + Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-500">{totalSessions} sessions</span>
          {lowestPrice != null && (
            <div className="flex items-center gap-0.5 text-sm font-bold text-primary-700">
              <IndianRupee size={12} />
              {lowestPrice.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-500">/session</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
