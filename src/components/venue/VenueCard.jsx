import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, IndianRupee, Wifi } from 'lucide-react';
import { formatCurrency, formatDistance } from '../../utils/formatters';
import { SPORT_TYPES } from '../../utils/constants';

export default function VenueCard({ venue }) {
  const { _id, name, address, images, sports, pricing, rating, reviewCount, venueType, distance, isVerified, isCurrentlyAvailable, availabilityLabel } = venue;

  const lowestPrice = pricing?.length
    ? Math.min(...pricing.map((p) => p.pricePerHour))
    : null;

  const mainImage = images?.[0] || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80';

  return (
    <Link to={`/venues/${_id}`} className={`card-hover block group ${isCurrentlyAvailable ? '' : 'opacity-80'}`}>
      {/* Image */}
      <div className="relative h-44 overflow-hidden rounded-t-xl">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge badge-blue capitalize">{venueType}</span>
          {isVerified && <span className="badge bg-green-500 text-white">✓ Verified</span>}
          <span className={`badge ${isCurrentlyAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{availabilityLabel || 'Open'}</span>
        </div>
        {distance != null && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
            <MapPin size={11} /> {formatDistance(distance)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{name}</h3>
          {rating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{address?.city}, {address?.state}</span>
        </div>

        {/* Sports chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {sports?.slice(0, 3).map((sport) => {
            const s = SPORT_TYPES.find((t) => t.value === sport);
            return (
              <span key={sport} className="sport-chip">
                {s?.emoji} {s?.label || sport}
              </span>
            );
          })}
          {sports?.length > 3 && <span className="badge-gray badge">+{sports.length - 3}</span>}
        </div>

        {/* Price */}
        {lowestPrice != null && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={11} /> From
            </div>
            <div className="flex items-center gap-0.5 font-bold text-primary-700 text-sm">
              <IndianRupee size={12} />
              {lowestPrice.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-500">/hr</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
