import api from './api';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  register:       (data)          => api.post('/auth/register', data),
  login:          (data)          => api.post('/auth/login', data),
  logout:         ()              => api.post('/auth/logout'),
  refresh:        (refreshToken)  => api.post('/auth/refresh', { refreshToken }),
  getMe:          ()              => api.get('/users/me'),
  updateMe:       (data)          => api.put('/users/me', data),
  updateAvatar:   (formData)      => api.put('/users/me/avatar', formData),
  updateLocation: (data)          => api.put('/users/me/location', data),
  updateAvailability: (data)      => api.put('/users/me/availability', data),
  getAvailablePlayers: (params)   => api.get('/users/available', { params }),
};

// ─── Venue ────────────────────────────────────────────────────────────────────
export const venueService = {
  getAll:        (params)  => api.get('/venues', { params }),
  getNearby:     (params)  => api.get('/venues/nearby', { params }),
  getById:       (id)      => api.get(`/venues/${id}`),
  getMyVenues:   ()        => api.get('/venues/owner/my'),
  create:        (data)    => api.post('/venues', data),
  update:        (id, data)=> api.put(`/venues/${id}`, data),
  updateAvailability: (id, data)=> api.put(`/venues/${id}/availability`, data),
  delete:        (id)      => api.delete(`/venues/${id}`),
  uploadImages:  (id, fd)  => api.post(`/venues/${id}/images`, fd),
  getSlots:      (id, params) => api.get(`/slots/venue/${id}`, { params }),
};

// ─── Slot ─────────────────────────────────────────────────────────────────────
export const slotService = {
  create:  (data)   => api.post('/slots', data),
  update:  (id, data) => api.put(`/slots/${id}`, data),
  delete:  (id)     => api.delete(`/slots/${id}`),
  reserve: (id)     => api.post(`/slots/${id}/reserve`),
};

// ─── Booking ──────────────────────────────────────────────────────────────────
export const bookingService = {
  create:         (data)       => api.post('/bookings', data),
  verifyPayment:  (data)       => api.post('/bookings/verify-payment', data),
  getMyBookings:  (params)     => api.get('/bookings/my', { params }),
  getById:        (id)         => api.get(`/bookings/${id}`),
  cancel:         (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
  getVenueBookings:(id, params) => api.get(`/bookings/venue/${id}`, { params }),
};

// ─── Game ─────────────────────────────────────────────────────────────────────
export const gameService = {
  getAll:    (params) => api.get('/games', { params }),
  getNearby: (params) => api.get('/games/nearby', { params }),
  getById:   (id)     => api.get(`/games/${id}`),
  create:    (data)   => api.post('/games', data),
  join:      (id)     => api.post(`/games/${id}/join`),
  leave:     (id)     => api.post(`/games/${id}/leave`),
  cancel:    (id, reason) => api.put(`/games/${id}/cancel`, { reason }),
};

// ─── Trainer ──────────────────────────────────────────────────────────────────
export const trainerService = {
  getAll:        (params) => api.get('/trainers', { params }),
  getNearby:     (params) => api.get('/trainers/nearby', { params }),
  getById:       (id)     => api.get(`/trainers/${id}`),
  createProfile: (data)   => api.post('/trainers/profile', data),
  updateProfile: (data)   => api.put('/trainers/profile', data),
  book:          (id, data) => api.post(`/trainers/${id}/book`, data),
};

// ─── Event ────────────────────────────────────────────────────────────────────
export const eventService = {
  getAll:    (params) => api.get('/events', { params }),
  getById:   (id)     => api.get(`/events/${id}`),
  create:    (data)   => api.post('/events', data),
  update:    (id, data) => api.put(`/events/${id}`, data),
  register:  (id)     => api.post(`/events/${id}/register`),
  getMyEvents: ()     => api.get('/events/organizer/my'),
};

// ─── Review ───────────────────────────────────────────────────────────────────
export const reviewService = {
  create:          (data) => api.post('/reviews', data),
  getVenueReviews: (id, params) => api.get(`/reviews/venue/${id}`, { params }),
  getTrainerReviews:(id)  => api.get(`/reviews/trainer/${id}`),
  reply:           (id, reply) => api.put(`/reviews/${id}/reply`, { reply }),
};

// ─── Notification ─────────────────────────────────────────────────────────────
export const notificationService = {
  getAll:      (params) => api.get('/notifications', { params }),
  markRead:    (id)     => api.put(`/notifications/${id}/read`),
  markAllRead: ()       => api.put('/notifications/read-all'),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminService = {
  getStats:         ()       => api.get('/admin/stats'),
  getUsers:         (params) => api.get('/admin/users', { params }),
  toggleBlock:      (id)     => api.put(`/admin/users/${id}/block`),
  getVenues:        (params) => api.get('/admin/venues', { params }),
  verifyVenue:      (id)     => api.put(`/admin/venues/${id}/verify`),
  getBookings:      (params) => api.get('/admin/bookings', { params }),
  getRevenue:       (params) => api.get('/admin/revenue', { params }),
  getCommission:    ()       => api.get('/admin/commission'),
  updateCommission: (rate)   => api.put('/admin/commission', { rate }),
};
