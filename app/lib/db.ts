import Database from 'better-sqlite3'
import path from 'path'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const dbPath = path.join(process.cwd(), 'onboardlink.db')
const db = new Database(dbPath)

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    company_name TEXT,
    logo_url TEXT,
    plan TEXT DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS flows (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    welcome_message TEXT,
    slug TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
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
    completed BOOLEAN DEFAULT 0,
    completed_at TEXT,
    FOREIGN KEY (flow_id) REFERENCES flows(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    original_name TEXT NOT NULL,
    stored_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`)

// Run migrations for existing databases
try {
  db.exec(`ALTER TABLE steps ADD COLUMN file_id TEXT`)
} catch (e) { /* column already exists */ }

try {
  db.exec(`ALTER TABLE steps ADD COLUMN file_name TEXT`)
} catch (e) { /* column already exists */ }

try {
  db.exec(`ALTER TABLE users ADD COLUMN oauth_provider TEXT`)
} catch (e) { /* column already exists */ }

try {
  db.exec(`ALTER TABLE users ADD COLUMN oauth_id TEXT`)
} catch (e) { /* column already exists */ }

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
  createUser: (email: string, password: string, name: string) => {
    const id = uuid()
    const password_hash = bcrypt.hashSync(password, 10)
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name)
      VALUES (?, ?, ?, ?)
    `).run(id, email, password_hash, name)
    return id
  },

  getUserByEmail: (email: string) => {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined
  },

  createUserFromOAuth: (email: string, name: string, provider: string, providerId: string) => {
    const id = uuid()
    db.prepare(`
      INSERT INTO users (id, email, name, oauth_provider, oauth_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, email, name, provider, providerId)
    return id
  },

  getUserById: (id: string) => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined
  },

  updateUser: (id: string, data: Partial<User>) => {
    const fields = Object.keys(data).filter(k => k !== 'id' && k !== 'password_hash')
    if (fields.length === 0) return
    
    const sql = `UPDATE users SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`
    const values = [...fields.map(f => data[f as keyof User]), id]
    db.prepare(sql).run(...values)
  },

  verifyPassword: (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash)
  },

  // Sessions
  createSession: (userId: string) => {
    const id = uuid()
    const token = crypto.randomBytes(32).toString('hex')
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    
    db.prepare(`
      INSERT INTO sessions (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(id, userId, token, expires_at)
    
    return token
  },

  getSession: (token: string) => {
    const session = db.prepare(`
      SELECT s.*, u.* FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).get(token) as (User & { token: string }) | undefined
    return session
  },

  deleteSession: (token: string) => {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
  },

  // Flows
  createFlow: (userId: string, clientName: string, clientEmail?: string, welcomeMessage?: string) => {
    const id = uuid()
    const slug = generateSlug()
    
    db.prepare(`
      INSERT INTO flows (id, user_id, client_name, client_email, welcome_message, slug)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, userId, clientName, clientEmail || null, welcomeMessage || null, slug)
    
    return { id, slug }
  },

  getFlowsByUserId: (userId: string) => {
    const flows = db.prepare(`
      SELECT f.*, 
        (SELECT COUNT(*) FROM steps WHERE flow_id = f.id) as total_steps,
        (SELECT COUNT(*) FROM steps WHERE flow_id = f.id AND completed = 1) as completed_steps
      FROM flows f
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `).all(userId) as (Flow & { total_steps: number; completed_steps: number })[]
    return flows
  },

  getFlowById: (id: string) => {
    return db.prepare('SELECT * FROM flows WHERE id = ?').get(id) as Flow | undefined
  },

  getFlowBySlug: (slug: string) => {
    return db.prepare('SELECT * FROM flows WHERE slug = ?').get(slug) as Flow | undefined
  },

  updateFlow: (id: string, data: Partial<Flow>) => {
    const fields = Object.keys(data).filter(k => k !== 'id')
    if (fields.length === 0) return
    
    const sql = `UPDATE flows SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`
    const values = [...fields.map(f => data[f as keyof Flow]), id]
    db.prepare(sql).run(...values)
  },

  deleteFlow: (id: string) => {
    db.prepare('DELETE FROM flows WHERE id = ?').run(id)
  },

  getActiveFlowCount: (userId: string) => {
    const result = db.prepare(`
      SELECT COUNT(*) as count FROM flows 
      WHERE user_id = ? AND status != 'completed'
    `).get(userId) as { count: number }
    return result.count
  },

  // Files
  createFile: (userId: string, originalName: string, storedName: string, mimeType: string, size: number) => {
    const id = uuid()
    db.prepare(`
      INSERT INTO files (id, user_id, original_name, stored_name, mime_type, size)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, userId, originalName, storedName, mimeType, size)
    return id
  },

  getFileById: (id: string) => {
    return db.prepare('SELECT * FROM files WHERE id = ?').get(id) as FileRecord | undefined
  },

  deleteFile: (id: string) => {
    db.prepare('DELETE FROM files WHERE id = ?').run(id)
  },

  // Steps
  createStep: (flowId: string, title: string, description: string | null, url: string | null, position: number, fileId?: string, fileName?: string) => {
    const id = uuid()
    db.prepare(`
      INSERT INTO steps (id, flow_id, title, description, url, file_id, file_name, position)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, flowId, title, description, url, fileId || null, fileName || null, position)
    return id
  },

  getStepsByFlowId: (flowId: string) => {
    return db.prepare('SELECT * FROM steps WHERE flow_id = ? ORDER BY position').all(flowId) as Step[]
  },

  updateStep: (id: string, data: Partial<Step>) => {
    const fields = Object.keys(data).filter(k => k !== 'id')
    if (fields.length === 0) return
    
    const sql = `UPDATE steps SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`
    const values = [...fields.map(f => data[f as keyof Step]), id]
    db.prepare(sql).run(...values)
  },

  deleteStep: (id: string) => {
    db.prepare('DELETE FROM steps WHERE id = ?').run(id)
  },

  reorderSteps: (flowId: string, stepIds: string[]) => {
    const stmt = db.prepare('UPDATE steps SET position = ? WHERE id = ? AND flow_id = ?')
    stepIds.forEach((id, index) => {
      stmt.run(index, id, flowId)
    })
  },

  completeStep: (stepId: string) => {
    const now = new Date().toISOString()
    db.prepare('UPDATE steps SET completed = 1, completed_at = ? WHERE id = ?').run(now, stepId)
    
    // Check if all steps are complete
    const step = db.prepare('SELECT flow_id FROM steps WHERE id = ?').get(stepId) as { flow_id: string }
    const incomplete = db.prepare('SELECT COUNT(*) as count FROM steps WHERE flow_id = ? AND completed = 0').get(step.flow_id) as { count: number }
    
    if (incomplete.count === 0) {
      db.prepare('UPDATE flows SET status = ?, completed_at = ? WHERE id = ?').run('completed', now, step.flow_id)
    }
    
    return step.flow_id
  },
}

export default database
