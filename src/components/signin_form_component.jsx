import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../features/auth/authSlice";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // États Redux
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Nettoyer les erreurs Redux quand le composant se démonte
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear Redux error
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(
        loginUser({
          username: formData.username,
          password: formData.password,
          // plus besoin de rememberMe ici
        })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        console.log("Login successful");
        // redirection se fait via useEffect
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const ITRoadLogo = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        <div className="text-4xl font-bold text-gray-800">
          <span className="text-cyan-400">IT</span>
          <span className="text-gray-800">ROAD</span>
        </div>
        <div className="text-sm text-gray-600 text-center mt-1">GROUP</div>
        <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-cyan-400 rounded-full opacity-30"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all hover:scale-105">
        <div className="flex justify-center ">
          <img
            className="mb-6 h-30 w-auto object-contain"
            src="data:image/png;base64,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"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign in to your ITRoad account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Afficher les erreurs Redux */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Username Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-gray-300 rounded"
                disabled={loading}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-cyan-500 hover:text-cyan-600 hover:underline transition-colors"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleSignupClick}
              className="text-cyan-500 hover:text-cyan-600 font-semibold hover:underline transition-colors"
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
