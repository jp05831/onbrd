'use client'

import { useState, useTransition } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  plan: string
  is_banned: boolean
  created_at: string
}

interface Props {
  initialUsers: User[]
}

const PAGE_SIZE = 25

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function UsersTable({ initialUsers }: Props) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState(initialUsers)
  const [confirmBan, setConfirmBan] = useState<User | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleBanToggle = async (user: User, ban: boolean) => {
    setConfirmBan(null)
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${user.id}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ban }),
      })
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_banned: ban } : u))
      }
    })
  }

  return (
    <div>
      <div className="p-4 border-b border-neutral-800">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-neutral-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Plan</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Joined</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">No users found</td>
              </tr>
            ) : (
              paginated.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4 text-neutral-200 font-mono text-xs">{user.email}</td>
                  <td className="px-6 py-4 text-neutral-400">{user.name || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      user.plan === 'pro'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {user.plan === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 text-xs">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                      user.is_banned
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.is_banned ? 'bg-red-400' : 'bg-green-400'}`} />
                      {user.is_banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_banned ? (
                      <button
                        onClick={() => handleBanToggle(user, false)}
                        disabled={isPending}
                        className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50 font-medium"
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmBan(user)}
                        disabled={isPending}
                        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 font-medium"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-500">
            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 hover:bg-neutral-800 rounded-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-neutral-400">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 hover:bg-neutral-800 rounded-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {confirmBan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold mb-2">Ban this user?</h3>
            <p className="text-sm text-neutral-400 mb-1">You are about to ban:</p>
            <p className="text-sm text-white font-mono mb-6">{confirmBan.email}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmBan(null)}
                className="flex-1 py-2 border border-neutral-700 text-neutral-300 text-sm rounded-lg hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBanToggle(confirmBan, true)}
                className="flex-1 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
