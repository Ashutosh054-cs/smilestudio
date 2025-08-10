"use client"

import { useState, useEffect } from "react"
import { Camera, Filter, X, AlertCircle } from "lucide-react"
import { supabase, handleSupabaseError } from "../services/supabaseClient"

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

      // Fallback to default images if Supabase fails
      const defaultImages = [
        {
          id: 1,
          title: "Wedding Ceremony",
          category: "wedding",
          image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        },
        {
          id: 2,
          title: "Pre-Wedding Shoot",
          category: "prewedding",
          image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
        },
        {
          id: 3,
          title: "Engagement Ring",
          category: "engagement",
          image_url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800",
        },
        {
          id: 4,
          title: "Portrait Session",
          category: "portrait",
          image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        },
        {
          id: 5,
          title: "Event Coverage",
          category: "event",
          image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        },
        {
          id: 6,
          title: "Maternity Shoot",
          category: "maternity",
          image_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
        },
      ]
      setGalleryImages(defaultImages)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { key: "all", label: "All Photos", count: galleryImages.length },
    { key: "wedding", label: "Wedding", count: galleryImages.filter((img) => img.category === "wedding").length },
    {
      key: "prewedding",
      label: "Pre-Wedding",
      count: galleryImages.filter((img) => img.category === "prewedding").length,
    },
    {
      key: "engagement",
      label: "Engagement",
      count: galleryImages.filter((img) => img.category === "engagement").length,
    },
    { key: "portrait", label: "Portrait", count: galleryImages.filter((img) => img.category === "portrait").length },
    { key: "event", label: "Events", count: galleryImages.filter((img) => img.category === "event").length },
    { key: "maternity", label: "Maternity", count: galleryImages.filter((img) => img.category === "maternity").length },
  ]

  const filteredImages =
    selectedCategory === "all" ? galleryImages : galleryImages.filter((img) => img.category === selectedCategory)

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-gray-50 to-white pt-32 pb-16 px-4 md:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white pt-32 pb-16 px-4 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-yellow-600" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-800">Notice</h3>
              <p className="text-yellow-700 text-sm">{error}</p>
              <p className="text-yellow-700 text-sm">Showing sample images instead.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Camera className="text-pink-600 mr-3" size={40} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">Our Gallery</h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Explore our collection of beautiful moments captured with passion and creativity
          </p>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.key
                  ? "bg-pink-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600 border border-gray-200"
              }`}
            >
              <Filter size={14} />
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.image_url || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    console.log("Gallery image failed to load:", image.image_url)
                    e.target.src = `https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(image.title)}`
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <Camera size={24} />
                  </div>
                </div>
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
                    {image.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-pink-600 transition-colors">
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <Camera className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No photos found</h3>
            <p className="text-gray-500">No images available in this category yet.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage.image_url || "/placeholder.svg"}
              alt={selectedImage.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/800x600/f3f4f6/6b7280?text=${encodeURIComponent(selectedImage.title)}`
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
              <p className="text-sm opacity-90 capitalize">Category: {selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery
