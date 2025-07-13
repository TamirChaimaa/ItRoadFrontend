import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RedirectRoot = () => {
  const { isAuthenticated, isInitialized, loading } = useSelector((state) => state.auth);

  // Tant qu'on vérifie le token
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking session...</p>
        </div>
      </div>
    );
  }

  // Si connecté => va vers /dashboard, sinon => /signin
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />;
};

export default RedirectRoot;