import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, MapPin } from 'lucide-react';
import { venueService } from '../../services/index';
import { useGeolocation } from '../../hooks/useSocket';
import { SPORT_TYPES, VENUE_TYPES, AMENITIES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function AddVenue() {
  const navigate = useNavigate();
  const { coordinates, requestLocation } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const sports   = Array.isArray(data.sports) ? data.sports : [data.sports].filter(Boolean);
      const amenities = Array.isArray(data.amenities) ? data.amenities : [];
      const pricing  = sports.map((sport) => ({
        sport,
        pricePerHour: parseInt(data[`price_${sport}`] || 500),
      }));
      const openingHours = Array.from({ length: 7 }, (_, day) => ({
        day, open: data.openTime || '06:00', close: data.closeTime || '23:00', isClosed: false,
      }));

      const payload = {
        name:        data.name,
        description: data.description,
        address: { street: data.street, city: data.city, state: data.state, pincode: data.pincode },
        sports, amenities, pricing, openingHours,
        venueType: data.venueType,
        lat: coordinates?.lat || parseFloat(data.lat),
        lng: coordinates?.lng || parseFloat(data.lng),
      };

      const { data: response } = await venueService.create(payload);
      const venueId = response.data.venue._id;

      if (selectedImages.length) {
        const formData = new FormData();
        selectedImages.forEach((file) => formData.append('images', file));
        await venueService.uploadImages(venueId, formData);
      }

      toast.success('Venue created successfully!');
      navigate('/owner/venues');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create venue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedImages.length) {
      setImagePreviews([]);
      return;
    }

    const previews = selectedImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    const validImages = files.filter((file) => file.type.startsWith('image/'));
    setSelectedImages(validImages.slice(0, 6));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="section-title">Add New Venue</h1>
        <p className="section-sub">Fill in your venue details to start accepting bookings</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Information</h2>
          <div>
            <label className="label">Venue Name *</label>
            <input className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Chennai Sports Hub"
              {...register('name', { required: 'Venue name required' })} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={3} className="input resize-none"
              placeholder="Describe your venue, facilities, and what makes it special..."
              {...register('description')} />
          </div>
          <div>
            <label className="label">Venue Type *</label>
            <select className="input" {...register('venueType', { required: true })}>
              {VENUE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Street Address</label>
              <input className="input" placeholder="123 Main Street" {...register('street')} />
            </div>
            <div>
              <label className="label">City *</label>
              <input className={`input ${errors.city ? 'input-error' : ''}`} placeholder="Chennai"
                {...register('city', { required: 'City required' })} />
            </div>
            <div>
              <label className="label">State *</label>
              <input className={`input ${errors.state ? 'input-error' : ''}`} placeholder="Tamil Nadu"
                {...register('state', { required: 'State required' })} />
            </div>
            <div>
              <label className="label">Pincode</label>
              <input className="input" placeholder="600001" {...register('pincode')} />
            </div>
          </div>

          {/* Coordinates */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-700">Location Coordinates</p>
              <button type="button" onClick={requestLocation} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                <MapPin size={12} /> Use my location
              </button>
            </div>
            {coordinates ? (
              <p className="text-xs text-blue-600">📍 Location set: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs">Latitude *</label>
                  <input type="number" step="any" className="input"
                    placeholder="13.0827" {...register('lat', { required: !coordinates })} />
                </div>
                <div>
                  <label className="label text-xs">Longitude *</label>
                  <input type="number" step="any" className="input"
                    placeholder="80.2707" {...register('lng', { required: !coordinates })} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sports & Pricing */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Sports & Pricing</h2>
          <div>
            <label className="label mb-2">Available Sports *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SPORT_TYPES.map((s) => (
                <label key={s.value} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" value={s.value} className="rounded text-primary-600" {...register('sports', { required: 'Select at least one sport' })} />
                  <span className="text-sm">{s.emoji} {s.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SPORT_TYPES.map((s) => (
              <div key={s.value}>
                <label className="label text-xs">{s.emoji} {s.label} price/hr (₹)</label>
                <input type="number" min="0" className="input" placeholder="500" {...register(`price_${s.value}`)} />
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold text-gray-800">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <label key={a} className="flex items-center gap-1.5 cursor-pointer border rounded-lg px-3 py-2 hover:bg-gray-50 text-sm">
                <input type="checkbox" value={a} className="rounded text-primary-600" {...register('amenities')} />
                {a.replace(/_/g, ' ')}
              </label>
            ))}
          </div>
        </div>

        {/* Venue Images */}
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold text-gray-800">Venue Images</h2>
          <p className="text-sm text-gray-500">Upload up to 6 images so customers can see your turf and facilities.</p>
          <label className="block rounded-2xl border border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-700">Choose images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleImageChange}
            />
          </label>
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {imagePreviews.map((src, index) => (
                <div key={src} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <img src={src} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
                </div>
              ))}
            </div>
          )}
          {selectedImages.length > 0 && (
            <p className="text-xs text-gray-500">{selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected</p>
          )}
        </div>

        {/* Opening Hours */}
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold text-gray-800">Opening Hours</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Opens At</label>
              <input type="time" className="input" defaultValue="06:00" {...register('openTime')} />
            </div>
            <div>
              <label className="label">Closes At</label>
              <input type="time" className="input" defaultValue="23:00" {...register('closeTime')} />
            </div>
          </div>
          <p className="text-xs text-gray-400">These hours will be applied to all 7 days. You can update individual days later.</p>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating Venue...</> : '🏟️ Create Venue'}
          </button>
        </div>
      </form>
    </div>
  );
}
