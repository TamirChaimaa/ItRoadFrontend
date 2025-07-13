"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { User, Camera, Mail, Phone, MapPin, Shield, Edit3, Save, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { 
  fetchCurrentUserProfile, 
  updateUserProfile, 
  clearUpdateSuccess, 
  clearError 
} from '../../features/user/userSlice'


const Profile = () => {
  const dispatch = useDispatch()
  
  // Get user data and states from Redux store
  const { 
    currentUser, 
    fetchLoading, 
    updateLoading, 
    fetchError, 
    updateError, 
    updateSuccess 
  } = useSelector((state) => state.user)

  // Local state for form handling
  const [isEditing, setIsEditing] = useState(false)
  const [tempData, setTempData] = useState({
    name: '',
    email: '',
    address: '',
    bio: '',
    phoneNumber: '',
  })

  // Fetch user profile data on component mount
  useEffect(() => {
    dispatch(fetchCurrentUserProfile())
  }, [dispatch])

  // Update tempData when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setTempData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        bio: currentUser.bio || '',
        phoneNumber: currentUser.phoneNumber || '',
      })
    }
  }, [currentUser])

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false)
      // Clear success state after 3 seconds
      setTimeout(() => {
        dispatch(clearUpdateSuccess())
      }, 3000)
    }
  }, [updateSuccess, dispatch])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTempData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSave = async () => {
    if (!currentUser?.id) return

    try {
      await dispatch(updateUserProfile({
        userId: currentUser.id,
        userData: tempData
      })).unwrap()
    } catch (error) {
      // Error is handled by Redux
      console.error('Update failed:', error)
    }
  }

  // Handle cancel editing
  const handleCancel = () => {
    if (currentUser) {
      setTempData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        bio: currentUser.bio || '',
        phoneNumber: currentUser.phoneNumber || '',
      })
    }
    setIsEditing(false)
    dispatch(clearError('updateError'))
  }

  // Loading state
  if (fetchLoading && !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (fetchError && !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Error Loading Profile</h2>
          </div>
          <p className="text-gray-600 mb-6">{fetchError}</p>
          <button
            onClick={() => dispatch(fetchCurrentUserProfile())}
            className="w-full bg-cyan-600 text-white py-3 rounded-xl hover:bg-cyan-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Profile updated successfully!</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {updateError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error updating profile: {updateError}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-cyan-500 to-cyan-600 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {currentUser?.name || 'No Name'}
                </h2>
                <p className="text-cyan-100 mb-2">{currentUser?.role || 'User'}</p>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-cyan-100">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">
                    {currentUser?.status === 'Active' ? 'Verified Account' : currentUser?.status || 'Pending'}
                  </span>
                </div>
              </div>
              <div className="md:ml-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-200 font-semibold flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={updateLoading}
                      className="bg-white text-cyan-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center space-x-1 disabled:opacity-50"
                    >
                      {updateLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{updateLoading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={updateLoading}
                      className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors font-semibold flex items-center space-x-1 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 md:p-12">
            <div className="w-full space-y-8">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={tempData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{currentUser?.name || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={tempData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{currentUser?.email || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={tempData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{currentUser?.phoneNumber || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Username (Read-only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Username</label>
                    <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-2xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500">{currentUser?.username || 'Not provided'}</span>
                    </div>
                  </div>

                  {/* Role (Read-only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Role</label>
                    <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-2xl">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500">{currentUser?.role || 'Not provided'}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={tempData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{currentUser?.address || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={tempData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-gray-900">{currentUser?.bio || 'No bio provided'}</p>
                  </div>
                )}
              </div>

              {/* Account Information */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Status</label>
                    <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-2xl">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className={`font-semibold ${
                        currentUser?.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {currentUser?.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Last Login</label>
                    <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-2xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500">
                        {currentUser?.lastLogin ? new Date(currentUser.lastLogin).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile