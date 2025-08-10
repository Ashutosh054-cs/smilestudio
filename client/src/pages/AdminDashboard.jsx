"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit3, Save, Plus, Camera, LogOut, Percent, AlertCircle, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase, handleSupabaseError } from "../services/supabaseClient"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("gallery")
  const navigate = useNavigate()
  const [error, setError] = useState("")

  // Check if user is authenticated
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      navigate("/login")
    }
  }, [navigate])

  // Gallery State
  const [galleryImages, setGalleryImages] = useState([])
  const [loading, setLoading] = useState(false)

  // Load gallery images from Supabase
  useEffect(() => {
    fetchGalleryImages()
  }, [])

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
  const [newImage, setNewImage] = useState({
    title: "",
    category: "wedding",
    imageUrl: "",
    file: null,
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [uploadMethod, setUploadMethod] = useState("file")

  const categories = ["wedding", "prewedding", "engagement", "event", "portrait", "maternity", "other"]

  // Upload file to Supabase Storage
  const uploadFileToSupabase = async (file) => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { data, error } = await supabase.storage.from("gallery-images").upload(fileName, file)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery-images").getPublicUrl(fileName)

    return publicUrl
  }

  // Gallery Management Functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert("File too large! Please choose an image under 5MB.")
        e.target.value = ""
        return
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file only!")
        e.target.value = ""
        return
      }

      const fileUrl = URL.createObjectURL(file)
      setNewImage({ ...newImage, file: file, imageUrl: fileUrl })
    }
  }

  const handleAddImage = async () => {
    if (!newImage.title || (!newImage.imageUrl && !newImage.file)) return

    setLoading(true)
    setError("")

    try {
      let imageUrl = newImage.imageUrl

      if (newImage.file) {
        imageUrl = await uploadFileToSupabase(newImage.file)
      }

      const { data, error } = await supabase
        .from("gallery_images")
        .insert([
          {
            title: newImage.title,
            category: newImage.category,
            image_url: imageUrl,
          },
        ])
        .select()

      if (error) throw error

      await fetchGalleryImages()
      setNewImage({ title: "", category: "wedding", imageUrl: "", file: null })
      setShowAddForm(false)
      alert("Image added successfully!")
    } catch (error) {
      const errorMessage = handleSupabaseError(error, "adding image")
      setError(errorMessage)
      console.error("Error adding image:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async (id, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return

    try {
      setError("")

      // Delete from database
      const { error: dbError } = await supabase.from("gallery_images").delete().eq("id", id)

      if (dbError) throw dbError

      // Try to delete from storage (optional, won't fail if file doesn't exist)
      if (imageUrl && imageUrl.includes("gallery-images")) {
        const fileName = imageUrl.split("/").pop()
        await supabase.storage.from("gallery-images").remove([fileName])
      }

      await fetchGalleryImages()
      alert("Image deleted successfully!")
    } catch (error) {
      const errorMessage = handleSupabaseError(error, "deleting image")
      setError(errorMessage)
      console.error("Error deleting image:", error)
    }
  }

  // Discount Management Functions
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Camera className="text-pink-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">Picture Smile Studio - Administrative Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Home size={16} />
                <span>View Site</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
        <div className="flex space-x-1 mb-8 bg-gray-200 p-1 rounded-lg w-fit">
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Camera className="text-pink-600" />
                Gallery Management ({galleryImages.length} images)
              </h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2 transition-colors"
              >
                <Plus size={16} /> Add New Image
              </button>
            </div>

            {/* Add New Image Form */}
            {showAddForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
                <h3 className="font-semibold mb-4">Add New Image</h3>

                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setUploadMethod("file")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      uploadMethod === "file" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    Upload from Device
                  </button>
                  <button
                    onClick={() => setUploadMethod("url")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      uploadMethod === "url" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    Enter Image URL
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Image Title"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    className="p-3 border rounded-lg focus:outline-none focus:border-pink-500"
                  />

                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
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
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:border-pink-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Max size: 5MB • Formats: JPG, PNG, WebP</p>
                    </div>
                  ) : (
                    <input
                      type="url"
                      placeholder="Image URL (https://...)"
                      value={newImage.imageUrl}
                      onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                      className="p-3 border rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  )}
                </div>

                {newImage.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={newImage.imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=128&width=128&text=Error Loading"
                        setNewImage({ ...newImage, imageUrl: "" })
                      }}
                    />
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddImage}
                    disabled={!newImage.title || (!newImage.imageUrl && !newImage.file) || loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Adding..." : "Add Image"}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setNewImage({ title: "", category: "wedding", imageUrl: "", file: null })
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Gallery Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative group">
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        console.log("Image failed to load:", image.image_url)
                        e.target.src = `https://via.placeholder.com/400x300/cccccc/666666?text=${encodeURIComponent(image.title)}`
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteImage(image.id, image.image_url)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                      {image.category}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 truncate">{image.image_url}</p>
                  </div>
                </div>
              ))}
            </div>

            {galleryImages.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <Camera size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No images yet</h3>
                <p>Add your first image to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Discount Settings Tab */}
        {activeTab === "discounts" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Percent className="text-purple-600" />
              Discount Settings
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
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
                        <div className="flex gap-2">
                          <button
                            onClick={saveDiscountChanges}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 transition-colors"
                          >
                            <Save size={16} /> Save
                          </button>
                          <button
                            onClick={() => setEditingDiscount(null)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
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
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 transition-colors"
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
