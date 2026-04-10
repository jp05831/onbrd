import { verifyAdminSession } from '@/app/lib/admin-auth'
import { redirect } from 'next/navigation'
import { Pool } from 'pg'
import UsersTable from './UsersTable'
import SignupChart from './SignupChart'
import { Users, UserPlus, TrendingUp, Ban } from 'lucide-react'

const pool = new Pool({
  connectionString: (() => { const r = process.env.POSTGRES_URL || process.env.DATABASE_URL || ''; try { const u = new URL(r); u.searchParams.delete('sslmode'); return u.toString() } catch { return r } })(),
  ssl: { rejectUnauthorized: false },
})

async function getStats() {
  // Note: is_banned column is managed by db.ts migrations — no DDL needed here
  const [total, last7, last30, banned, signups] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM users'),
    pool.query("SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days'"),
    pool.query("SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days'"),
    pool.query('SELECT COUNT(*) FROM users WHERE is_banned = true'),
    pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `),
  ])

  const signupMap: Record<string, number> = {}
  signups.rows.forEach((r: any) => {
    signupMap[r.date.toISOString().split('T')[0]] = parseInt(r.count)
  })
  const signupsByDay = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    signupsByDay.push({ date: dateStr, count: signupMap[dateStr] || 0 })
  }

  return {
    total: parseInt(total.rows[0].count),
    last7: parseInt(last7.rows[0].count),
    last30: parseInt(last30.rows[0].count),
    banned: parseInt(banned.rows[0].count),
    signupsByDay,
  }
}

async function getUsers() {
  const result = await pool.query(
    'SELECT id, email, name, plan, is_banned, created_at FROM users ORDER BY created_at DESC'
  )
  return result.rows
}

export default async function AdminPage() {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  const [stats, users] = await Promise.all([getStats(), getUsers()])

  const statCards = [
    { label: 'Total Users', value: stats.total, icon: Users, color: 'text-blue-400' },
    { label: 'Joined Last 7 Days', value: stats.last7, icon: UserPlus, color: 'text-green-400' },
    { label: 'Joined Last 30 Days', value: stats.last30, icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Banned Users', value: stats.banned, icon: Ban, color: 'text-red-400' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-neutral-500 mt-1 text-sm">Overview of all users and activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-neutral-500">{card.label}</p>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className="text-3xl font-semibold text-white">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-medium text-neutral-300 mb-5">New Signups — Last 30 Days</h2>
        <SignupChart data={stats.signupsByDay} />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
        <div className="p-6 border-b border-neutral-800">
          <h2 className="text-sm font-medium text-neutral-300">All Users</h2>
        </div>
        <UsersTable initialUsers={users} />
      </div>
    </div>
  )
}
