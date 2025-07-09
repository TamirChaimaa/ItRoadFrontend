"use client"

import { useState } from "react"
import { Upload, X, FileText, ImageIcon, Video, Archive, Plus } from "lucide-react"

const AddDocument = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    files: [],
  })
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({ ...prev, files }))
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setFormData((prev) => ({ ...prev, files }))
    }
  }

  const removeFile = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove),
    }))
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log("Form submitted:", formData)
    setIsUploading(false)
    setUploadProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Add Documents</h1>
          <p className="text-gray-600">Upload and organize your files easily</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title & Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Document Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
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
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="report">📊 Report</option>
                    <option value="presentation">📽️ Presentation</option>
                    <option value="contract">📋 Contract</option>
                    <option value="other">📁 Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200 resize-none"
                  placeholder="Describe your document..."
                />
              </div>

              {/* File Upload Zone */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">Files</label>

                <div
                  className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-300 ${
                    dragActive ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:border-cyan-400 hover:bg-gray-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Drag your files here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">PDF, DOC, XLS, PPT, Images (Max 10MB per file)</p>
                    </div>
                  </div>
                </div>

                {/* File List */}
                {formData.files.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Selected Files:</h4>
                    <div className="grid gap-3">
                      {formData.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.name)}
                            <div>
                              <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                              <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="text-cyan-600 font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-2xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Upload Documents</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddDocument
