import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, ChevronLeft, ChevronRight, Shield, Loader2, Calendar } from 'lucide-react';
import { venueService, slotService } from '../../services/index';
import { StarRating, EmptyState, LoadingSpinner } from '../../components/common/index.jsx';
import { SPORT_TYPES } from '../../utils/constants';
import { formatDate, formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue,        setVenue]        = useState(null);
  const [slots,        setSlots]        = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [selectedSport,setSelectedSport]= useState('');
  const [imgIdx,       setImgIdx]       = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => { fetchVenue(); }, [id]);
  useEffect(() => { if (venue) fetchSlots(); }, [selectedDate, selectedSport, venue]);

  const fetchVenue = async () => {
    try {
      const { data } = await venueService.getById(id);
      setVenue(data.data.venue);
      if (data.data.venue.sports?.[0]) setSelectedSport(data.data.venue.sports[0]);
    } catch { toast.error('Venue not found'); navigate('/explore'); }
    finally { setLoading(false); }
  };

  const fetchSlots = async () => {
    setSlotsLoading(true);
    try {
      const { data } = await venueService.getSlots(id, { date: selectedDate, sport: selectedSport });
      setSlots(data.data.slots);
    } catch { setSlots([]); }
    finally { setSlotsLoading(false); }
  };

  const handleReserve = async (slot) => {
    if (slot.status !== 'available') return;
    try {
      await slotService.reserve(slot._id);
      toast.success('Slot reserved! Proceeding to checkout...');
      navigate('/bookings/checkout', { state: { slotId: slot._id, venueId: id, slot, venue } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reserve slot');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!venue)  return null;

  const images   = venue.images?.length ? venue.images : ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80'];
  const availabilityBanner = venue.availabilitySummary || { label: 'Open', reason: 'Open now', isAvailable: true };
  const mainImg  = images[imgIdx];
  const amenityIcons = { parking: '🚗', washroom: '🚿', floodlights: '💡', drinking_water: '💧', changing_room: '👕', cafeteria: '☕', air_conditioning: '❄️', first_aid: '🏥' };
  const venueCoords = venue.location?.coordinates;
  const hasLocation = Array.isArray(venueCoords) && venueCoords.length === 2;
  const [venueLng, venueLat] = hasLocation ? venueCoords : [null, null];
  const mapSrc = hasLocation
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${venueLng - 0.02}%2C${venueLat - 0.01}%2C${venueLng + 0.02}%2C${venueLat + 0.01}&layer=mapnik&marker=${venueLat}%2C${venueLng}`
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft size={16} /> Back to venues
      </button>

      {/* Gallery */}
      <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100">
        <img src={mainImg} alt={venue.name} className="w-full h-full object-cover" />
        {images.length > 1 && (
          <>
            <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setImgIdx((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/40'}`} />
              ))}
            </div>
          </>
        )}
        {venue.isVerified && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            <Shield size={12} /> Verified
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Venue info */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{venue.name}</h1>
              {venue.rating > 0 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <StarRating rating={venue.rating} />
                  <span className="text-sm font-semibold">{venue.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({venue.reviewCount})</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
              <MapPin size={14} />
              {venue.address?.street && `${venue.address.street}, `}
              {venue.address?.city}, {venue.address?.state} {venue.address?.pincode}
            </div>
          </div>

          {venue.description && <p className="text-gray-600 text-sm leading-relaxed">{venue.description}</p>}

          <div className={`rounded-xl border px-3 py-2 text-sm ${availabilityBanner.isAvailable ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
            <span className="font-semibold">{availabilityBanner.label}</span>
            {availabilityBanner.reason ? <span className="ml-2">• {availabilityBanner.reason}</span> : null}
          </div>

          {hasLocation && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <iframe
                  title="Venue location"
                  src={mapSrc}
                  className="w-full h-64 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}

          {/* Sports */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Sports Available</h3>
            <div className="flex flex-wrap gap-2">
              {venue.sports?.map((sport) => {
                const s = SPORT_TYPES.find((t) => t.value === sport);
                return <span key={sport} className="sport-chip text-sm px-3 py-1.5">{s?.emoji} {s?.label || sport}</span>;
              })}
            </div>
          </div>

          {/* Amenities */}
          {venue.amenities?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100">
                    {amenityIcons[a] || '✓'} {a.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {venue.pricing?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Pricing</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {venue.pricing.map((p) => {
                  const s = SPORT_TYPES.find((t) => t.value === p.sport);
                  return (
                    <div key={p.sport} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-sm text-gray-700">{s?.emoji} {s?.label || p.sport}</span>
                      <span className="font-bold text-primary-700 text-sm">₹{p.pricePerHour}/hr</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Opening Hours */}
          {venue.openingHours?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Opening Hours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => {
                  const h = venue.openingHours.find((o) => o.day === i);
                  return (
                    <div key={day} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm">
                      <span className="font-medium text-gray-700 w-10">{day}</span>
                      {h?.isClosed ? <span className="text-red-500">Closed</span> : <span className="text-gray-600">{h?.open || '06:00'} – {h?.close || '23:00'}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Slot picker */}
        <div className="space-y-4">
          <div className="card p-4 space-y-4 sticky top-20">
            <h3 className="font-semibold text-gray-900">Book a Slot</h3>
            {!venue.isCurrentlyAvailable && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                {venue.availabilityLabel || 'Currently unavailable'}
              </div>
            )}

            {/* Date picker */}
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                className="input"
                min={todayISO()}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Sport picker */}
            {venue.sports?.length > 1 && (
              <div>
                <label className="label">Sport</label>
                <select className="input" value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
                  {venue.sports.map((s) => {
                    const info = SPORT_TYPES.find((t) => t.value === s);
                    return <option key={s} value={s}>{info?.emoji} {info?.label || s}</option>;
                  })}
                </select>
              </div>
            )}

            {/* Slots */}
            <div>
              <label className="label">Available Slots</label>
              {slotsLoading ? (
                <div className="flex justify-center py-6"><LoadingSpinner /></div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {slots.map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => handleReserve(slot)}
                      disabled={slot.status !== 'available' || !venue.isCurrentlyAvailable}
                      className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                        slot.status === 'available' && venue.isCurrentlyAvailable
                          ? 'border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 active:scale-95'
                          : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-semibold">{slot.startTime}</div>
                      <div className="text-xs">{slot.status === 'available' ? `₹${slot.price}` : slot.status}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-gray-400">
                  <Calendar size={28} className="mx-auto mb-2 text-gray-300" />
                  No slots for this date
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}
