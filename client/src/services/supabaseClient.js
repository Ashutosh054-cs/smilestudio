import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vcpjatrufklagajpkzzr.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcGphdHJ1ZmtsYWdhanBrenpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTc0NTQsImV4cCI6MjA3MDI3MzQ1NH0.SUfnd3JndjJ--NXPMlETQp1Vvv6IGSj9ulNWJEhrVbA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      apikey: supabaseAnonKey,
    },
  },
})

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, context = "") => {
  console.error(`Supabase error ${context}:`, error)

  // More specific error messages
  if (error.code === "PGRST116") {
    return `No data found when ${context}. This might be normal if no records exist yet.`
  }
  if (error.code === "42501") {
    return `Permission denied when ${context}. Please check your database policies.`
  }
  if (error.code === "23505") {
    return `Duplicate entry when ${context}. This item already exists.`
  }
  if (error.code === "PGRST301") {
    return `Table or view not found when ${context}. Please check your database setup.`
  }

  return error.message || `An unexpected error occurred when ${context}`
}

// Helper function to get proper image URL from Supabase storage
export const getImageUrl = (path) => {
  if (!path) return null

  // If it's already a full URL, return as is
  if (path.startsWith("http")) {
    return path
  }

  try {
    // Get public URL from Supabase storage
    const { data } = supabase.storage.from("gallery-images").getPublicUrl(path)
    console.log("Generated public URL:", data.publicUrl) // Debug log
    return data.publicUrl
  } catch (error) {
    console.error("Error generating public URL:", error)
    return null
  }
}

// Helper function to upload file and get public URL
export const uploadImageToSupabase = async (file) => {
  try {
    console.log("Starting upload for file:", file.name, "Size:", file.size)

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    console.log("Generated filename:", fileName)

    const { data, error } = await supabase.storage.from("gallery-images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Upload error:", error)
      throw error
    }

    console.log("Upload successful:", data)

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery-images").getPublicUrl(fileName)

    console.log("Generated public URL:", publicUrl)

    return { fileName, publicUrl }
  } catch (error) {
    console.error("Upload error:", error)
    throw error
  }
}

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...")

    // Test database connection
    const { data: dbTest, error: dbError } = await supabase.from("gallery_images").select("count(*)").limit(1)

    if (dbError) {
      console.error("Database connection failed:", dbError)
      return { database: false, storage: false, error: dbError.message }
    }

    console.log("Database connection successful")

    // Test storage connection
    const { data: storageTest, error: storageError } = await supabase.storage
      .from("gallery-images")
      .list("", { limit: 1 })

    if (storageError) {
      console.error("Storage connection failed:", storageError)
      return { database: true, storage: false, error: storageError.message }
    }

    console.log("Storage connection successful")

    return { database: true, storage: true, error: null }
  } catch (error) {
    console.error("Connection test failed:", error)
    return { database: false, storage: false, error: error.message }
  }
}
