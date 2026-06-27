import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { venueService } from '../../services/index';
import VenueCard from '../../components/venue/VenueCard.jsx';
import { SkeletonCard, EmptyState } from '../../components/common/index.jsx';
import { useGeolocation } from '../../hooks/useSocket';
import toast from 'react-hot-toast';

export default function VenueSearch() {
  const { coordinates } = useGeolocation();
  const [venues,    setVenues]    = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { search(1); }, [coordinates]);

  const search = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12 };
      if (searchQuery) params.search = searchQuery;
      if (coordinates) {
        const { data } = await venueService.getNearby({ ...params, lat: coordinates.lat, lng: coordinates.lng });
        setVenues(data.data.venues);
        setTotal(data.data.pagination.total);
      } else {
        const { data } = await venueService.getAll(params);
        setVenues(data.data.venues);
        setTotal(data.data.pagination.total);
      }
      setPage(p);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Find Venues</h1>
        <p className="section-sub">{total > 0 ? `${total} venues found` : 'Search sports venues near you'}</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-10"
            placeholder="Search by name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search(1)}
          />
        </div>
        <button onClick={() => search(1)} className="btn-primary">Search</button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : venues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map((v) => <VenueCard key={v._id} venue={v} />)}
        </div>
      ) : (
        <EmptyState icon="🏟️" title="No venues found" description="Try adjusting your filters or search a different area." />
      )}

      {/* Pagination */}
      {total > 12 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => search(page - 1)} className="btn-secondary">Previous</button>
          <span className="flex items-center text-sm text-gray-500">Page {page} of {Math.ceil(total / 12)}</span>
          <button disabled={page >= Math.ceil(total / 12)} onClick={() => search(page + 1)} className="btn-secondary">Next</button>
        </div>
      )}
    </div>
  );
}
