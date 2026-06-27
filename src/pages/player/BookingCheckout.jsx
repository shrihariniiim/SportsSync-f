import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Calendar, IndianRupee, Shield, Loader2 } from 'lucide-react';
import { bookingService } from '../../services/index';
import { useAuth } from '../../hooks/useAuth';
import { SPORT_TYPES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function BookingCheckout() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const [loading,  setLoading]  = useState(false);
  const [booking,  setBooking]  = useState(null);
  const [rzpOrder, setRzpOrder] = useState(null);
  const [rzpKey,   setRzpKey]   = useState('');

  const { slotId, venueId, slot, venue } = state || {};

  useEffect(() => {
    if (!slotId) { navigate('/explore'); return; }
    initBooking();
  }, []);

  const initBooking = async () => {
    setLoading(true);
    try {
      const { data } = await bookingService.create({ slotId });
      setBooking(data.data.booking);
      setRzpOrder(data.data.razorpayOrder);
      setRzpKey(data.data.key);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not initiate booking');
      navigate(`/venues/${venueId}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (!rzpOrder) return;

    const options = {
      key:         rzpKey || import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:      rzpOrder.amount,
      currency:    rzpOrder.currency,
      name:        'SportSync',
      description: `Booking at ${venue?.name}`,
      order_id:    rzpOrder.id,
      prefill: {
        name:    user?.name,
        email:   user?.email,
        contact: user?.phone,
      },
      theme: { color: '#16a34a' },
      handler: async (response) => {
        try {
          await bookingService.verifyPayment({
            razorpayOrderId:    response.razorpay_order_id,
            razorpayPaymentId:  response.razorpay_payment_id,
            razorpaySignature:  response.razorpay_signature,
          });
          toast.success('🎉 Booking confirmed!');
          navigate('/bookings/my');
        } catch {
          toast.error('Payment verification failed. Contact support.');
        }
      },
      modal: {
        ondismiss: () => toast('Payment cancelled', { icon: 'ℹ️' }),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
    rzp.open();
  };

  // Load Razorpay script
  useEffect(() => {
    if (!document.getElementById('rzp-script')) {
      const script = document.createElement('script');
      script.id  = 'rzp-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
    }
  }, []);

  const sportInfo = SPORT_TYPES.find((s) => s.value === slot?.sport);
  const COMMISSION = 0.10;
  const subtotal   = slot?.price || 0;
  const fee        = Math.round(subtotal * COMMISSION);
  const total      = subtotal;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="animate-spin text-primary-600" />
        <p className="text-gray-600">Preparing your booking...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ChevronLeft size={16} /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">Review and complete your booking</p>
      </div>

      {/* Booking summary card */}
      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Booking Summary</h2>

        {/* Venue info */}
        {venue && (
          <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
            {venue.images?.[0] && (
              <img src={venue.images[0]} alt={venue.name} className="w-20 h-20 rounded-lg object-cover shrink-0" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{venue.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                <MapPin size={13} /> {venue.address?.city}
              </div>
              {venue.rating > 0 && (
                <div className="flex items-center gap-1 text-sm text-amber-500 mt-1">
                  ★ {venue.rating.toFixed(1)} <span className="text-gray-400">({venue.reviewCount} reviews)</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Slot details */}
        <div className="space-y-3 border-t border-gray-50 pt-4">
          {[
            { icon: <Calendar size={15} />, label: 'Date', value: slot?.date ? formatDate(slot.date) : '—' },
            { icon: <Clock size={15} />, label: 'Time', value: `${slot?.startTime} – ${slot?.endTime}` },
            { icon: <span className="text-base">{sportInfo?.emoji}</span>, label: 'Sport', value: sportInfo?.label || slot?.sport },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-500">{icon} {label}</span>
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Slot price</span>
            <span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Platform fee ({(COMMISSION * 100).toFixed(0)}%)</span>
            <span className="text-gray-400 line-through text-xs">included</span>
          </div>
          <div className="flex items-center justify-between font-bold text-base border-t border-gray-100 pt-2 mt-1">
            <span>Total</span>
            <span className="text-primary-700">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🔒', text: 'Secure Payment' },
          { icon: '✅', text: 'Instant Confirmation' },
          { icon: '💬', text: '24/7 Support' },
        ].map(({ icon, text }) => (
          <div key={text} className="card p-3 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-xs text-gray-600 font-medium">{text}</p>
          </div>
        ))}
      </div>

      {/* Pay button */}
      <button
        onClick={handlePayment}
        disabled={!rzpOrder}
        className="btn-primary w-full btn-lg text-base"
      >
        <Shield size={18} />
        Pay ₹{total.toLocaleString('en-IN')} Securely
      </button>

      <p className="text-center text-xs text-gray-400">
        Powered by Razorpay · 100% secure · No hidden charges
      </p>
    </div>
  );
}
