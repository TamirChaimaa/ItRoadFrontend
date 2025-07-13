"use client"

import { useState } from "react"
import { Upload, X, FileText, ImageIcon, Video, Archive, Plus, Info, XCircle } from "lucide-react"
import { createDocument } from "../../features/document/documentSlice"
import { useDispatch } from "react-redux"

const AddDocument = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    file: null,
  })

  const dispatch = useDispatch()
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    type: "info", // "info", "error", "success"
  })

  const showAlert = (title, message, type = "info") => {
    setAlertConfig({ open: true, title, message, type })
  }

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, open: false }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, file }))
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.dataTransfer.files[0] }))
    }
  }

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }))
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase()
    switch (extension) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="w-5 h-5 text-green-500" />
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="w-5 h-5 text-purple-500" />
      case "zip":
      case "rar":
        return <Archive className="w-5 h-5 text-yellow-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const buildFormData = (data) => {
    const form = new FormData()
    form.append("title", data.title)
    form.append("description", data.description)
    form.append("category", data.category)
    if (data.file) form.append("file", data.file)
    return form
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.file) {
      showAlert("Missing File", "Please select a file before submitting.", "error")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const payload = buildFormData(formData)
      const result = await dispatch(createDocument(payload))
      if (createDocument.fulfilled.match(result)) {
        const uploadedDoc = result.payload
        showAlert("Success", `Document "${uploadedDoc.name || "N/A"}" uploaded successfully.`, "success")
        handleCancel()
      } else {
        showAlert("Failed", "Document upload failed.", "error")
      }
    } catch (error) {
      showAlert("Error", error.message, "error")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCancel = () => {
    setFormData({ title: "", description: "", category: "", file: null })
    setUploadProgress(0)
    setIsUploading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Add a Document</h1>
          <p className="text-gray-600">Upload and organize your files easily</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Fields - Full Width Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Document Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                    placeholder="Enter the title..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="report">Report</option>
                    <option value="presentation">Presentation</option>
                    <option value="contract">Contract</option>
                    <option value="invoice">Invoice</option>
                    <option value="manual">Manual</option>
                    <option value="policy">Policy</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700">Priority</label>
                  <select
                    name="priority"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl resize-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                  placeholder="Describe your document..."
                />
              </div>

              {/* File Upload Section - Full Width */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">File Upload</label>
                <div
                  className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                    dragActive ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:border-cyan-400 hover:bg-gray-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-3xl flex items-center justify-center shadow-lg">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-700 mb-3">Drag your file here or click to select</p>
                      <p className="text-sm text-gray-500">Supported formats: PDF, DOC, PPT, Images (10MB max)</p>
                    </div>
                  </div>
                </div>

                {/* File Preview */}
                {formData.file && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 col-span-full">
                      <div className="flex items-center space-x-4">
                        {getFileIcon(formData.file.name)}
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-md">{formData.file.name}</p>
                          <p className="text-sm text-gray-500">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Uploading...</span>
                    <span className="text-cyan-600 font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons - Full Width */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !formData.file}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-2xl hover:from-cyan-600 hover:to-cyan-700 font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 transition-all duration-200"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add Document</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Alert Modal */}
      {alertConfig.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-t-4 rounded-xl shadow-xl p-6 max-w-md w-full border-blue-500">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                {alertConfig.type === "error" ? (
                  <XCircle className="w-7 h-7 text-red-500" />
                ) : alertConfig.type === "success" ? (
                  <Info className="w-7 h-7 text-green-500" />
                ) : (
                  <Info className="w-7 h-7 text-blue-500" />
                )}
                <h3
                  className={`text-lg font-bold ${
                    alertConfig.type === "error"
                      ? "text-red-600"
                      : alertConfig.type === "success"
                        ? "text-green-600"
                        : "text-blue-700"
                  }`}
                >
                  {alertConfig.title}
                </h3>
              </div>
              <button onClick={closeAlert}>
                <XCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p className="text-gray-700 mb-6">{alertConfig.message}</p>
            <div className="flex justify-end">
              <button
                onClick={closeAlert}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddDocument
