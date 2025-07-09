// components/AuthGuard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { validateToken } from '../features/auth/authSlice';

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    // Vérifier le token au chargement
    if (!isInitialized) {
      dispatch(validateToken());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    // Rediriger vers login si non authentifié
    if (isInitialized && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, isInitialized, navigate]);

  // Afficher un loader pendant la vérification
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Afficher le contenu protégé si authentifié
  return isAuthenticated ? children : null;
};

export default AuthGuard;