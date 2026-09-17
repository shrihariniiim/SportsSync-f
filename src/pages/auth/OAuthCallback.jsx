import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAccessToken, setCredentials } from '../../store/slices/authSlice';
import { authService } from '../../services/index';
import { LoadingSpinner } from '../../components/common/index.jsx';
import { redirectByRole } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function OAuthCallback() {
  const [params]   = useSearchParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  useEffect(() => {
    const accessToken  = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken) {
      toast.error('OAuth login failed');
      navigate('/login');
      return;
    }

    // 1. Store tokens in localStorage
    localStorage.setItem('ss_token',   accessToken);
    if (refreshToken) {
      localStorage.setItem('ss_refresh', refreshToken);
    }

    // 2. Dispatch token to Redux immediately so api.js request interceptor has it
    dispatch(setAccessToken(accessToken));

    // 3. Now fetch profile with authenticated request
    authService.getMe()
      .then(({ data }) => {
        dispatch(setCredentials({ user: data.data.user, accessToken, refreshToken }));
        toast.success(`Welcome, ${data.data.user.name}!`);
        redirectByRole(data.data.user.role, navigate);
      })
      .catch((err) => {
        console.error('OAuth profile fetch error:', err);
        toast.error('Failed to load profile');
        navigate('/login');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest to-primary-700 flex items-center justify-center">
      <div className="text-center text-white space-y-4">
        <LoadingSpinner size="lg" className="mx-auto border-white/30 border-t-white" />
        <p className="text-lg font-medium">Signing you in...</p>
      </div>
    </div>
  );
}
