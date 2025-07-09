"use client"

import { useState } from "react"
import { User, Camera, Mail, Phone, MapPin, Shield, Edit3, Save, X, FileText } from "lucide-react"

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "Ahmed Bennani",
    email: "ahmed@itroad.ma",
    role: "Administrateur",
    phone: "+212 6 12 34 56 78",
    address: "Casablanca, Morocco",
    bio: "Administrateur système passionné par les nouvelles technologies et l'innovation.",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [tempData, setTempData] = useState(profileData)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTempData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setProfileData(tempData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempData(profileData)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </div>

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
                <h2 className="text-2xl font-bold text-white mb-1">{profileData.name}</h2>
                <p className="text-cyan-100 mb-2">{profileData.role}</p>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-cyan-100">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Compte vérifié</span>
                </div>
              </div>
              <div className="md:ml-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-200 font-semibold flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-white text-cyan-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center space-x-1"
                    >
                      <Save className="w-4 h-4" />
                      <span>Sauver</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors font-semibold flex items-center space-x-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Annuler</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Nom complet</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={tempData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{profileData.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={tempData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{profileData.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Téléphone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={tempData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{profileData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Rôle</label>
                      <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-2xl">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500">{profileData.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Adresse</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={tempData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{profileData.address}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={tempData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200 resize-none"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-gray-900">{profileData.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 rounded-2xl border border-cyan-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-cyan-600 font-medium">Documents</p>
                          <p className="text-2xl font-bold text-cyan-700">24</p>
                        </div>
                        <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Connexions</p>
                          <p className="text-2xl font-bold text-green-700">156</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
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
