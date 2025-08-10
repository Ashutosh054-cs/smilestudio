import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vcpjatrufklagajpkzzr.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcGphdHJ1ZmtsYWdhanBrenpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTc0NTQsImV4cCI6MjA3MDI3MzQ1NH0.SUfnd3JndjJ--NXPMlETQp1Vvv6IGSj9ulNWJEhrVbA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, context = "") => {
  console.error(`Supabase error ${context}:`, error)
  return error.message || "An unexpected error occurred"
}

export const getImageUrl = (path) => {
  return `${supabaseUrl}/storage/v1/object/public/${path}`
}
