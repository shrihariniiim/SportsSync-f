import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { venueService } from '../../services/index';
import { EmptyState, LoadingSpinner } from '../../components/common/index.jsx';
import toast from 'react-hot-toast';

export default function ManageVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusDrafts, setStatusDrafts] = useState({});

  useEffect(() => { fetchVenues(); }, []);

  const fetchVenues = async () => {
    try {
      const { data } = await venueService.getMyVenues();
      setVenues(data.data.venues);
    } catch { toast.error('Failed to load venues'); }
    finally  { setLoading(false); }
  };

  const toggleActive = async (venue) => {
    try {
      await venueService.update(venue._id, { isActive: !venue.isActive });
      setVenues((v) => v.map((x) => x._id === venue._id ? { ...x, isActive: !x.isActive } : x));
      toast.success(`Venue ${venue.isActive ? 'deactivated' : 'activated'}`);
    } catch { toast.error('Update failed'); }
  };

  const updateVenueAvailability = async (venue) => {
    const value = statusDrafts[venue._id] || venue.availability?.manualOverride || 'auto';
    try {
      const { data } = await venueService.updateAvailability(venue._id, { manualOverride: value });
      setVenues((v) => v.map((x) => x._id === venue._id ? data.data.venue : x));
      toast.success('Availability updated');
    } catch { toast.error('Update failed'); }
  };

  const deleteVenue = async (id) => {
    if (!confirm('Delete this venue? This cannot be undone.')) return;
    try {
      await venueService.delete(id);
      setVenues((v) => v.filter((x) => x._id !== id));
      toast.success('Venue deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">My Venues</h1>
          <p className="section-sub">{venues.length} venue{venues.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/owner/venues/add" className="btn-primary gap-2"><Plus size={16} /> Add Venue</Link>
      </div>

      {venues.length === 0 ? (
        <EmptyState icon="🏟️" title="No venues yet"
          description="Add your first sports venue to start receiving bookings."
          action={<Link to="/owner/venues/add" className="btn-primary btn">Add Venue</Link>} />
      ) : (
        <div className="space-y-3">
          {venues.map((venue) => (
            <div key={venue._id} className="card p-4 flex items-center gap-4">
              {venue.images?.[0] ? (
                <img src={venue.images[0]} alt={venue.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl shrink-0">🏟️</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{venue.name}</h3>
                  {venue.isVerified && <span className="badge badge-blue">Verified</span>}
                </div>
                <p className="text-sm text-gray-500">{venue.address?.city}, {venue.address?.state}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {venue.sports?.slice(0, 3).map((s) => <span key={s} className="badge badge-gray capitalize">{s}</span>)}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`badge ${venue.isCurrentlyAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {venue.availabilityLabel || 'Open'}
                  </span>
                  <select
                    value={statusDrafts[venue._id] ?? venue.availability?.manualOverride ?? 'auto'}
                    onChange={(e) => setStatusDrafts((prev) => ({ ...prev, [venue._id]: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="auto">Auto</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="paused">Paused</option>
                    <option value="holiday">Holiday</option>
                  </select>
                  <button onClick={() => updateVenueAvailability(venue)} className="btn-secondary px-2 py-1 text-sm">Apply</button>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(venue)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title={venue.isActive ? 'Deactivate' : 'Activate'}>
                  {venue.isActive ? <ToggleRight size={20} className="text-primary-600" /> : <ToggleLeft size={20} className="text-gray-400" />}
                </button>
                <Link to={`/venues/${venue._id}`} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500" title="View Venue">
                  <Eye size={18} />
                </Link>
                <Link to={`/owner/venues/edit/${venue._id}`} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500" title="Edit Venue">
                  <Edit size={18} />
                </Link>
                <button onClick={() => deleteVenue(venue._id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500" title="Delete Venue">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
