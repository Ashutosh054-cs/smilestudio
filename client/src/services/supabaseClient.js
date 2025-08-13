import { createClient } from "@supabase/supabase-js"

// --- Supabase Configuration ---
const supabaseUrl = "https://vcpjatrufklagajpkzzr.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcGphdHJ1ZmtsYWdhanBrenpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTc0NTQsImV4cCI6MjA3MDI3MzQ1NH0.SUfnd3JndjJ--NXPMlETQp1Vvv6IGSj9ulNWJEhrVbA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  global: { headers: { apikey: supabaseAnonKey } },
})

// --- Error Handling ---
export const handleSupabaseError = (error, context = "") => {
  console.error(`Supabase error ${context}:`, error)
  if (error?.code === "PGRST116") return `No data found when ${context}.`
  if (error?.code === "42501") return `Permission denied when ${context}.`
  if (error?.code === "23505") return `Duplicate entry when ${context}.`
  if (error?.code === "PGRST301") return `Table or view not found when ${context}.`
  return error?.message || `An unexpected error occurred when ${context}`
}

// --- URL Helpers ---
const getPublicUrl = (path, bucket) => {
  if (!path) return null
  if (path.startsWith("http")) return path
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  } catch (error) {
    console.error(`Error generating public URL from ${bucket}:`, error)
    return null
  }
}

export const getImageUrl = (path) => getPublicUrl(path, "gallery-images")
export const getVideoUrl = (path) => getPublicUrl(path, "gallery-videos")
export const getAlbumUrl = (path) => getPublicUrl(path, "gallery-albums")

// --- Upload Helpers ---
const uploadFileToSupabase = async (file, bucket) => {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })
    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return { fileName, publicUrl }
  } catch (error) {
    console.error(`Error uploading file to ${bucket}:`, error)
    throw error
  }
}

export const uploadImageToSupabase = (file) => uploadFileToSupabase(file, "gallery-images")
export const uploadVideoToSupabase = (file) => uploadFileToSupabase(file, "gallery-videos")
export const uploadAlbumToSupabase = (file) => uploadFileToSupabase(file, "gallery-albums")

// --- Delete Helper ---
export const deleteFromSupabaseStorage = async (fileName, bucket) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([fileName])
    if (error) throw error
    return true
  } catch (error) {
    console.error(`Error deleting file from ${bucket}:`, error)
    throw error
  }
}

// --- Auth Helpers ---
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// --- Test Connection ---
export const testSupabaseConnection = async () => {
  try {
    // DB test
    const { error: dbError } = await supabase.from("gallery_videos").select("count(*)").limit(1)
    if (dbError) return { database: false, storage: false, error: dbError.message }

    // Storage tests
    const buckets = ["gallery-images", "gallery-videos", "gallery-albums"]
    for (const bucket of buckets) {
      const { error: storageError } = await supabase.storage.from(bucket).list("", { limit: 1 })
      if (storageError) return { database: true, storage: false, error: `${bucket} - ${storageError.message}` }
    }

    return { database: true, storage: true, error: null }
  } catch (error) {
    return { database: false, storage: false, error: error.message }
  }
}
