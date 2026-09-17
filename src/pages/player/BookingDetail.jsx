import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, MapPin, Phone, ShieldCheck, AlertCircle, Loader2, IndianRupee, CheckCircle, XCircle } from 'lucide-react';
import { bookingService } from '../../services/index';
import { LoadingSpinner } from '../../components/common/index.jsx';
import { BOOKING_STATUS_MAP, PAYMENT_STATUS_MAP, SPORT_TYPES } from '../../utils/constants';
import { friendlyDate, formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const { data } = await bookingService.getById(id);
      setBooking(data.data.booking);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking not found');
      navigate('/bookings/my');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    const isPaid = booking?.paymentStatus === 'paid';
    const confirmMessage = isPaid
      ? 'Are you sure you want to cancel this booking? A refund will be automatically processed to your original payment method.'
      : 'Are you sure you want to cancel this booking?';

    if (!window.confirm(confirmMessage)) return;

    const reason = window.prompt('Reason for cancellation (optional):') || 'Cancelled by player';
    setCancelling(true);
    try {
      await bookingService.cancel(id, reason);
      toast.success(isPaid ? 'Booking cancelled and refund initiated!' : 'Booking cancelled successfully');
      fetchBooking();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!booking) return null;

  const statusInfo = BOOKING_STATUS_MAP[booking.bookingStatus] || BOOKING_STATUS_MAP.pending;
  const paymentInfo = PAYMENT_STATUS_MAP[booking.paymentStatus] || PAYMENT_STATUS_MAP.pending;
  const sportInfo = SPORT_TYPES.find((s) => s.value === booking.sport);
  const venueImage = booking.venue?.images?.[0] || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=70';

  const canCancel = ['pending', 'confirmed'].includes(booking.bookingStatus);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/bookings/my')}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft size={16} /> Back to My Bookings
      </button>

      <div className="card overflow-hidden">
        {/* Status header banner */}
        <div className="p-6 bg-gradient-to-r from-forest to-forest-dark text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">Booking Reference</p>
              <h1 className="text-2xl font-bold">{booking.bookingNumber || booking._id}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentInfo.color}`}>
                Payment: {paymentInfo.label}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Venue information card */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 items-start">
            <img
              src={venueImage}
              alt={booking.venue?.name}
              className="w-24 h-24 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {sportInfo && (
                  <span className="text-xs font-medium px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full">
                    {sportInfo.emoji} {sportInfo.label}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {booking.venue?.name || 'Venue'}
              </h2>
              {booking.venue?.address && (
                <p className="text-xs text-gray-500 flex items-start gap-1 mt-1">
                  <MapPin size={13} className="shrink-0 mt-0.5 text-gray-400" />
                  <span>
                    {typeof booking.venue.address === 'object'
                      ? [booking.venue.address.street, booking.venue.address.city, booking.venue.address.state].filter(Boolean).join(', ')
                      : booking.venue.address}
                  </span>
                </p>
              )}
              {booking.venue?.contactPhone && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Phone size={13} className="shrink-0 text-gray-400" />
                  <span>{booking.venue.contactPhone}</span>
                </p>
              )}
              {booking.venue?._id && (
                <Link
                  to={`/venues/${booking.venue._id}`}
                  className="inline-block mt-2 text-xs font-medium text-primary-600 hover:text-primary-800 underline"
                >
                  View Venue Details →
                </Link>
              )}
            </div>
          </div>

          {/* Schedule details */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Booking Schedule</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <Calendar size={14} className="text-primary-600" /> Date
                </div>
                <p className="text-sm font-semibold text-gray-900">{friendlyDate(booking.date)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <Clock size={14} className="text-primary-600" /> Time
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {booking.startTime} – {booking.endTime}
                </p>
              </div>
            </div>
          </div>

          {/* Payment summary */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Payment Summary</h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Slot Base Price</span>
                <span>{formatCurrency(booking.amount?.basePrice || booking.amount?.total || 0)}</span>
              </div>
              {booking.amount?.taxes > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees</span>
                  <span>{formatCurrency(booking.amount.taxes)}</span>
                </div>
              )}
              {booking.amount?.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(booking.amount.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-base">
                <span>Total Amount</span>
                <span className="text-primary-700">{formatCurrency(booking.amount?.total || 0)}</span>
              </div>
            </div>
          </div>

          {/* Cancellation policy & actions */}
          {canCancel ? (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
                <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
                <span>
                  {booking.paymentStatus === 'paid'
                    ? 'Cancelling this confirmed booking will automatically trigger a full refund to your original payment method via Razorpay.'
                    : 'Cancelling will release your reserved slot for other players.'}
                </span>
              </div>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="btn-danger w-full btn-lg"
              >
                {cancelling ? (
                  <>
                    <Loader2 size={16} className="animate-spin inline mr-2" /> Processing Cancellation...
                  </>
                ) : (
                  'Cancel Booking'
                )}
              </button>
            </div>
          ) : booking.bookingStatus === 'cancelled' ? (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-sm text-red-800">
              <p className="font-semibold flex items-center gap-1.5">
                <XCircle size={16} className="text-red-600" /> Booking Cancelled
              </p>
              {booking.cancellationReason && (
                <p className="text-xs mt-1 text-red-700">Reason: {booking.cancellationReason}</p>
              )}
              {booking.paymentStatus === 'refunded' && (
                <p className="text-xs font-medium text-emerald-700 mt-2">
                  ✅ Refund processed via Razorpay.
                </p>
              )}
            </div>
          ) : booking.bookingStatus === 'completed' ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-600" />
              <span className="font-medium">This booking is completed. Hope you had a great game!</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
