import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vcpjatrufklagajpkzzr.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcGphdHJ1ZmtsYWdhanBrenpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTc0NTQsImV4cCI6MjA3MDI3MzQ1NH0.SUfnd3JndjJ--NXPMlETQp1Vvv6IGSj9ulNWJEhrVbA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, context = "") => {
  console.error(`Supabase error ${context}:`, error)

  if (error.message.includes("relation") && error.message.includes("does not exist")) {
    return "Database table not found. Please run the setup scripts."
  }

  if (error.message.includes("RLS")) {
    return "Permission denied. Please check database policies."
  }

  if (error.message.includes("storage")) {
    return "Storage error. Please check bucket configuration."
  }

  return error.message || "An unexpected error occurred"
}

// Helper function to get proper image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null

  // If it's already a full URL, return as is
  if (imageUrl.startsWith("http")) {
    return imageUrl
  }

  // If it's a storage path, construct the full URL
  return `${supabaseUrl}/storage/v1/object/public/gallery-images/${imageUrl}`
}

// Helper function to validate image URL
export const validateImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch {
    return false
  }
}
