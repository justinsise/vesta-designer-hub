import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Schema-specific query helpers
export function vestaSchema(supabase) {
  return supabase.schema('vesta')
}

export function designerHubSchema(supabase) {
  return supabase.schema('designer_hub')
}
