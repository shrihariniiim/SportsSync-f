import { createSlice } from '@reduxjs/toolkit';

// ─── Location Slice ───────────────────────────────────────────────────────────
const locationSlice = createSlice({
  name: 'location',
  initialState: {
    coordinates: null, // { lat, lng }
    address: null,
    radius: 10,
    loading: false,
    error: null,
  },
  reducers: {
    setLocation: (state, { payload }) => {
      state.coordinates = payload;
      state.loading     = false;
      state.error       = null;
    },
    setAddress:       (state, { payload }) => { state.address = payload; },
    setRadius:        (state, { payload }) => { state.radius  = payload; },
    setLocationLoading:(state, { payload }) => { state.loading = payload; },
    setLocationError: (state, { payload }) => { state.error   = payload; state.loading = false; },
    clearLocation:    (state)             => { state.coordinates = null; state.address = null; },
  },
});

export const { setLocation, setAddress, setRadius, setLocationLoading, setLocationError, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
