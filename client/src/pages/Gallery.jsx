"use client"
import { useState, useEffect } from "react"
import { Camera, Filter, X } from "lucide-react"
import { supabase, handleSupabaseError, getImageUrl } from "../services/supabaseClient"

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set())

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      setError("")
      setLoading(true)

      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setGalleryImages(data || [])
      setImageLoadErrors(new Set())
    } catch (error) {
      const errorMessage = handleSupabaseError(error, "fetching images")
      setError(errorMessage)
      console.error("Error fetching images:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (imageId) => {
    setImageLoadErrors((prev) => new Set([...prev, imageId]))
  }

  const handleImageLoad = (imageId) => {
    setImageLoadErrors((prev) => {
      const newSet = new Set(prev)
      newSet.delete(imageId)
      return newSet
    })
  }

  const getImageSrc = (image) => {
    if (imageLoadErrors.has(image.id)) {
      return `https://via.placeholder.com/800x600/ff0000/ffffff?text=ERROR`
    }

    if (image.storage_path) {
      try {
        const imageUrl = getImageUrl(image.storage_path)
        if (imageUrl) {
          return imageUrl
        }
      } catch (err) {
        console.error("Error getting Supabase image URL:", err)
      }
    }

    if (image.image_url) {
      try {
        if (image.image_url.includes("unsplash.com")) {
          const url = new URL(image.image_url)
          url.searchParams.set("auto", "format")
          url.searchParams.set("fit", "crop")
          url.searchParams.set("q", "80")
          return url.toString()
        }
        return image.image_url
      } catch (err) {
        console.error("Error processing image URL:", err, image.image_url)
      }
    }

    return `https://via.placeholder.com/800x600/cccccc/666666?text=No+Image`
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
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Camera className="text-pink-600 mr-3" size={40} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">Our Gallery</h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Capturing beautiful moments and creating lasting memories
          </p>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

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
          {filteredImages.map((image) => {
            const imageSrc = getImageSrc(image)

            return (
              <div
                key={image.id}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    src={imageSrc || "/placeholder.svg"}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(image.id)}
                    onLoad={() => handleImageLoad(image.id)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{image.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{image.category}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && !loading && (
          <div className="text-center py-20">
            <Camera className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No photos found</h3>
            <p className="text-gray-500 mb-4">No images available in this category yet.</p>
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
              src={getImageSrc(selectedImage) || "/placeholder.svg"}
              alt={selectedImage.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onError={() => handleImageError(selectedImage.id)}
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