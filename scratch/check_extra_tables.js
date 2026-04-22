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

async function checkTables() {
  const tables = ['activity_likes', 'comments']
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1)
    if (error) {
      console.log(`Table ${table}: MISSING or ERROR (${error.message})`)
    } else {
      console.log(`Table ${table}: EXISTS`)
    }
  }
}

checkTables()
