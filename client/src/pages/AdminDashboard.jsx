"use client"
import { useState, useEffect } from "react"
import React from "react"

import {
  Trash2,
  Edit3,
  Save,
  Plus,
  Camera,
  LogOut,
  Percent,
  AlertCircle,
  Home,
  Video,
  FileText,
  Play,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase, handleSupabaseError } from "../services/supabaseClient"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("gallery")
  const [activeMediaType, setActiveMediaType] = useState("images") // images, videos, albums
  const navigate = useNavigate()
  const [error, setError] = useState("")

  // Check if user is authenticated
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      navigate("/login")
    }
  }, [navigate])

  const [galleryImages, setGalleryImages] = useState([])
  const [galleryVideos, setGalleryVideos] = useState([])
  const [galleryAlbums, setGalleryAlbums] = useState([])
  const [loading, setLoading] = useState(false)

  // Load all media types from Supabase
  useEffect(() => {
    fetchAllMedia()
  }, [])

  const fetchAllMedia = async () => {
    await Promise.all([fetchGalleryImages(), fetchGalleryVideos(), fetchGalleryAlbums()])
  }

  const fetchGalleryImages = async () => {
    try {
      setError("")
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setGalleryImages(data || [])
    } catch (error) {
      const errorMessage = handleSupabaseError(error, "fetching images")
      setError(errorMessage)
      console.error("Error fetching images:", error)
    }
  }

  const fetchGalleryVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_videos")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setGalleryVideos(data || [])
    } catch (error) {
      console.error("Error fetching videos:", error)
    }
  }

  const fetchGalleryAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_albums")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setGalleryAlbums(data || [])
    } catch (error) {
      console.error("Error fetching albums:", error)
    }
  }

  // Discount Settings State
  const [discountSettings, setDiscountSettings] = useState({})

  // Load discount settings from Supabase
  useEffect(() => {
    fetchDiscountSettings()
  }, [])

  const fetchDiscountSettings = async () => {
    try {
      setError("")
      const { data, error } = await supabase.from("discount_settings").select("*")

      if (error) throw error

      const discountObj = {}
      data.forEach((item) => {
        discountObj[item.key] = {
          title: item.title,
          description: item.description,
          discount: item.discount,
          active: item.active,
        }
      })
      setDiscountSettings(discountObj)
    } catch (error) {
      const errorMessage = handleSupabaseError(error, "fetching discounts")
      setError(errorMessage)
      console.error("Error fetching discounts:", error)
    }
  }

  const [editingDiscount, setEditingDiscount] = useState(null)
  const [newMedia, setNewMedia] = useState({
    title: "",
    category: "wedding",
    url: "",
    file: null,
    type: "image", // image, video, album
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [uploadMethod, setUploadMethod] = useState("file")

  const categories = ["wedding", "prewedding", "engagement", "event", "portrait", "maternity", "other"]

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const maxSize = activeMediaType === "videos" ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB for videos, 10MB for others
      if (file.size > maxSize) {
        alert(
          `File too large! Please choose a ${activeMediaType === "videos" ? "video under 100MB" : "file under 10MB"}.`,
        )
        e.target.value = ""
        return
      }

      // File type validation
      let isValidType = false
      let mediaType = "image"

      if (activeMediaType === "images" && file.type.startsWith("image/")) {
        isValidType = true
        mediaType = "image"
      } else if (activeMediaType === "videos" && file.type.startsWith("video/")) {
        isValidType = true
        mediaType = "video"
      } else if (activeMediaType === "albums" && file.type === "application/pdf") {
        isValidType = true
        mediaType = "album"
      }

      if (!isValidType) {
        alert(
          `Please select a valid ${activeMediaType === "images" ? "image" : activeMediaType === "videos" ? "video" : "PDF"} file!`,
        )
        e.target.value = ""
        return
      }

      const fileUrl = URL.createObjectURL(file)
      setNewMedia({ ...newMedia, file: file, url: fileUrl, type: mediaType })
    }
  }

  const uploadMediaToSupabase = async (file, mediaType) => {
    const bucketName = `gallery-${mediaType === 'image' ? 'images' : mediaType === 'video' ? 'videos' : 'albums'}`   // gallery-images, gallery-videos, gallery-albums
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(fileName)

    return { publicUrl, fileName }
  }

  const handleAddMedia = async () => {
    if (!newMedia.title || (!newMedia.url && !newMedia.file)) return

    setLoading(true)
    setError("")

    try {
      let mediaUrl = newMedia.url
      let storagePath = null
      let tableName = ""
      let urlField = ""

      // Determine table and URL field based on media type
      switch (activeMediaType) {
        case "images":
          tableName = "gallery_images"
          urlField = "image_url"
          break
        case "videos":
          tableName = "gallery_videos"
          urlField = "video_url"
          break
        case "albums":
          tableName = "gallery_albums"
          urlField = "album_url"
          break
      }

      if (newMedia.file) {
        const uploadResult = await uploadMediaToSupabase(newMedia.file, newMedia.type)
        mediaUrl = uploadResult.publicUrl
        storagePath = uploadResult.fileName
      }

      const insertData = {
        title: newMedia.title,
        category: newMedia.category,
        [urlField]: mediaUrl,
        storage_path: storagePath,
        file_size: newMedia.file?.size || null,
      }

      // Add media-specific fields
      if (activeMediaType === "videos") {
        // For videos, we could add duration detection here
        insertData.duration = null // Could be enhanced with video metadata extraction
      } else if (activeMediaType === "albums") {
        // For PDFs, we could add page count detection here
        insertData.page_count = null // Could be enhanced with PDF metadata extraction
      }

      const { data, error } = await supabase.from(tableName).insert([insertData]).select()

      if (error) throw error

      await fetchAllMedia()
      setNewMedia({ title: "", category: "wedding", url: "", file: null, type: "image" })
      setShowAddForm(false)
      alert(`${activeMediaType.slice(0, -1)} added successfully!`)
    } catch (error) {
      const errorMessage = handleSupabaseError(error, `adding ${activeMediaType.slice(0, -1)}`)
      setError(errorMessage)
      console.error(`Error adding ${activeMediaType}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMedia = async (id, mediaUrl, storagePath, mediaType) => {
    if (!window.confirm(`Are you sure you want to delete this ${mediaType.slice(0, -1)}?`)) return

    try {
      setError("")
      const tableName = `gallery_${mediaType}`
      const bucketName = `gallery-${mediaType}`

      // Delete from database
      const { error: dbError } = await supabase.from(tableName).delete().eq("id", id)
      if (dbError) throw dbError

      // Try to delete from storage if we have a storage path
      if (storagePath) {
        await supabase.storage.from(bucketName).remove([storagePath])
      }

      await fetchAllMedia()
      alert(`${mediaType.slice(0, -1)} deleted successfully!`)
    } catch (error) {
      const errorMessage = handleSupabaseError(error, `deleting ${mediaType.slice(0, -1)}`)
      setError(errorMessage)
      console.error(`Error deleting ${mediaType}:`, error)
    }
  }

  const getCurrentMediaData = () => {
    switch (activeMediaType) {
      case "images":
        return galleryImages
      case "videos":
        return galleryVideos
      case "albums":
        return galleryAlbums
      default:
        return []
    }
  }

  const getMediaIcon = (type) => {
    switch (type) {
      case "images":
        return Camera
      case "videos":
        return Video
      case "albums":
        return FileText
      default:
        return Camera
    }
  }

  const getAcceptTypes = () => {
    switch (activeMediaType) {
      case "images":
        return "image/jpeg,image/jpg,image/png,image/webp"
      case "videos":
        return "video/mp4,video/mov,video/avi,video/webm"
      case "albums":
        return "application/pdf"
      default:
        return "image/*"
    }
  }

  // ... existing discount management functions ...

  const handleUpdateDiscount = (type, field, value) => {
    setDiscountSettings((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }))
  }

  const saveDiscountChanges = async () => {
    try {
      setError("")
      const discount = discountSettings[editingDiscount]

      const { error } = await supabase
        .from("discount_settings")
        .update({
          title: discount.title,
          description: discount.description,
          discount: discount.discount,
          active: discount.active,
        })
        .eq("key", editingDiscount)

      if (error) throw error

      setEditingDiscount(null)
      alert("Discount settings updated successfully!")
    } catch (error) {
      const errorMessage = handleSupabaseError(error, "updating discount")
      setError(errorMessage)
      console.error("Error updating discount:", error)
    }
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken")
      navigate("/")
    }
  }

  const goToHome = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center space-x-4">
              <Camera className="text-pink-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">Picture Smile Studio - Administrative Panel</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                <Home size={16} />
                <span>View Site</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row w-full sm:w-fit space-y-2 sm:space-y-0 sm:space-x-1 mb-8 bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "gallery" ? "bg-white text-pink-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Gallery Management
          </button>
          <button
            onClick={() => setActiveTab("discounts")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "discounts" ? "bg-white text-pink-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Discount Settings
          </button>
        </div>

        {/* Gallery Management Tab */}
        {activeTab === "gallery" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Camera className="text-pink-600" />
                  Gallery Management
                </h2>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  {[
                    { key: "images", label: "Images", icon: Camera, count: galleryImages.length },
                    { key: "videos", label: "Videos", icon: Video, count: galleryVideos.length },
                    { key: "albums", label: "Albums", icon: FileText, count: galleryAlbums.length },
                  ].map(({ key, label, icon: Icon, count }) => (
                    <button
                      key={key}
                      onClick={() => setActiveMediaType(key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        activeMediaType === key
                          ? "bg-white text-pink-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      <Icon size={16} />
                      {label} ({count})
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2 transition-colors w-full sm:w-auto"
              >
                <Plus size={16} /> Add New {activeMediaType.slice(0, -1)}
              </button>
            </div>

            {showAddForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
                <h3 className="font-semibold mb-4">Add New {activeMediaType.slice(0, -1)}</h3>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <button
                    onClick={() => setUploadMethod("file")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto ${
                      uploadMethod === "file" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    Upload from Device
                  </button>
                  <button
                    onClick={() => setUploadMethod("url")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto ${
                      uploadMethod === "url" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    Enter {activeMediaType.slice(0, -1)} URL
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder={`${activeMediaType.slice(0, -1)} Title`}
                    value={newMedia.title}
                    onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                    className="p-3 border rounded-lg focus:outline-none focus:border-pink-500"
                  />
                  <select
                    value={newMedia.category}
                    onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                    className="p-3 border rounded-lg focus:outline-none focus:border-pink-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="capitalize">
                        {cat}
                      </option>
                    ))}
                  </select>
                  {uploadMethod === "file" ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept={getAcceptTypes()}
                        onChange={handleFileUpload}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:border-pink-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {activeMediaType === "images" && "Max size: 5MB • Formats: JPG, PNG, WebP"}
                        {activeMediaType === "videos" && "Max size: 100MB • Formats: MP4, MOV, AVI, WebM"}
                        {activeMediaType === "albums" && "Max size: 10MB • Format: PDF only"}
                      </p>
                    </div>
                  ) : (
                    <input
                      type="url"
                      placeholder={`${activeMediaType.slice(0, -1)} URL (https://...)`}
                      value={newMedia.url}
                      onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                      className="p-3 border rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  )}
                </div>
                {newMedia.url && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    {activeMediaType === "images" && (
                      <img
                        src={newMedia.url || "/placeholder.svg"}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=128&width=128&text=Error Loading"
                          setNewMedia({ ...newMedia, url: "" })
                        }}
                      />
                    )}
                    {activeMediaType === "videos" && (
                      <video
                        src={newMedia.url}
                        className="w-48 h-32 object-cover rounded-lg border"
                        controls
                        onError={() => setNewMedia({ ...newMedia, url: "" })}
                      />
                    )}
                    {activeMediaType === "albums" && (
                      <div className="w-32 h-32 bg-red-100 border border-red-300 rounded-lg flex items-center justify-center">
                        <FileText className="text-red-600" size={32} />
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    onClick={handleAddMedia}
                    disabled={!newMedia.title || (!newMedia.url && !newMedia.file) || loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                  >
                    {loading ? "Adding..." : `Add ${activeMediaType.slice(0, -1)}`}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setNewMedia({ title: "", category: "wedding", url: "", file: null, type: "image" })
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getCurrentMediaData().map((item) => {
                const MediaIcon = getMediaIcon(activeMediaType)
                const urlField =
                  activeMediaType === "images" ? "image_url" : activeMediaType === "videos" ? "video_url" : "album_url"

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative group">
                      {activeMediaType === "images" && (
                        <img
                          src={item[urlField] || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = `/placeholder.svg?height=192&width=256&text=${encodeURIComponent(item.title)}`
                          }}
                        />
                      )}
                      {activeMediaType === "videos" && (
                        <div className="relative w-full h-48 bg-gray-900 flex items-center justify-center">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-white flex flex-col items-center">
                              <Play size={32} className="mb-2" />
                              <span className="text-sm">Video Preview</span>
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="text-white bg-black bg-opacity-50 rounded-full p-2" size={40} />
                          </div>
                        </div>
                      )}
                      {activeMediaType === "albums" && (
                        <div className="w-full h-48 bg-red-50 flex items-center justify-center border-b">
                          <div className="text-center">
                            <FileText className="text-red-600 mx-auto mb-2" size={48} />
                            <span className="text-sm text-red-700">PDF Album</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteMedia(item.id, item[urlField], item.storage_path, activeMediaType)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                        {item.category}
                      </span>
                      <div className="mt-2 text-xs text-gray-500">
                        {activeMediaType === "videos" && item.duration && (
                          <div>
                            Duration: {Math.floor(item.duration / 60)}:
                            {(item.duration % 60).toString().padStart(2, "0")}
                          </div>
                        )}
                        {activeMediaType === "albums" && item.page_count && <div>Pages: {item.page_count}</div>}
                        {item.file_size && <div>Size: {(item.file_size / (1024 * 1024)).toFixed(1)} MB</div>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{item[urlField]}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {getCurrentMediaData().length === 0 && (
              <div className="text-center py-20 text-gray-500">
                {React.createElement(getMediaIcon(activeMediaType), {
                  size: 64,
                  className: "mx-auto mb-4 text-gray-300",
                })}
                <h3 className="text-xl font-semibold mb-2">No {activeMediaType} yet</h3>
                <p>Add your first {activeMediaType.slice(0, -1)} to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* ... existing discount settings tab code ... */}
        {activeTab === "discounts" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Percent className="text-purple-600" />
              Discount Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(discountSettings).map(([key, discount]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-6">
                  <div className="space-y-4">
                    {editingDiscount === key ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            value={discount.title}
                            onChange={(e) => handleUpdateDiscount(key, "title", e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={discount.description}
                            onChange={(e) => handleUpdateDiscount(key, "description", e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:border-purple-500"
                            rows="2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={discount.discount}
                              onChange={(e) =>
                                handleUpdateDiscount(key, "discount", Number.parseInt(e.target.value) || 0)
                              }
                              className="w-20 p-2 border rounded-lg text-center focus:outline-none focus:border-purple-500"
                              min="0"
                              max="50"
                            />
                            <span className="text-gray-600">%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={discount.active}
                            onChange={(e) => handleUpdateDiscount(key, "active", e.target.checked)}
                            className="rounded"
                          />
                          <label className="text-sm text-gray-700">Active</label>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={saveDiscountChanges}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-1 transition-colors w-full sm:w-auto"
                          >
                            <Save size={16} /> Save
                          </button>
                          <button
                            onClick={() => setEditingDiscount(null)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full sm:w-auto"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <h3 className="font-semibold text-lg">{discount.title}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              discount.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {discount.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{discount.description}</p>
                        <div className="text-3xl font-bold text-purple-600">Save {discount.discount}%</div>
                        <button
                          onClick={() => setEditingDiscount(key)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 transition-colors w-full sm:w-auto"
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
