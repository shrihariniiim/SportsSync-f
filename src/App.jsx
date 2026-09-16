import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouter from './routes/AppRouter';
import { useSocket } from './hooks/useSocket';
import { authService } from './services/index';
import { logout, setAccessToken, setLoading, updateUser } from './store/slices/authSlice';

function SocketManager() {
  // Initialize socket connection when authenticated
  useSocket();
  return null;
}

export default function App() {
  const dispatch = useDispatch();
  const initializedRef = useRef(false);
  const { accessToken, isAuthenticated, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const refreshToken = localStorage.getItem('ss_refresh');
    if (accessToken && user) {
      dispatch(setLoading(false));
      return;
    }

    if (accessToken && !user) {
      const restoreProfile = async () => {
        try {
          const me = await authService.getMe();
          dispatch(updateUser(me.data.data.user));
        } catch {
          dispatch(logout());
        } finally {
          dispatch(setLoading(false));
        }
      };

      restoreProfile();
      return;
    }

    if (!refreshToken) {
      dispatch(setLoading(false));
      return;
    }

    const restoreSession = async () => {
      try {
        const { data } = await authService.refresh(refreshToken);
        const refreshed = data.data;
        dispatch(setAccessToken(refreshed.accessToken));
        if (refreshed.refreshToken) {
          localStorage.setItem('ss_refresh', refreshed.refreshToken);
        }

        const me = await authService.getMe();
        dispatch(updateUser(me.data.data.user));
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    restoreSession();
  }, [accessToken, dispatch, user]);

  return (
    <>
      {isAuthenticated && <SocketManager />}
      <AppRouter />
    </>
  );
}
