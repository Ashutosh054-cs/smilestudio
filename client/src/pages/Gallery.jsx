"use client"
import { useState, useEffect } from "react"
import { Camera, Filter, X, Video, FileText, Play, Eye, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase, handleSupabaseError, getImageUrl } from "../services/supabaseClient"

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedMediaType, setSelectedMediaType] = useState("all")
  const [selectedImage, setSelectedImage] = useState(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryVideos, setGalleryVideos] = useState([])
  const [galleryAlbums, setGalleryAlbums] = useState([])
  const [collections, setCollections] = useState([])
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllGalleryData()
  }, [])

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_collections")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setCollections(data || [])
    } catch (error) {
      console.error("Error fetching collections:", error)
    }
  }

  const fetchAllGalleryData = async () => {
    try {
      setError("")
      setLoading(true)

      const [imagesResult, videosResult, albumsResult, collectionsResult] = await Promise.allSettled([
        supabase.from("gallery_images").select("*").order("created_at", { ascending: false }),
        supabase.from("gallery_videos").select("*").order("created_at", { ascending: false }),
        supabase.from("gallery_albums").select("*").order("created_at", { ascending: false }),
        supabase.from("gallery_collections").select("*").order("created_at", { ascending: false }),
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

      if (collectionsResult.status === "fulfilled" && !collectionsResult.value.error) {
        setCollections(collectionsResult.value.data || [])
      } else {
        console.error("Error fetching collections:", collectionsResult.reason || collectionsResult.value?.error)
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

  const fetchCollectionImages = async (collectionId) => {
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("collection_id", collectionId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching collection images:", error)
      return []
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
    { 
      key: "collections", 
      label: "Collections", 
      icon: FileText, 
      count: collections.length 
    },
  ]

  const getFilteredData = () => {
    let allData = []
    
    if (selectedMediaType === "all" || selectedMediaType === "collections") {
      allData = [...allData, ...collections.map((item) => ({ ...item, type: "collection" }))]
    }
    if (selectedMediaType === "all" || selectedMediaType === "images") {
      // Only show uncollected images in main view
      const uncollectedImages = galleryImages
        .filter(img => !img.collection_id)
        .map(item => ({ ...item, type: "image" }))
      allData = [...allData, ...uncollectedImages]
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

  const handleMediaClick = async (item) => {
    if (item.type === "collection") {
      setLoading(true);
      try {
        const images = await fetchCollectionImages(item.id);
        setSelectedCollection({
          ...item,
          images: images.map(img => ({
            ...img,
            type: "image"
          }))
        });
      } catch (error) {
        console.error("Error loading collection:", error);
        setError("Failed to load collection images");
      } finally {
        setLoading(false);
      }
    } else if (item.type === "image") {
      setSelectedImage(item);
      setIsImageModalOpen(true);
    } else if (item.type === "video") {
      navigate(`/video/${item.id}`);
    } else if (item.type === "album") {
      navigate(`/album/${item.id}`);
    }
  }

  const handleCollectionImageClick = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
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
            return (
              <div
                key={`${item.type}-${item.id}`}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                onClick={() => handleMediaClick(item)}
              >
                <div className="relative w-full h-64 overflow-hidden">
                  {item.type === "collection" ? (
                    <div className="relative w-full h-full bg-gradient-to-br from-purple-50 to-pink-50">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg"
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileText size={48} className="text-purple-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-800">View Collection</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // **EXISTING CODE:** Image/Video/Album rendering logic remains unchanged
                    item.type === "image" && (
                      <img
                        src={getImageSrc(item) || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => handleImageError(item.id)}
                        onLoad={() => handleImageLoad(item.id)}
                        loading="lazy"
                      />
                    )
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {item.type === "collection" ? item.name : item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 capitalize">{item.category}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {item.type === "collection" && <FileText size={12} />}
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </div>
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
      {selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-6xl max-h-[95vh] bg-white rounded-xl overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 p-3 sm:p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{selectedCollection.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{selectedCollection.category}</p>
              </div>
              <button
                onClick={() => setSelectedCollection(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Grid of Images */}
            <div className="p-2 sm:p-4 overflow-y-auto max-h-[calc(95vh-80px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {selectedCollection.images?.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                    onClick={() => handleCollectionImageClick(image)}
                  >
                    <img
                      src={getImageSrc(image)}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(image.id)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="text-white" size={24} />
                    </div>
                  </div>
                ))}
              </div>
              
              {(!selectedCollection.images || selectedCollection.images.length === 0) && (
                <div className="text-center py-12">
                  <Camera className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No images in this collection</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Update the image modal to use isImageModalOpen */}
      {selectedImage && isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-2 sm:p-4">
          <div className="relative max-w-5xl w-full max-h-[95vh] flex flex-col items-center">
            <button
              onClick={() => {
                setSelectedImage(null);
                setIsImageModalOpen(false);
              }}
              className="absolute top-2 right-2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={getImageSrc(selectedImage)}
              alt={selectedImage.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onError={() => handleImageError(selectedImage.id)}
            />
            <div className="w-full mt-4 px-4 text-white">
              <h3 className="text-lg sm:text-xl font-semibold mb-1">{selectedImage.title}</h3>
              <p className="text-sm opacity-90 capitalize">Category: {selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery