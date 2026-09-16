import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { setLocation, setLocationLoading, setLocationError } from '../store/slices/locationSlice';
import { addNotification } from '../store/slices/notificationSlice';
import { notificationService } from '../services/index';
import { setNotifications, markRead, markAllRead } from '../store/slices/notificationSlice';
import toast from 'react-hot-toast';

// ─── useGeolocation ───────────────────────────────────────────────────────────
export const useGeolocation = () => {
  const dispatch = useDispatch();
  const { coordinates, loading, error } = useSelector((s) => s.location ?? { coordinates: null, loading: false, error: null });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      dispatch(setLocationError('Geolocation is not supported by your browser'));
      return;
    }
    dispatch(setLocationLoading(true));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => dispatch(setLocation({ lat: coords.latitude, lng: coords.longitude })),
      (err) => dispatch(setLocationError(err.message)),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [dispatch]);

  return { coordinates, loading, error, requestLocation };
};

// ─── useSocket ────────────────────────────────────────────────────────────────
export const useSocket = () => {
  const accessToken = useSelector((s) => s.auth.accessToken);
  const dispatch    = useDispatch();
  const socketRef   = useRef(null);

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: accessToken },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => console.log('🔌 Socket connected'));
    socket.on('connect_error', (err) => console.warn('Socket error:', err.message));

    // Booking events
    socket.on('booking:confirmed', (data) => {
      toast.success(`Booking confirmed at ${data.venue}!`);
      dispatch(addNotification({ type: 'booking_confirmed', title: 'Booking Confirmed', message: `Your booking at ${data.venue} is confirmed.`, isRead: false, createdAt: new Date() }));
    });

    socket.on('booking:cancelled', (data) => {
      toast.error(`Booking ${data.bookingNumber} was cancelled`);
    });

    // Game events
    socket.on('game:full', (data) => {
      toast.success(`🎮 Game "${data.title}" is now full!`);
    });

    socket.on('game:joined', (data) => {
      toast.success(`${data.playerName} joined your game!`);
    });

    socket.on('game:cancelled', (data) => {
      toast.error(`Game "${data.title}" was cancelled`);
    });

    // Payment events
    socket.on('payment:received', (data) => {
      toast.success(`💰 Payment received: ₹${data.amount}`);
    });

    // Generic notification
    socket.on('notification:new', (notif) => {
      dispatch(addNotification(notif));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, dispatch]);

  return socketRef;
};

// ─── useNotifications ─────────────────────────────────────────────────────────
export const useNotifications = () => {
  const dispatch   = useDispatch();
  const { items, unreadCount } = useSelector((s) => s.notifications);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await notificationService.getAll({ limit: 20 });
      dispatch(setNotifications(data.data));
    } catch {}
  }, [dispatch]);

  const handleMarkRead = useCallback(async (id) => {
    dispatch(markRead(id));
    await notificationService.markRead(id).catch(() => {});
  }, [dispatch]);

  const handleMarkAllRead = useCallback(async () => {
    dispatch(markAllRead());
    await notificationService.markAllRead().catch(() => {});
  }, [dispatch]);

  return { items, unreadCount, fetchNotifications, markRead: handleMarkRead, markAllRead: handleMarkAllRead };
};
