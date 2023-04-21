import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(process.env.VUE_APP_SUPABASE_URL, process.env.VUE_APP_SUPABASE_KEY)
