'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Plus, ExternalLink, Trash2, Copy, Check, Globe, FileText, Users, 
  Repeat, CheckCircle2, Search
} from 'lucide-react'

interface Flow {
  id: string
  client_name: string
  slug: string
  status: 'draft' | 'published' | 'completed'
  is_template: boolean
  total_steps: number
  completed_steps: number
  created_at: string
}

interface UserPlan {
  plan: 'free' | 'pro'
  activeFlows: number
  maxFlows: number
  maxStepsPerFlow: number
}

export default function DashboardPage() {
  const [flows, setFlows] = useState<Flow[]>([])
  const [userPlan, setUserPlan] = useState<UserPlan>({ plan: 'free', activeFlows: 0, maxFlows: 2, maxStepsPerFlow: 2 })
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [newFlow, setNewFlow] = useState({ client_name: '', client_email: '', welcome_message: '', is_template: false })
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'templates'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchFlows()
  }, [])

  const fetchFlows = async () => {
    try {
      const res = await fetch('/api/flows')
      if (res.ok) {
        const data = await res.json()
        setFlows(data.flows)
        setUserPlan(data.userPlan)
      }
    } catch (error) {
      console.error('Failed to fetch flows:', error)
    } finally {
      setLoading(false)
    }
  }

  const createFlow = async () => {
    if (!newFlow.client_name.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFlow),
      })
      if (res.ok) {
        const data = await res.json()
        setShowNewModal(false)
        setNewFlow({ client_name: '', client_email: '', welcome_message: '', is_template: false })
        window.location.href = `/dashboard/flows/${data.id}`
      }
    } catch (error) {
      console.error('Failed to create flow:', error)
    } finally {
      setCreating(false)
    }
  }

  const deleteFlow = async (id: string) => {
    if (!confirm('Delete this flow?')) return
    try {
      const res = await fetch(`/api/flows/${id}`, { method: 'DELETE' })
      if (res.ok) fetchFlows()
    } catch (error) {
      console.error('Failed to delete flow:', error)
    }
  }

  const copyLink = (slug: string, id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/onboard/${slug}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const canCreateFlow = userPlan.plan === 'pro' || userPlan.activeFlows < userPlan.maxFlows

  // Counts
  const clientFlows = flows.filter(f => !f.is_template)

  // Filtered flows
  const filteredFlows = flows.filter(f => {
    const matchesSearch = f.client_name.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    
    switch (filter) {
      case 'active': return f.status === 'published' && !f.is_template
      case 'completed': return f.status === 'completed'
      case 'templates': return f.is_template
      default: return true
    }
  })

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Flows</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {userPlan.plan === 'free' 
              ? `${userPlan.activeFlows} of ${userPlan.maxFlows} flows used`
              : `${clientFlows.length} flows`}
          </p>
        </div>
      </div>

      {/* Flows Section */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'all' 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'active' 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'completed' 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('templates')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'templates' 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                Templates
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-48 border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => canCreateFlow ? setShowNewModal(true) : window.location.href = '/dashboard/billing'}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Flow
              </button>
            </div>
          </div>
        </div>

        {/* Flow List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : filteredFlows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {flows.length === 0 ? 'No flows yet' : 'No matching flows'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              {flows.length === 0 
                ? 'Create your first onboarding flow to start guiding clients through your process.'
                : 'Try adjusting your search or filter.'}
            </p>
            {flows.length === 0 && (
              <button
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Create your first flow
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredFlows.map((flow) => (
              <FlowRow 
                key={flow.id} 
                flow={flow} 
                copiedId={copiedId}
                onCopy={copyLink}
                onDelete={deleteFlow}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 dark:border-neutral-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Flow</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set up onboarding for a client or create a reusable template.</p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Flow Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flow Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewFlow({ ...newFlow, is_template: false })}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      !newFlow.is_template 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium text-sm">Single Client</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">One-time use for a specific client</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFlow({ ...newFlow, is_template: true })}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      newFlow.is_template 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4" />
                      <span className="font-medium text-sm">Template</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reusable for multiple clients</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {newFlow.is_template ? 'Template Name' : 'Client Name'} *
                </label>
                <input
                  type="text"
                  value={newFlow.client_name}
                  onChange={(e) => setNewFlow({ ...newFlow, client_name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={newFlow.is_template ? "e.g., Standard Onboarding" : "e.g., Acme Corp"}
                  autoFocus
                />
              </div>

              {!newFlow.is_template && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Email</label>
                  <input
                    type="email"
                    value={newFlow.client_email}
                    onChange={(e) => setNewFlow({ ...newFlow, client_email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="client@company.com"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Welcome Message</label>
                <textarea
                  value={newFlow.welcome_message}
                  onChange={(e) => setNewFlow({ ...newFlow, welcome_message: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Welcome! Complete the steps below..."
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50 rounded-b-xl">
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={createFlow}
                disabled={!newFlow.client_name.trim() || creating}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Flow'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FlowRow({ flow, copiedId, onCopy, onDelete }: {
  flow: Flow
  copiedId: string | null
  onCopy: (slug: string, id: string) => void
  onDelete: (id: string) => void
}) {
  const progress = flow.total_steps > 0 ? (flow.completed_steps / flow.total_steps) * 100 : 0

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        flow.is_template 
          ? 'bg-purple-100 dark:bg-purple-900/30' 
          : flow.status === 'completed'
          ? 'bg-green-100 dark:bg-green-900/30'
          : 'bg-blue-100 dark:bg-blue-900/30'
      }`}>
        {flow.is_template ? (
          <Repeat className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        ) : flow.status === 'completed' ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
        ) : (
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {flow.client_name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link 
            href={`/dashboard/flows/${flow.id}`}
            className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
          >
            {flow.client_name}
          </Link>
          {flow.is_template && (
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded">
              Template
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          {flow.status === 'published' ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Globe className="w-3 h-3" /> Live
            </span>
          ) : flow.status === 'completed' ? (
            <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <Check className="w-3 h-3" /> Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <FileText className="w-3 h-3" /> Draft
            </span>
          )}
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400">{flow.total_steps} steps</span>
        </div>
      </div>

      {/* Progress (for active flows) */}
      {flow.status === 'published' && flow.total_steps > 0 && !flow.is_template && (
        <div className="hidden sm:block w-32">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">{flow.completed_steps}/{flow.total_steps}</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1">
        {flow.status === 'published' && (
          <>
            <button
              onClick={() => onCopy(flow.slug, flow.id)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              title="Copy link"
            >
              {copiedId === flow.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <a
              href={`/onboard/${flow.slug}`}
              target="_blank"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              title="Preview"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </>
        )}
        <Link
          href={`/dashboard/flows/${flow.id}`}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(flow.id)}
          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
