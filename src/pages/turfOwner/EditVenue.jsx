import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, MapPin, Trash2, X } from 'lucide-react';
import { venueService } from '../../services/index';
import { useGeolocation } from '../../hooks/useSocket';
import { SPORT_TYPES, VENUE_TYPES, AMENITIES } from '../../utils/constants';
import { LoadingSpinner } from '../../components/common/index.jsx';
import toast from 'react-hot-toast';

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { coordinates: geoCoordinates, requestLocation } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [existingImages, setExistingImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [localCoordinates, setLocalCoordinates] = useState(null);

  useEffect(() => {
    fetchVenue();
  }, [id]);

  const fetchVenue = async () => {
    try {
      const { data } = await venueService.getById(id);
      const venue = data.data.venue;

      // Populate existing images
      setExistingImages(venue.images || []);

      // Populate coordinates
      if (venue.location?.coordinates) {
        setLocalCoordinates({
          lat: venue.location.coordinates[1],
          lng: venue.location.coordinates[0],
        });
      }

      // Populate flat form fields
      const flatData = {
        name: venue.name || '',
        description: venue.description || '',
        venueType: venue.venueType || 'outdoor',
        street: venue.address?.street || '',
        city: venue.address?.city || '',
        state: venue.address?.state || '',
        pincode: venue.address?.pincode || '',
        sports: venue.sports || [],
        amenities: venue.amenities || [],
      };

      if (venue.openingHours?.length > 0) {
        flatData.openTime = venue.openingHours[0].open || '06:00';
        flatData.closeTime = venue.openingHours[0].close || '23:00';
      } else {
        flatData.openTime = '06:00';
        flatData.closeTime = '23:00';
      }

      venue.pricing?.forEach((p) => {
        flatData[`price_${p.sport}`] = p.pricePerHour;
      });

      reset(flatData);
    } catch (err) {
      toast.error('Failed to load venue details');
      navigate('/owner/venues');
    } finally {
      setFetching(false);
    }
  };

  // Sync geolocation hook's coordinates to local state when requested
  useEffect(() => {
    if (geoCoordinates) {
      setLocalCoordinates(geoCoordinates);
    }
  }, [geoCoordinates]);

  // Generate previews for newly selected images
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
    const maxAllowed = 6 - existingImages.length;

    if (existingImages.length + validImages.length > 6) {
      toast.error(`You can only have up to 6 images in total. Allowed new: ${maxAllowed}`);
    }

    setSelectedImages((prev) => {
      const combined = [...prev, ...validImages];
      return combined.slice(0, maxAllowed);
    });
  };

  const handleRemoveExistingImage = (imgUrl) => {
    setExistingImages((prev) => prev.filter((img) => img !== imgUrl));
  };

  const handleRemoveSelectedImage = (indexToRemove) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const sports = Array.isArray(data.sports) ? data.sports : [data.sports].filter(Boolean);
      const amenities = Array.isArray(data.amenities) ? data.amenities : [];
      const pricing = sports.map((sport) => ({
        sport,
        pricePerHour: parseInt(data[`price_${sport}`] || 500),
      }));
      const openingHours = Array.from({ length: 7 }, (_, day) => ({
        day, open: data.openTime || '06:00', close: data.closeTime || '23:00', isClosed: false,
      }));

      const payload = {
        name: data.name,
        description: data.description,
        address: { street: data.street, city: data.city, state: data.state, pincode: data.pincode },
        sports,
        amenities,
        pricing,
        openingHours,
        venueType: data.venueType,
        lat: localCoordinates?.lat || parseFloat(data.lat),
        lng: localCoordinates?.lng || parseFloat(data.lng),
        images: existingImages, // Remaining existing image URLs
      };

      // 1. Update the venue details
      await venueService.update(id, payload);

      // 2. Upload new images if selected
      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach((file) => formData.append('images', file));
        await venueService.uploadImages(id, formData);
      }

      toast.success('Venue updated successfully!');
      navigate('/owner/venues');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update venue');
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="section-title">Edit Venue</h1>
        <p className="section-sub">Update your venue information and manage images</p>
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
            {localCoordinates ? (
              <div className="flex items-center justify-between">
                <p className="text-xs text-blue-600">📍 Location set: {localCoordinates.lat.toFixed(4)}, {localCoordinates.lng.toFixed(4)}</p>
                <button type="button" onClick={() => setLocalCoordinates(null)} className="text-xs text-red-500 hover:underline">
                  Edit manually
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs">Latitude *</label>
                  <input type="number" step="any" className="input"
                    placeholder="13.0827" {...register('lat', { required: !localCoordinates })} />
                </div>
                <div>
                  <label className="label text-xs">Longitude *</label>
                  <input type="number" step="any" className="input"
                    placeholder="80.2707" {...register('lng', { required: !localCoordinates })} />
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
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Venue Images</h2>
          <p className="text-sm text-gray-500">Manage your venue images. You can upload up to 6 images in total.</p>
          
          {/* Display Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Existing Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {existingImages.map((src, index) => (
                  <div key={src} className="relative group overflow-hidden rounded-xl border border-gray-200 bg-gray-50 animate-fadeIn">
                    <img src={src} alt={`Existing ${index + 1}`} className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(src)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-90 hover:opacity-100 hover:scale-105 transition-all shadow-md"
                      title="Delete Image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          {existingImages.length + selectedImages.length < 6 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Upload New</h3>
              <label className="block rounded-2xl border border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-700">Choose images ({6 - existingImages.length - selectedImages.length} slots left)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-xs">
              ⚠️ You have reached the maximum limit of 6 images. Delete some existing images if you wish to upload new ones.
            </div>
          )}

          {/* Previews of newly selected images */}
          {selectedImages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">New Previews</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imagePreviews.map((src, index) => (
                  <div key={src} className="relative group overflow-hidden rounded-xl border border-gray-200 bg-gray-50 animate-fadeIn">
                    <img src={src} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedImage(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-900 text-white opacity-85 hover:opacity-100 hover:scale-105 transition-all shadow-md"
                      title="Remove Preview"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Opening Hours */}
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold text-gray-800">Opening Hours</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Opens At</label>
              <input type="time" className="input" {...register('openTime')} />
            </div>
            <div>
              <label className="label">Closes At</label>
              <input type="time" className="input" {...register('closeTime')} />
            </div>
          </div>
          <p className="text-xs text-gray-400">These hours will be applied to all 7 days. You can update individual days later.</p>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving Changes...</> : '🏟️ Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
