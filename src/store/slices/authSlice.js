import { createSlice } from '@reduxjs/toolkit';

const savedUser  = localStorage.getItem('ss_user');
const savedToken = localStorage.getItem('ss_token');

const initialState = {
  user:            savedUser  ? JSON.parse(savedUser) : null,
  accessToken:     savedToken || null,
  isAuthenticated: !!savedToken,
  loading:         false,
  error:           null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user            = payload.user;
      state.accessToken     = payload.accessToken;
      state.isAuthenticated = true;
      state.error           = null;
      localStorage.setItem('ss_user',  JSON.stringify(payload.user));
      localStorage.setItem('ss_token', payload.accessToken);
      if (payload.refreshToken) {
        localStorage.setItem('ss_refresh', payload.refreshToken);
      }
    },
    updateUser: (state, { payload }) => {
      state.user = { ...state.user, ...payload };
      localStorage.setItem('ss_user', JSON.stringify(state.user));
    },
    setAccessToken: (state, { payload }) => {
      state.accessToken = payload;
      localStorage.setItem('ss_token', payload);
    },
    logout: (state) => {
      state.user            = null;
      state.accessToken     = null;
      state.isAuthenticated = false;
      localStorage.removeItem('ss_user');
      localStorage.removeItem('ss_token');
      localStorage.removeItem('ss_refresh');
    },
    setLoading: (state, { payload }) => { state.loading = payload; },
    setError:   (state, { payload }) => { state.error   = payload; },
  },
});

export const { setCredentials, updateUser, setAccessToken, logout, setLoading, setError } = authSlice.actions;

// Selectors
export const selectAuth          = (s) => s.auth;
export const selectUser          = (s) => s.auth.user;
export const selectIsAuth        = (s) => s.auth.isAuthenticated;
export const selectAccessToken   = (s) => s.auth.accessToken;
export const selectUserRole      = (s) => s.auth.user?.role;

export default authSlice.reducer;
