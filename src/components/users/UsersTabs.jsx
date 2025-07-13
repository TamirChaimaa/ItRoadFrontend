"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, User, Search, MoreVertical, Mail } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const users = [
  {
    id: 1,
    name: "Ahmed Bennani",
    email: "ahmed@itroad.ma",
    role: "Admin",
    status: "Active",
    avatar: "AB",
    lastLogin: "2024-01-15",
  },
  {
    id: 2,
    name: "Fatima Zahra",
    email: "fatima@itroad.ma",
    role: "User",
    status: "Active",
    avatar: "FZ",
    lastLogin: "2024-01-14",
  },
  {
    id: 3,
    name: "Mohamed Alami",
    email: "mohamed@itroad.ma",
    role: "User",
    status: "Inactive",
    avatar: "MA",
    lastLogin: "2024-01-10",
  },
  {
    id: 4,
    name: "Aicha Khadija",
    email: "aicha@itroad.ma",
    role: "Editor",
    status: "Active",
    avatar: "AK",
    lastLogin: "2024-01-15",
  },
]

const UsersTabs = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRole === "all" || user.role === selectedRole) &&
      (selectedStatus === "all" || user.status === selectedStatus),
  )

  const getRoleColor = (role) => {
    const colors = {
      Admin: "bg-purple-100 text-purple-700 border-purple-200",
      Editor: "bg-blue-100 text-blue-700 border-blue-200",
      User: "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[role] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateY: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.7,
      },
    },
    exit: {
      opacity: 0,
      y: -60,
      scale: 0.8,
      rotateY: 20,
      transition: {
        duration: 0.4,
      },
    },
  }

  const UserCard = ({ user }) => (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{
        scale: 1.03,
        rotateX: 5,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.97 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 group transform-gpu"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center"
              whileHover={{ 
                scale: 1.2,
                rotate: [0, -10, 10, 0],
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
              }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-white font-semibold">{user.avatar}</span>
            </motion.div>
            <div>
              <motion.h3 
                className="font-semibold text-gray-900"
                whileHover={{ color: "#06b6d4" }}
                transition={{ duration: 0.2 }}
              >
                {user.name}
              </motion.h3>
              <p className="text-sm text-gray-500 flex items-center space-x-1">
                <motion.div
                  whileHover={{ scale: 1.3, color: "#06b6d4" }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="w-3 h-3" />
                </motion.div>
                <span>{user.email}</span>
              </p>
            </div>
          </div>
          <motion.div 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileTap={{ scale: 0.8 }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </motion.button>
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <motion.span 
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}
              whileHover={{ 
                scale: 1.1,
                y: -2,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {user.role}
            </motion.span>
            <motion.span 
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}
              whileHover={{ 
                scale: 1.1,
                y: -2,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {user.status}
            </motion.span>
          </div>

          <motion.div 
            className="text-xs text-gray-500"
            whileHover={{ color: "#374151" }}
            transition={{ duration: 0.2 }}
          >
            Last login: {user.lastLogin}
          </motion.div>

          <div className="flex space-x-2 pt-2">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#0891b2",
                color: "#ffffff",
              }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.2 }}
              >
                <Edit className="w-4 h-4" />
              </motion.div>
              <span>Edit</span>
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.1,
                backgroundColor: "#dc2626",
                color: "#ffffff",
                rotate: [0, -5, 5, 0],
              }}
              whileTap={{ scale: 0.9 }}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              transition={{ duration: 0.2 }}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Users
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Manage accounts and permissions
            </motion.p>
          </div>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(6, 182, 212, 0.4)",
              y: -2,
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-2xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg shadow-cyan-500/25 flex items-center space-x-2"
          >
            <motion.div
              whileHover={{ rotate: 180, scale: 1.2 }}
              transition={{ duration: 0.4 }}
            >
              <Plus className="w-5 h-5" />
            </motion.div>
            <span>New User</span>
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <motion.input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                whileFocus={{ scale: 1.02, y: -2 }}
              />
            </div>
            <motion.select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
              whileFocus={{ scale: 1.02, y: -2 }}
            >
              <option value="all">All roles</option>
              <option value="Admin">Administrator</option>
              <option value="Editor">Editor</option>
              <option value="User">User</option>
            </motion.select>
        
          </div>
        </motion.div>

        {/* Users Grid */}
        <motion.div 
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No results */}
        <AnimatePresence>
          {filteredUsers.length === 0 && (
            <motion.div
              key="no-users"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
              className="text-center py-12"
            >
              <motion.div 
                className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <User className="w-12 h-12 text-gray-400" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try changing your search criteria</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default UsersTabs
