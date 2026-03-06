import { Pool } from 'pg'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

// Fix SSL issues with Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
})

let dbInitialized = false

// Initialize database schema
async function initDb() {
  if (dbInitialized) return
  
  const client = await pool.connect()
  try {
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        name TEXT NOT NULL,
        company_name TEXT,
        logo_url TEXT,
        plan TEXT DEFAULT 'free',
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        oauth_provider TEXT,
        oauth_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS flows (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        client_name TEXT NOT NULL,
        client_email TEXT,
        welcome_message TEXT,
        slug TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'draft',
        is_template BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS steps (
        id TEXT PRIMARY KEY,
        flow_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        url TEXT,
        file_id TEXT,
        file_name TEXT,
        position INTEGER NOT NULL,
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        original_name TEXT NOT NULL,
        stored_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    
    // Run migrations to add any missing columns to existing tables
    // This ensures schema stays in sync when new features are added
    await runMigrations(client)
    
    dbInitialized = true
    console.log('Database initialized')
  } catch (error) {
    console.error('Database init error:', error)
    throw error
  } finally {
    client.release()
  }
}

// Run schema migrations to add missing columns
// This keeps existing databases in sync with code changes
async function runMigrations(client: any) {
  const migrations = [
    // flows table migrations
    { table: 'flows', column: 'is_template', sql: 'ALTER TABLE flows ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false' },
    { table: 'flows', column: 'completed_at', sql: 'ALTER TABLE flows ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP' },
    
    // steps table migrations
    { table: 'steps', column: 'file_id', sql: 'ALTER TABLE steps ADD COLUMN IF NOT EXISTS file_id TEXT' },
    { table: 'steps', column: 'file_name', sql: 'ALTER TABLE steps ADD COLUMN IF NOT EXISTS file_name TEXT' },
    { table: 'steps', column: 'completed_at', sql: 'ALTER TABLE steps ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP' },
    
    // users table migrations
    { table: 'users', column: 'oauth_provider', sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider TEXT' },
    { table: 'users', column: 'oauth_id', sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_id TEXT' },
    { table: 'users', column: 'company_name', sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name TEXT' },
    { table: 'users', column: 'logo_url', sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS logo_url TEXT' },
    { table: 'users', column: 'stripe_customer_id', sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT' },
    { table: 'users', column: 'stripe_subscription_id', sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT' },
  ]
  
  for (const migration of migrations) {
    try {
      await client.query(migration.sql)
    } catch (error: any) {
      // Ignore "column already exists" errors, log others
      if (!error.message?.includes('already exists')) {
        console.error(`Migration failed for ${migration.table}.${migration.column}:`, error.message)
      }
    }
  }
  
  console.log('Schema migrations completed')
}

// Helper functions
function uuid() {
  return crypto.randomUUID()
}

function generateSlug() {
  return crypto.randomBytes(6).toString('base64url')
}

// Types
export interface User {
  id: string
  email: string
  password_hash: string | null
  name: string
  company_name: string | null
  logo_url: string | null
  plan: 'free' | 'pro'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  oauth_provider: string | null
  oauth_id: string | null
  created_at: string
}

export interface Flow {
  id: string
  user_id: string
  client_name: string
  client_email: string | null
  welcome_message: string | null
  slug: string
  status: 'draft' | 'published' | 'completed'
  is_template: boolean
  created_at: string
  completed_at: string | null
}

export interface Step {
  id: string
  flow_id: string
  title: string
  description: string | null
  url: string | null
  file_id: string | null
  file_name: string | null
  position: number
  completed: boolean
  completed_at: string | null
}

export interface FileRecord {
  id: string
  user_id: string
  original_name: string
  stored_name: string
  mime_type: string
  size: number
  created_at: string
}

// Database operations
export const database = {
  // Users
  createUser: async (email: string, password: string, name: string) => {
    await initDb()
    const id = uuid()
    const password_hash = bcrypt.hashSync(password, 10)
    await pool.query(
      'INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)',
      [id, email, password_hash, name]
    )
    return id
  },

  createUserFromOAuth: async (email: string, name: string, provider: string, providerId: string) => {
    await initDb()
    const id = uuid()
    await pool.query(
      'INSERT INTO users (id, email, name, oauth_provider, oauth_id) VALUES ($1, $2, $3, $4, $5)',
      [id, email, name, provider, providerId]
    )
    return id
  },

  getUserByEmail: async (email: string) => {
    await initDb()
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0] as User | undefined
  },

  getUserById: async (id: string) => {
    await initDb()
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0] as User | undefined
  },

  updateUser: async (id: string, data: Partial<User>) => {
    await initDb()
    const fields = Object.keys(data).filter(k => k !== 'id' && k !== 'password_hash')
    if (fields.length === 0) return
    
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ')
    const values = [id, ...fields.map(f => data[f as keyof User])]
    await pool.query(`UPDATE users SET ${setClause} WHERE id = $1`, values)
  },

  verifyPassword: (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash)
  },

  // Sessions
  createSession: async (userId: string) => {
    await initDb()
    const id = uuid()
    const token = crypto.randomBytes(32).toString('hex')
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    
    await pool.query(
      'INSERT INTO sessions (id, user_id, token, expires_at) VALUES ($1, $2, $3, $4)',
      [id, userId, token, expires_at]
    )
    
    return token
  },

  getSession: async (token: string) => {
    await initDb()
    const result = await pool.query(`
      SELECT s.*, u.* FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = $1 AND s.expires_at > NOW()
    `, [token])
    return result.rows[0] as (User & { token: string }) | undefined
  },

  deleteSession: async (token: string) => {
    await initDb()
    await pool.query('DELETE FROM sessions WHERE token = $1', [token])
  },

  // Files
  createFile: async (userId: string, originalName: string, storedName: string, mimeType: string, size: number) => {
    await initDb()
    const id = uuid()
    await pool.query(
      'INSERT INTO files (id, user_id, original_name, stored_name, mime_type, size) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, userId, originalName, storedName, mimeType, size]
    )
    return id
  },

  getFileById: async (id: string) => {
    await initDb()
    const result = await pool.query('SELECT * FROM files WHERE id = $1', [id])
    return result.rows[0] as FileRecord | undefined
  },

  deleteFile: async (id: string) => {
    await initDb()
    await pool.query('DELETE FROM files WHERE id = $1', [id])
  },

  // Flows
  createFlow: async (userId: string, clientName: string, clientEmail?: string, welcomeMessage?: string, isTemplate?: boolean) => {
    await initDb()
    const id = uuid()
    const slug = generateSlug()
    
    await pool.query(
      'INSERT INTO flows (id, user_id, client_name, client_email, welcome_message, slug, is_template) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, userId, clientName, clientEmail || null, welcomeMessage || null, slug, isTemplate || false]
    )
    
    return { id, slug }
  },

  getFlowsByUserId: async (userId: string) => {
    await initDb()
    const result = await pool.query(`
      SELECT f.*, 
        COALESCE(f.is_template, false) as is_template,
        (SELECT COUNT(*) FROM steps WHERE flow_id = f.id) as total_steps,
        (SELECT COUNT(*) FROM steps WHERE flow_id = f.id AND completed = true) as completed_steps
      FROM flows f
      WHERE f.user_id = $1
      ORDER BY f.is_template DESC, f.created_at DESC
    `, [userId])
    return result.rows as (Flow & { total_steps: number; completed_steps: number })[]
  },

  getFlowById: async (id: string) => {
    await initDb()
    const result = await pool.query('SELECT * FROM flows WHERE id = $1', [id])
    return result.rows[0] as Flow | undefined
  },

  getFlowBySlug: async (slug: string) => {
    await initDb()
    const result = await pool.query('SELECT * FROM flows WHERE slug = $1', [slug])
    return result.rows[0] as Flow | undefined
  },

  updateFlow: async (id: string, data: Partial<Flow>) => {
    await initDb()
    const fields = Object.keys(data).filter(k => k !== 'id')
    if (fields.length === 0) return
    
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ')
    const values = [id, ...fields.map(f => data[f as keyof Flow])]
    await pool.query(`UPDATE flows SET ${setClause} WHERE id = $1`, values)
  },

  deleteFlow: async (id: string) => {
    await initDb()
    await pool.query('DELETE FROM steps WHERE flow_id = $1', [id])
    await pool.query('DELETE FROM flows WHERE id = $1', [id])
  },

  getActiveFlowCount: async (userId: string) => {
    await initDb()
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM flows WHERE user_id = $1 AND status != 'completed'",
      [userId]
    )
    return parseInt(result.rows[0].count)
  },

  // Steps
  createStep: async (flowId: string, title: string, description: string | null, url: string | null, position: number, fileId?: string, fileName?: string) => {
    await initDb()
    const id = uuid()
    await pool.query(
      'INSERT INTO steps (id, flow_id, title, description, url, file_id, file_name, position) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, flowId, title, description, url, fileId || null, fileName || null, position]
    )
    return id
  },

  getStepsByFlowId: async (flowId: string) => {
    await initDb()
    const result = await pool.query('SELECT * FROM steps WHERE flow_id = $1 ORDER BY position', [flowId])
    return result.rows as Step[]
  },

  updateStep: async (id: string, data: Partial<Step>) => {
    await initDb()
    const fields = Object.keys(data).filter(k => k !== 'id')
    if (fields.length === 0) return
    
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ')
    const values = [id, ...fields.map(f => data[f as keyof Step])]
    await pool.query(`UPDATE steps SET ${setClause} WHERE id = $1`, values)
  },

  deleteStep: async (id: string) => {
    await initDb()
    await pool.query('DELETE FROM steps WHERE id = $1', [id])
  },

  reorderSteps: async (flowId: string, stepIds: string[]) => {
    await initDb()
    for (let i = 0; i < stepIds.length; i++) {
      await pool.query('UPDATE steps SET position = $1 WHERE id = $2 AND flow_id = $3', [i, stepIds[i], flowId])
    }
  },

  completeStep: async (stepId: string) => {
    await initDb()
    const now = new Date().toISOString()
    await pool.query('UPDATE steps SET completed = true, completed_at = $1 WHERE id = $2', [now, stepId])
    
    const stepResult = await pool.query('SELECT flow_id FROM steps WHERE id = $1', [stepId])
    const flowId = stepResult.rows[0]?.flow_id
    
    const incompleteResult = await pool.query('SELECT COUNT(*) as count FROM steps WHERE flow_id = $1 AND completed = false', [flowId])
    
    if (parseInt(incompleteResult.rows[0].count) === 0) {
      await pool.query("UPDATE flows SET status = 'completed', completed_at = $1 WHERE id = $2", [now, flowId])
    }
    
    return flowId
  },
}

export default database
