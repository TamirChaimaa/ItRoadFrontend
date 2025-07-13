// Import React hooks, Redux, icons, animations
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
  FileText, Search, Download, Eye, MoreVertical, Trash2,
  Calendar, File, Image, FileSpreadsheet, Presentation, Archive
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

  // Access Redux state
  const { list: documents, loading, error, searchResults } = useSelector(state => state.documents)

  // State for search, filters, modals
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState(null)

  // Fetch documents on mount
  useEffect(() => {
    dispatch(fetchUserDocuments())
  }, [dispatch])

  // Clear any existing errors
  useEffect(() => {
    dispatch(clearDocumentError())
  }, [dispatch])

  // Trigger search when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true)
      dispatch(searchDocumentsByUser(searchTerm))
    } else {
      setIsSearching(false)
    }
  }, [searchTerm, dispatch])

  // Filter documents based on selected category and type
  const getDisplayedDocuments = () => {
    const sourceDocuments = isSearching ? searchResults : documents
    return sourceDocuments.filter(doc => {
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
      const matchesType = selectedType === "all" || doc.type === selectedType
      return matchesCategory && matchesType
    })
  }

  // Get unique document categories
  const getUniqueCategories = () => {
    const categories = [...new Set(documents.map(doc => doc.category))]
    return categories.filter(Boolean)
  }

  // Get unique document types
  const getUniqueTypes = () => {
    const types = [...new Set(documents.map(doc => doc.type))]
    return types.filter(Boolean)
  }

  // Open delete modal
  const handleDeleteDocument = (doc) => {
    setDocumentToDelete(doc)
    setShowDeleteModal(true)
  }

  // Confirm deletion
  const confirmDelete = () => {
    if (documentToDelete) {
      dispatch(deleteDocument(documentToDelete.id))
      setShowDeleteModal(false)
      setDocumentToDelete(null)
    }
  }

  // Return correct file icon based on file type
  const getFileIcon = (type) => {
    const iconClass = "w-6 h-6 text-white"
    switch (type?.toLowerCase()) {
      case 'pdf': return <FileText className={iconClass} />
      case 'doc':
      case 'docx': return <File className={iconClass} />
      case 'xls':
      case 'xlsx': return <FileSpreadsheet className={iconClass} />
      case 'ppt':
      case 'pptx': return <Presentation className={iconClass} />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <Image className={iconClass} />
      case 'zip':
      case 'rar': return <Archive className={iconClass} />
      default: return <FileText className={iconClass} />
    }
  }

  // Return badge color based on file type
  const getTypeColor = (type) => {
    const colors = {
      PDF: "bg-red-100 text-red-700 border-red-200",
      DOC: "bg-blue-100 text-blue-700 border-blue-200",
      XLS: "bg-green-100 text-green-700 border-green-200",
      PPT: "bg-orange-100 text-orange-700 border-orange-200",
      JPG: "bg-purple-100 text-purple-700 border-purple-200",
      ZIP: "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[type?.toUpperCase()] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  // Return gradient background color for file icon
  const getIconBackgroundColor = (type) => {
    const colors = {
      PDF: "from-red-400 to-red-600",
      DOC: "from-blue-400 to-blue-600",
      XLS: "from-green-400 to-green-600",
      PPT: "from-orange-400 to-orange-600",
      JPG: "from-purple-400 to-purple-600",
      ZIP: "from-gray-400 to-gray-600",
    }
    return colors[type?.toUpperCase()] || "from-cyan-400 to-cyan-600"
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: -15 },
    visible: {
      opacity: 1, y: 0, scale: 1, rotateX: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    exit: { opacity: 0, y: -50, scale: 0.9, rotateX: 15 }
  }

  // Document card UI
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
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 group"
    >
      <div className="p-6">
        {/* Header with icon and name */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div 
              className={`w-12 h-12 bg-gradient-to-br ${getIconBackgroundColor(doc.type)} rounded-xl flex items-center justify-center`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {getFileIcon(doc.type)}
            </motion.div>
            <div>
              <h3 className="font-semibold text-gray-900 truncate" title={doc.name}>{doc.name}</h3>
              <p className="text-sm text-gray-500">{doc.type?.toUpperCase() || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Info and actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <motion.span 
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(doc.type)}`}
              whileHover={{ scale: 1.1 }}
            >
              {doc.type?.toUpperCase() || 'Unknown'}
            </motion.span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{doc.date}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">{doc.category}</span>
          </div>

          <div className="flex space-x-2 pt-2">
            {/* View document */}
            <motion.button
              onClick={() => window.open(doc.url, '_blank')}
              className="flex-1 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100"
            >
              <Eye className="w-4 h-4" /> <span>View</span>
            </motion.button>

            {/* Download document */}
            <motion.button
              onClick={() => window.open(doc.url, '_blank')}
              className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Download className="w-4 h-4" />
            </motion.button>

            {/* Delete document */}
            <motion.button
              onClick={() => handleDeleteDocument(doc)}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
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
        <motion.div className="flex flex-col lg:flex-row justify-between mb-8">
          <div>
            <motion.h1 className="text-4xl font-bold text-gray-900 mb-2">Documents</motion.h1>
            <motion.p className="text-gray-600">Manage all your documents ({documents.length} total)</motion.p>
          </div>
        </motion.div>

        {/* Display error message if any */}
        {error && (
          <motion.div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </motion.div>
        )}

        {/* Filters: Search and Dropdowns */}
        <motion.div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <motion.input
                type="text"
                placeholder="Search documents by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl"
              />
            </div>
            <div className="flex gap-3">
              <motion.select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gray-50 border rounded-xl"
              >
                <option value="all">All categories</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </motion.select>
              <motion.select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-gray-50 border rounded-xl"
              >
                <option value="all">All types</option>
                {getUniqueTypes().map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </motion.select>
            </div>
          </div>
        </motion.div>

        {/* Loading Spinner */}
        {loading && (
          <motion.div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </motion.div>
        )}

        {/* Grid of documents */}
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

        {/* Empty state if no documents */}
        <AnimatePresence>
          {!loading && filteredDocuments.length === 0 && (
            <motion.div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isSearching ? "No documents found" : "No documents yet"}
              </h3>
              <p className="text-gray-500">
                {isSearching ? "Try changing your search criteria" : "Upload your first document to get started"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete confirmation modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div className="bg-white rounded-2xl p-6 max-w-md w-full">
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
                  <motion.button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</motion.button>
                  <motion.button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg">Delete</motion.button>
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
