import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load .env from project root
const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTable() {
  const { data, error } = await supabase.from('newsletter_signups').select('count').limit(1)
  if (error) {
    console.error('Error checking table:', error.message)
    if (error.message.includes('relation "newsletter_signups" does not exist')) {
      console.log('RESULT: TABLE_MISSING')
    } else {
      console.log('RESULT: ERROR', error.message)
    }
  } else {
    console.log('RESULT: TABLE_EXISTS')
  }
}

checkTable()
