import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

// For server operations (bypasses RLS when needed)
export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

// For user operations (respects RLS)
export const createUserClient = (accessToken: string) => {
  return createClient<Database>(process.env.SUPABASE_URL || "", process.env.SUPABASE_ANON_KEY || "", {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
}

// Default client for unauthenticated operations
export const supabase = createClient<Database>(process.env.SUPABASE_URL || "", process.env.SUPABASE_ANON_KEY || "")
