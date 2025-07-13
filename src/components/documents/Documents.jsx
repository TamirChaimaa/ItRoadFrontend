"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Trash2,
  User,
  Calendar,
  Tag,
  FileIcon,
  FileSpreadsheet,
  Presentation,
  Image,
  Archive,
  File,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import {
  fetchUserDocuments,
  deleteDocument,
  searchDocumentsByUser,
  countDocumentsByUser,
  createDocument,
  clearDocumentError,
  clearCreateStatus,
} from "../../features/document/documentSlice";

const Documents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error, count, searchResults, createStatus } =
    useSelector((state) => state.documents);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [username, setUsername] = useState("");

  // Get username from cookies
  useEffect(() => {
    const usernameCookie = Cookies.get("username");
    if (usernameCookie) {
      setUsername(usernameCookie);
    }
  }, []);

  // Load documents on component mount
  useEffect(() => {
    dispatch(fetchUserDocuments());
    dispatch(countDocumentsByUser());
  }, [dispatch]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim()) {
      dispatch(searchDocumentsByUser(searchTerm));
    }
  }, [searchTerm, dispatch]);

  // Use search results or full list
  const documentsToDisplay = searchTerm.trim() ? searchResults : list;

  // Filter by category
  const filteredDocuments = documentsToDisplay.filter((doc) => {
    const docCategory = doc.category || "Other";
    return selectedCategory === "all" || docCategory === selectedCategory;
  });

  // Extract unique categories from documents for select options
  const availableCategories = [
    ...new Set(list.map((doc) => doc.category || "Other")),
  ];

  const handleDeleteDocument = (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      dispatch(deleteDocument(documentId));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      formData.append(
        "category",
        selectedCategory !== "all" ? selectedCategory : "Other"
      );

      dispatch(createDocument(formData));
      setUploadFile(null);
      setShowUploadModal(false);
    }
  };
   const handleAddDocument = () => {
    navigate("/dashboard/add-document");
  };

  // Function to extract file type from URL
  const getFileTypeFromUrl = (url) => {
    if (!url) return "FILE";

    // Extract filename from URL
    const urlParts = url.split("_");
    if (urlParts.length > 0) {
      const filename = urlParts[urlParts.length - 1]; // Last part after the last underscore
      const extension = filename.split(".").pop().toLowerCase();

      switch (extension) {
        case "pdf":
          return "PDF";
        case "doc":
        case "docx":
          return "DOC";
        case "xls":
        case "xlsx":
          return "XLS";
        case "ppt":
        case "pptx":
          return "PPT";
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
          return "IMG";
        case "txt":
          return "TXT";
        case "zip":
        case "rar":
          return "ZIP";
        default:
          return "FILE";
      }
    }
    return "FILE";
  };

  // Function to determine file type based on extension (fallback)
  const getFileType = (filename) => {
    if (!filename) return "FILE";

    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "PDF";
      case "doc":
      case "docx":
        return "DOC";
      case "xls":
      case "xlsx":
        return "XLS";
      case "ppt":
      case "pptx":
        return "PPT";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "IMG";
      case "txt":
        return "TXT";
      case "zip":
      case "rar":
        return "ZIP";
      default:
        return "FILE";
    }
  };

  // Function to generate download URL
  const getDownloadUrl = (doc) => {
    return `https://itroaddocumentsservice-production.up.railway.app${doc.url}`;
  };

  // Function to open document in new tab
  const handleViewDocument = (doc) => {
    const downloadUrl = getDownloadUrl(doc);
    window.open(downloadUrl, "_blank");
  };

  // Function to download document
  const handleDownloadDocument = (doc) => {
    const downloadUrl = getDownloadUrl(doc);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = doc.name || `document_${doc.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeColor = (type) => {
    const colors = {
      PDF: "bg-red-500 text-white",
      PPT: "bg-orange-500 text-white",
      XLS: "bg-green-500 text-white",
      DOC: "bg-blue-500 text-white",
      IMG: "bg-purple-500 text-white",
      TXT: "bg-yellow-500 text-white",
      ZIP: "bg-indigo-500 text-white",
      FILE: "bg-gray-500 text-white",
    };
    return colors[type] || "bg-gray-500 text-white";
  };

  const getTypeIcon = (type) => {
    const icons = {
      PDF: FileText,
      PPT: Presentation,
      XLS: FileSpreadsheet,
      DOC: FileIcon,
      IMG: Image,
      TXT: FileText,
      ZIP: Archive,
      FILE: File,
    };
    return icons[type] || File;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

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
  };

  const DocumentCard = ({ doc, index }) => {
    const fileType = doc.url
      ? getFileTypeFromUrl(doc.url)
      : getFileType(doc.name);
    const IconComponent = getTypeIcon(fileType);

    return (
      <motion.div
        layout
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{
          scale: 1.03,
          y: -5,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-3xl shadow-lg border border-gray-100 group transform-gpu overflow-hidden"
      >
        {/* Header with type and actions */}
        <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <motion.div
              className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(
                fileType
              )} shadow-md flex items-center space-x-1`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <IconComponent className="w-3 h-3" />
              <span>{fileType}</span>
            </motion.div>

            {/* Compact actions */}
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                onClick={() => handleViewDocument(doc)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors shadow-md"
                title="View document"
              >
                <Eye className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => handleDownloadDocument(doc)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-md"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => handleDeleteDocument(doc.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {/* Icon and title */}
          <div className="flex items-start space-x-4 mb-4">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <FileText className="w-8 h-8 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-lg text-gray-900 truncate mb-1"
                title={doc.name}
              >
                {doc.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">Document file</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-5 h-5 bg-cyan-100 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-cyan-600" />
              </div>
              <span className="font-medium">Owner:</span>
              <span className="text-gray-800">{username || "User"}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                <Tag className="w-3 h-3 text-purple-600" />
              </div>
              <span className="font-medium">Category:</span>
              <span className="text-gray-800">
                {doc.category || "Uncategorized"}
              </span>
            </div>

            {doc.created_at && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-green-600" />
                </div>
                <span className="font-medium">Created:</span>
                <span className="text-gray-800">
                  {new Date(doc.created_at).toLocaleDateString("en-US")}
                </span>
              </div>
            )}
          </div>

          {/* Main actions */}
          <div className="flex space-x-3">
            <motion.button
              onClick={() => handleViewDocument(doc)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Open</span>
            </motion.button>

            <motion.button
              onClick={() => handleDownloadDocument(doc)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

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
              Documents ({count})
            </motion.h1>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Manage and organize all your files{" "}
              {username && `- Welcome ${username}`}
            </motion.p>
          </div>
          <motion.button
            onClick={handleAddDocument}
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

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          >
            {error}
            <button
              onClick={() => dispatch(clearDocumentError())}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Success Message */}
        {createStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4"
          >
            Document created successfully!
            <button
              onClick={() => dispatch(clearCreateStatus())}
              className="ml-2 text-green-500 hover:text-green-700"
            >
              ×
            </button>
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
              <option value="all">All categories ({list.length})</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category} (
                  {
                    list.filter((doc) => (doc.category || "Other") === category)
                      .length
                  }
                  )
                </option>
              ))}
            </motion.select>
          </div>
        </motion.div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full m-4"
            >
              <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
              <input
                type="file"
                onChange={handleFileUpload}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        )}

        {/* Documents Grid */}
        {!loading && (
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredDocuments.map((doc, index) => (
                <DocumentCard key={doc.id} doc={doc} index={index} />
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
                {searchTerm.trim()
                  ? `No documents found for "${searchTerm}"`
                  : selectedCategory !== "all"
                  ? `No documents in "${selectedCategory}" category`
                  : "No documents found"}
              </h3>
              <p className="text-gray-500">
                {searchTerm.trim() || selectedCategory !== "all"
                  ? "Try changing your search criteria or category filter"
                  : "Upload your first document to get started"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Documents;
