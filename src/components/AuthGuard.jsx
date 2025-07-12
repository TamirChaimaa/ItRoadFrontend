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
    //Verify token on initial load
    // This will check if the user is authenticated when the component mounts
    if (!isInitialized) {
      dispatch(validateToken());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (isInitialized && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, isInitialized, navigate]);

  // Show a loading spinner while checking authentication status
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

  // If authenticated, render the children components
  // Otherwise, return null (or you could redirect to a different route)
  return isAuthenticated ? children : null;
};

export default AuthGuard;