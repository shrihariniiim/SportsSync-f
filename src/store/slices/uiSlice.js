import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { globalLoading: false, sidebarOpen: false },
  reducers: {
    setGlobalLoading: (state, { payload }) => { state.globalLoading = payload; },
    toggleSidebar:    (state)              => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen:   (state, { payload }) => { state.sidebarOpen = payload; },
  },
});

export const { setGlobalLoading, toggleSidebar, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
