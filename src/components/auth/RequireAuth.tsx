
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children?: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo" />
        <span className="ml-2 text-indigo">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to the login page, but save the current location
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RequireAuth;
