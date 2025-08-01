import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xtcrstluvaemzmjerwxs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y3JzdGx1dmFlbXptamVyd3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQzMzksImV4cCI6MjA2ODA4MDMzOX0.N-jZRY5wOTABv58bVNafzB3XiJqpfVP78DPPR8Gub64'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
