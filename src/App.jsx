import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRouter from './routes/AppRouter';
import { useSocket } from './hooks/useSocket';

function SocketManager() {
  // Initialize socket connection when authenticated
  useSocket();
  return null;
}

export default function App() {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  return (
    <>
      {isAuthenticated && <SocketManager />}
      <AppRouter />
    </>
  );
}
