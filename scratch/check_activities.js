import { createClient } from '@supabase/supabase-js'
import path from 'path'
import fs from 'fs'

const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const parts = line.split('=')
    if (parts.length === 2) {
      process.env[parts[0].trim()] = parts[1].trim()
    }
  })
}

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkActivities() {
  const { data, error } = await supabase.from('activities').select('*')
  if (error) {
    console.error('Error:', error.message)
    return
  }
  console.log('Total activities:', data.length)
  console.log('Activities:', JSON.stringify(data, null, 2))
}

checkActivities()
