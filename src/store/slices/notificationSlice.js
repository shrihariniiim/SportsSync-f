import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unreadCount: 0 },
  reducers: {
    setNotifications: (state, { payload }) => {
      state.items       = payload.notifications ?? payload;
      state.unreadCount = payload.unreadCount ?? 0;
    },
    addNotification: (state, { payload }) => {
      state.items.unshift(payload);
      state.unreadCount += 1;
    },
    markRead: (state, { payload }) => {
      const n = state.items.find((i) => i._id === payload);
      if (n && !n.isRead) { n.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
    },
    markAllRead: (state) => {
      state.items.forEach((i) => { i.isRead = true; });
      state.unreadCount = 0;
    },
  },
});

export const { setNotifications, addNotification, markRead, markAllRead } = notificationSlice.actions;
export default notificationSlice.reducer;
