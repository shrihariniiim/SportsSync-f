import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, logout as logoutAction } from '../store/slices/authSlice';
import { authService } from '../services/index';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const auth       = useSelector((s) => s.auth);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    dispatch(setCredentials(data.data));
    toast.success(`Welcome back, ${data.data.user.name}!`);
    redirectByRole(data.data.user.role, navigate);
    return data.data;
  };

  const register = async (formData) => {
    const { data } = await authService.register(formData);
    dispatch(setCredentials(data.data));
    toast.success('Account created successfully!');
    redirectByRole(data.data.user.role, navigate);
    return data.data;
  };

  const logout = async () => {
    try { await authService.logout(); } catch {}
    dispatch(logoutAction());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return {
    user:            auth.user,
    accessToken:     auth.accessToken,
    isAuthenticated: auth.isAuthenticated,
    isLoading:       auth.loading,
    role:            auth.user?.role,
    isPlayer:        auth.user?.role === 'player',
    isTurfOwner:     auth.user?.role === 'turf_owner',
    isTrainer:       auth.user?.role === 'trainer',
    isOrganizer:     auth.user?.role === 'organizer',
    isAdmin:         auth.user?.role === 'admin',
    login,
    register,
    logout,
  };
};

export const redirectByRole = (role, navigate) => {
  const routes = {
    player:     '/home',
    turf_owner: '/owner/dashboard',
    trainer:    '/trainer/dashboard',
    organizer:  '/organizer/dashboard',
    admin:      '/admin/dashboard',
  };
  navigate(routes[role] || '/home');
};

export default useAuth;
