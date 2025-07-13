import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  MoreVertical, 
  Trash2,
  Calendar,
  File,
  Image,
  FileSpreadsheet,
  Presentation,
  Archive
} from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { 
  fetchUserDocuments, 
  deleteDocument, 
  searchDocumentsByUser,
  clearDocumentError 
} from "./documentSlice"

const Documents = () => {
  const dispatch = useDispatch()
  const { list: documents, loading, error, searchResults } = useSelector(state => state.documents)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState(null)

  // Charger les documents au montage du composant
  useEffect(() => {
    dispatch(fetchUserDocuments())
  }, [dispatch])

  // Nettoyer les erreurs au montage
  useEffect(() => {
    dispatch(clearDocumentError())
  }, [dispatch])

  // Gérer la recherche
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true)
      dispatch(searchDocumentsByUser(searchTerm))
    } else {
      setIsSearching(false)
    }
  }, [searchTerm, dispatch])

  // Obtenir les documents à afficher (recherche ou liste complète)
  const getDisplayedDocuments = () => {
    const sourceDocuments = isSearching ? searchResults : documents
    
    return sourceDocuments.filter(doc => {
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
      const matchesType = selectedType === "all" || doc.type === selectedType
      return matchesCategory && matchesType
    })
  }

  // Obtenir les catégories uniques
  const getUniqueCategories = () => {
    const categories = [...new Set(documents.map(doc => doc.category))]
    return categories.filter(Boolean)
  }

  // Obtenir les types uniques
  const getUniqueTypes = () => {
    const types = [...new Set(documents.map(doc => doc.type))]
    return types.filter(Boolean)
  }

  // Gérer la suppression d'un document
  const handleDeleteDocument = (doc) => {
    setDocumentToDelete(doc)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (documentToDelete) {
      dispatch(deleteDocument(documentToDelete.id))
      setShowDeleteModal(false)
      setDocumentToDelete(null)
    }
  }

  // Obtenir l'icône selon le type de fichier
  const getFileIcon = (type) => {
    const iconClass = "w-6 h-6 text-white"
    switch (type?.toLowerCase()) {
      case 'pdf':
        return <FileText className={iconClass} />
      case 'doc':
      case 'docx':
        return <File className={iconClass} />
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className={iconClass} />
      case 'ppt':
      case 'pptx':
        return <Presentation className={iconClass} />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className={iconClass} />
      case 'zip':
      case 'rar':
        return <Archive className={iconClass} />
      default:
        return <FileText className={iconClass} />
    }
  }

  // Obtenir la couleur selon le type de fichier
  const getTypeColor = (type) => {
    const colors = {
      PDF: "bg-red-100 text-red-700 border-red-200",
      DOC: "bg-blue-100 text-blue-700 border-blue-200",
      DOCX: "bg-blue-100 text-blue-700 border-blue-200",
      XLS: "bg-green-100 text-green-700 border-green-200",
      XLSX: "bg-green-100 text-green-700 border-green-200",
      PPT: "bg-orange-100 text-orange-700 border-orange-200",
      PPTX: "bg-orange-100 text-orange-700 border-orange-200",
      JPG: "bg-purple-100 text-purple-700 border-purple-200",
      JPEG: "bg-purple-100 text-purple-700 border-purple-200",
      PNG: "bg-purple-100 text-purple-700 border-purple-200",
      GIF: "bg-purple-100 text-purple-700 border-purple-200",
      ZIP: "bg-gray-100 text-gray-700 border-gray-200",
      RAR: "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[type?.toUpperCase()] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  // Obtenir la couleur de fond de l'icône selon le type
  const getIconBackgroundColor = (type) => {
    const colors = {
      PDF: "from-red-400 to-red-600",
      DOC: "from-blue-400 to-blue-600",
      DOCX: "from-blue-400 to-blue-600",
      XLS: "from-green-400 to-green-600",
      XLSX: "from-green-400 to-green-600",
      PPT: "from-orange-400 to-orange-600",
      PPTX: "from-orange-400 to-orange-600",
      JPG: "from-purple-400 to-purple-600",
      JPEG: "from-purple-400 to-purple-600",
      PNG: "from-purple-400 to-purple-600",
      GIF: "from-purple-400 to-purple-600",
      ZIP: "from-gray-400 to-gray-600",
      RAR: "from-gray-400 to-gray-600",
    }
    return colors[type?.toUpperCase()] || "from-cyan-400 to-cyan-600"
  }

  // Animations
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

  const DocumentCard = ({ doc }) => (
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
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div 
              className={`w-12 h-12 bg-gradient-to-br ${getIconBackgroundColor(doc.type)} rounded-xl flex items-center justify-center`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {getFileIcon(doc.type)}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate" title={doc.name}>
                {doc.name}
              </h3>
              <p className="text-sm text-gray-500">
                {doc.type?.toUpperCase() || 'Unknown'}
              </p>
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
              {doc.type?.toUpperCase() || 'Unknown'}
            </motion.span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{doc.date}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              {doc.category}
            </span>
          </div>

          <div className="flex space-x-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#0891b2" }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
              onClick={() => window.open(doc.url, '_blank')}
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
              onClick={() => window.open(doc.url, '_blank')}
            >
              <Download className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              onClick={() => handleDeleteDocument(doc)}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const filteredDocuments = getDisplayedDocuments()

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
              Manage and organize all your files ({documents.length} documents)
            </motion.p>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

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
                placeholder="Search documents by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            
            <div className="flex gap-3">
              <motion.select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                whileFocus={{ scale: 1.02 }}
              >
                <option value="all">All categories</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </motion.select>

              <motion.select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                whileFocus={{ scale: 1.02 }}
              >
                <option value="all">All types</option>
                {getUniqueTypes().map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </motion.select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </motion.div>
        )}

        {/* Documents Grid */}
        {!loading && (
          <motion.div 
            layout
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No results */}
        <AnimatePresence>
          {!loading && filteredDocuments.length === 0 && (
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isSearching ? "No documents found" : "No documents yet"}
              </h3>
              <p className="text-gray-500">
                {isSearching ? "Try changing your search criteria" : "Upload your first document to get started"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Document</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{documentToDelete?.name}"? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Documents