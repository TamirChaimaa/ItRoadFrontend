"use client"

import { useState } from "react"
import { FileText, Edit, Plus, Search, Download, Eye, MoreVertical } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const documents = [
  {
    id: 1,
    name: "Monthly Report.pdf",
    size: "2.5 MB",
    type: "PDF",
    date: "2024-01-15",
    user: "Ahmed Bennani",
    category: "Report",
  },
  {
    id: 2,
    name: "Client Presentation.pptx",
    size: "8.2 MB",
    type: "PPT",
    date: "2024-01-14",
    user: "Fatima Zahra",
    category: "Presentation",
  },
  {
    id: 3,
    name: "Database.xlsx",
    size: "1.8 MB",
    type: "XLS",
    date: "2024-01-13",
    user: "Mohamed Alami",
    category: "Data",
  },
  {
    id: 4,
    name: "Service Contract.docx",
    size: "456 KB",
    type: "DOC",
    date: "2024-01-12",
    user: "Aicha Khadija",
    category: "Contract",
  },
]

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || doc.category === selectedCategory),
  )

  const getTypeColor = (type) => {
    const colors = {
      PDF: "bg-red-100 text-red-700 border-red-200",
      PPT: "bg-orange-100 text-orange-700 border-orange-200",
      XLS: "bg-green-100 text-green-700 border-green-200",
      DOC: "bg-blue-100 text-blue-700 border-blue-200",
    }
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.9,
      rotateX: 15,
      transition: {
        duration: 0.3,
      },
    },
  }

  const DocumentCard = ({ doc, index }) => (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 group transform-gpu perspective-1000"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <FileText className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
              <p className="text-sm text-gray-500">{doc.size}</p>
            </div>
          </div>
          <motion.div 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </motion.button>
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <motion.span 
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(doc.type)}`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {doc.type}
            </motion.span>
            <span className="text-xs text-gray-500">{doc.date}</span>
          </div>

          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.2, backgroundColor: "#06b6d4" }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs font-medium text-gray-600">
                {doc.user.split(" ").map((n) => n[0]).join("")}
              </span>
            </motion.div>
            <span className="text-sm text-gray-600">{doc.user}</span>
          </div>

          <div className="flex space-x-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#0891b2" }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Eye className="w-4 h-4" />
              </motion.div>
              <span>View</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Download className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Documents
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Manage and organize all your files
            </motion.p>
          </div>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(6, 182, 212, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-2xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg shadow-cyan-500/25 flex items-center space-x-2"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Plus className="w-5 h-5" />
            </motion.div>
            <span>New Document</span>
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <motion.input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <motion.select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
              whileFocus={{ scale: 1.02 }}
            >
              <option value="all">All categories</option>
              <option value="Report">Report</option>
              <option value="Presentation">Presentation</option>
              <option value="Contract">Contract</option>
              <option value="Data">Data</option>
              <option value="Invoice">Other</option>
            </motion.select>
          </div>
        </motion.div>

        {/* Documents Grid */}
        <motion.div 
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredDocuments.map((doc, index) => (
              <DocumentCard key={doc.id} doc={doc} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No results */}
        <AnimatePresence>
          {filteredDocuments.length === 0 && (
            <motion.div
              key="no-documents"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="text-center py-12"
            >
              <motion.div 
                className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FileText className="w-12 h-12 text-gray-400" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500">Try changing your search criteria</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Documents
