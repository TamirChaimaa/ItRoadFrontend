import React, { useState } from "react";
import axios from "axios";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Info,
  Phone,
  XCircle, // For alert close icon
  CheckCircle, // For success alert icon
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

// Custom AlertDialog component
const AlertDialog = ({ isOpen, title, message, onClose, type = "info" }) => {
  if (!isOpen) return null;

  let iconComponent;
  let borderColor;
  let textColor;

  switch (type) {
    case "success":
      iconComponent = <CheckCircle className="h-8 w-8 text-green-500" />;
      borderColor = "border-green-400";
      textColor = "text-green-700";
      break;
    case "error":
      iconComponent = <XCircle className="h-8 w-8 text-red-500" />;
      borderColor = "border-red-400";
      textColor = "text-red-700";
      break;
    default:
      iconComponent = <Info className="h-8 w-8 text-blue-500" />;
      borderColor = "border-blue-400";
      textColor = "text-blue-700";
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100 ${borderColor} border-t-4`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            {iconComponent}
            <h3 className={`text-xl font-bold ${textColor}`}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close alert"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
              type === "success"
                ? "bg-green-500 hover:bg-green-600"
                : type === "error"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const SignupForm = () => {
  // Hook for navigation
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    address: "",
    bio: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // State for custom alert dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info"); // 'success', 'error', 'info'

  // Function to show the custom alert
  const showAlert = (title, message, type = "info") => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertOpen(true);
  };

  // Function to close the custom alert
  const closeAlert = () => {
    setIsAlertOpen(false);
    setAlertTitle("");
    setAlertMessage("");
    setAlertType("info");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showAlert("Validation Error", "Please correct the errors in the form.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("https://itroadsignupservice-production.up.railway.app/api/auth/register", {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        bio: formData.bio,
        phoneNumber: formData.phoneNumber,
      });

      showAlert("Success", "Signup successful!", "success");
      // console.log("Backend response:", response.data); // Keep console.log for development/debugging

      // Clear the form after successful submission
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        email: "",
        address: "",
        bio: "",
        phoneNumber: "",
      });
      setErrors({}); // Clear any previous errors

      // Navigate to the sign-in page after successful registration
      navigate("/signin");

    } catch (error) {
      console.error("Signup error:", error); // Keep console.error for debugging

      if (error.response) {
        const errorData = error.response.data;
        // Example: { message: "Email already exists" } or { username: "Username taken" }
        if (typeof errorData === "object") {
          // If the backend returns specific field errors, set them
          setErrors((prevErrors) => ({
            ...prevErrors,
            ...errorData,
          }));

          if (errorData.message) {
            // If there's a general message, show it in the alert
            showAlert("Registration Failed", errorData.message, "error");
          } else {
            // Otherwise, indicate validation errors
            showAlert("Registration Failed", "Registration failed due to validation errors.", "error");
          }
        } else {
          // Fallback for non-object error responses
          showAlert("Registration Failed", "Registration failed. Please try again.", "error");
        }
      } else {
        // Network or other unexpected errors
        showAlert("Network Error", "Network error. Please check your connection.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSigninClick = () => {
    // Navigate to the sign-in page
    navigate("/signin");
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl transform transition-all hover:scale-[1.02] duration-300">
        <ITRoadLogo />

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Join the ITRoad community
        </p>

        <div className="space-y-6">
          {/* Row 1: Username & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-lg ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-2">{errors.username}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Row 2: Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-lg ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Name & Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-lg ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2">{errors.name}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-lg ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Address alone */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-lg ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-2">{errors.address}</p>
            )}
          </div>

          {/* Row 5: Bio textarea alone */}
          <div className="relative">
            <div className="absolute top-0 left-0 pl-4 flex items-start pointer-events-none pt-4">
              <Info className="h-6 w-6 text-gray-400" />
            </div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
              rows={4}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none text-lg ${
                errors.bio ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-2">{errors.bio}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg transition-all transform hover:scale-105 duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Sign Up...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg">
            Already have an account?{" "}
            <button
              onClick={handleSigninClick}
              className="text-cyan-400 hover:text-cyan-600 font-semibold hover:underline transition-colors duration-200"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      {/* Custom Alert Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        title={alertTitle}
        message={alertMessage}
        onClose={closeAlert}
        type={alertType}
      />
    </div>
  );
};

export default SignupForm;