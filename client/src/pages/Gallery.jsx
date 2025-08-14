"use client"
import { useState, useEffect } from "react"
import { Camera, Filter, X, Video, FileText, Play, Eye, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase, handleSupabaseError, getImageUrl } from "../services/supabaseClient"

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedMediaType, setSelectedMediaType] = useState("all")
  const [selectedImage, setSelectedImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryVideos, setGalleryVideos] = useState([])
  const [galleryAlbums, setGalleryAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllGalleryData()
  }, [])

  const fetchAllGalleryData = async () => {
    try {
      setError("")
      setLoading(true)

      const [imagesResult, videosResult, albumsResult] = await Promise.allSettled([
        supabase.from("gallery_images").select("*").order("created_at", { ascending: false }),
        supabase.from("gallery_videos").select("*").order("created_at", { ascending: false }),
        supabase.from("gallery_albums").select("*").order("created_at", { ascending: false }),
      ])

      if (imagesResult.status === "fulfilled" && !imagesResult.value.error) {
        setGalleryImages(imagesResult.value.data || [])
      } else {
        console.error("Error fetching images:", imagesResult.reason || imagesResult.value?.error)
      }

      if (videosResult.status === "fulfilled" && !videosResult.value.error) {
        setGalleryVideos(videosResult.value.data || [])
      } else {
        console.error("Error fetching videos:", videosResult.reason || videosResult.value?.error)
      }

      if (albumsResult.status === "fulfilled" && !albumsResult.value.error) {
        setGalleryAlbums(albumsResult.value.data || [])
      } else {
        console.error("Error fetching albums:", albumsResult.reason || albumsResult.value?.error)
      }

      setImageLoadErrors(new Set())
    } catch (error) {
      const errorMessage = handleSupabaseError(error, "fetching gallery data")
      setError(errorMessage)
      console.error("Error fetching gallery data:", error)
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
    { key: "all", label: "All Categories", count: galleryImages.length + galleryVideos.length + galleryAlbums.length },
    {
      key: "wedding",
      label: "Wedding",
      count: [...galleryImages, ...galleryVideos, ...galleryAlbums].filter((item) => item.category === "wedding")
        .length,
    },
    {
      key: "prewedding",
      label: "Pre-Wedding",
      count: [...galleryImages, ...galleryVideos, ...galleryAlbums].filter((item) => item.category === "prewedding")
        .length,
    },
    {
      key: "engagement",
      label: "Engagement",
      count: [...galleryImages, ...galleryVideos, ...galleryAlbums].filter((item) => item.category === "engagement")
        .length,
    },
    {
      key: "portrait",
      label: "Portrait",
      count: [...galleryImages, ...galleryVideos, ...galleryAlbums].filter((item) => item.category === "portrait")
        .length,
    },
    {
      key: "event",
      label: "Events",
      count: [...galleryImages, ...galleryVideos, ...galleryAlbums].filter((item) => item.category === "event").length,
    },
    {
      key: "maternity",
      label: "Maternity",
      count: [...galleryImages, ...galleryVideos, ...galleryAlbums].filter((item) => item.category === "maternity")
        .length,
    },
  ]

  const mediaTypes = [
    {
      key: "all",
      label: "All Media",
      icon: Camera,
      count: galleryImages.length + galleryVideos.length + galleryAlbums.length,
    },
    { key: "images", label: "Images", icon: Camera, count: galleryImages.length },
    { key: "videos", label: "Videos", icon: Video, count: galleryVideos.length },
    { key: "albums", label: "Albums", icon: FileText, count: galleryAlbums.length },
  ]

  const getFilteredData = () => {
    let allData = []
    if (selectedMediaType === "all" || selectedMediaType === "images") {
      allData = [...allData, ...galleryImages.map((item) => ({ ...item, type: "image" }))]
    }
    if (selectedMediaType === "all" || selectedMediaType === "videos") {
      allData = [...allData, ...galleryVideos.map((item) => ({ ...item, type: "video" }))]
    }
    if (selectedMediaType === "all" || selectedMediaType === "albums") {
      allData = [...allData, ...galleryAlbums.map((item) => ({ ...item, type: "album" }))]
    }
    if (selectedCategory === "all") {
      return allData
    }
    return allData.filter((item) => item.category === selectedCategory)
  }

  const filteredData = getFilteredData()

  const handleMediaClick = (item) => {
    if (item.type === "image") {
      setSelectedImage(item)
    } else if (item.type === "video") {
      navigate(`/video/${item.id}`)
    } else if (item.type === "album") {
      navigate(`/album/${item.id}`)
    }
  }

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
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Camera className="text-pink-600 mr-3" size={40} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">Our Gallery</h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Capturing beautiful moments and creating lasting memories through images, videos, and albums
          </p>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {mediaTypes.map((mediaType) => {
            const IconComponent = mediaType.icon
            return (
              <button
                key={mediaType.key}
                onClick={() => setSelectedMediaType(mediaType.key)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedMediaType === mediaType.key
                    ? "bg-pink-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600 border border-gray-200"
                }`}
              >
                <IconComponent size={16} />
                {mediaType.label} ({mediaType.count})
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.key
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200"
              }`}
            >
              <Filter size={14} />
              {category.label} ({category.count})
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((item) => {
            const urlField = item.type === "image" ? "image_url" : item.type === "video" ? "video_url" : "album_url"
            return (
              <div
                key={`${item.type}-${item.id}`}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                onClick={() => handleMediaClick(item)}
              >
                <div className="relative w-full h-64 overflow-hidden">
                  {item.type === "image" && (
                    <img
                      src={getImageSrc(item) || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => handleImageError(item.id)}
                      onLoad={() => handleImageLoad(item.id)}
                      loading="lazy"
                    />
                  )}
                  {/* **UPDATED CODE:** Video display logic to use a thumbnail */}
                  {item.type === "video" && (
                    <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                      <img
                        src={item.thumbnail_url || "/placeholder-video.svg"}
                        alt={`Thumbnail for ${item.title}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-60 rounded-full p-3 group-hover:bg-opacity-80 transition-all">
                          <Play className="text-white" size={24} />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        <Video size={12} className="inline mr-1" />
                        VIDEO
                      </div>
                    </div>
                  )}
                  {item.type === "album" && (
                    <div className="relative w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url || "/placeholder-pdf.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none"
                          }}
                        />
                      ) : (
                        <div className="text-red-600 flex flex-col items-center">
                          <FileText size={48} className="mb-2" />
                          <span className="text-sm">PDF Album</span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 bg-opacity-80 rounded-full p-3 group-hover:bg-opacity-90 transition-all">
                          <Eye className="text-white" size={24} />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-red-600 bg-opacity-90 text-white px-2 py-1 rounded text-xs">
                        <FileText size={12} className="inline mr-1" />
                        ALBUM
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium">
                          {item.type === "image" ? "View Image" : item.type === "video" ? "Watch Video" : "View Album"}
                        </span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 capitalize">{item.category}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {item.type === "image" && <Camera size={12} />}
                      {item.type === "video" && <Video size={12} />}
                      {item.type === "album" && <FileText size={12} />}
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </div>
                  {item.type === "video" && item.duration && (
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, "0")}
                    </div>
                  )}
                  {item.type === "album" && item.page_count && (
                    <div className="text-xs text-gray-500 mt-1">Pages: {item.page_count}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {filteredData.length === 0 && !loading && (
          <div className="text-center py-20">
            <Camera className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No media found</h3>
            <p className="text-gray-500 mb-4">
              No {selectedMediaType === "all" ? "media" : selectedMediaType} available in this category yet.
            </p>
          </div>
        )}
      </div>
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