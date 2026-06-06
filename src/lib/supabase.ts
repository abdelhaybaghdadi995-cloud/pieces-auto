import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function createMockClient(): SupabaseClient {
  const noop = () => Promise.resolve({ data: null, error: new Error("Supabase credentials not configured") })
  return new Proxy({} as SupabaseClient, {
    get: (_, prop) => {
      if (prop === "then") return undefined
      return noop
    },
  })
}

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockClient()
