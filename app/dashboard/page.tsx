'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, ExternalLink, Trash2, Copy, Check, Globe, FileText, Users, MoreHorizontal, Repeat } from 'lucide-react'

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

  const templates = flows.filter(f => f.is_template)
  const regularFlows = flows.filter(f => !f.is_template)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Flows</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {userPlan.plan === 'free' 
              ? `${userPlan.activeFlows} of ${userPlan.maxFlows} flows used`
              : 'Unlimited flows'}
          </p>
        </div>
        <button
          onClick={() => canCreateFlow ? setShowNewModal(true) : window.location.href = '/dashboard/billing'}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Flow
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading...</div>
        </div>
      ) : flows.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No flows yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Create your first onboarding flow to start guiding clients through your process.
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create your first flow
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Templates Section */}
          {templates.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Repeat className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Templates</h2>
              </div>
              <div className="grid gap-4">
                {templates.map((flow) => (
                  <FlowCard 
                    key={flow.id} 
                    flow={flow} 
                    copiedId={copiedId}
                    onCopy={copyLink}
                    onDelete={deleteFlow}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Flows */}
          {regularFlows.length > 0 && (
            <div>
              {templates.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Client Flows</h2>
                </div>
              )}
              <div className="grid gap-4">
                {regularFlows.map((flow) => (
                  <FlowCard 
                    key={flow.id} 
                    flow={flow} 
                    copiedId={copiedId}
                    onCopy={copyLink}
                    onDelete={deleteFlow}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
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
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
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
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
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
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="client@company.com"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Welcome Message</label>
                <textarea
                  value={newFlow.welcome_message}
                  onChange={(e) => setNewFlow({ ...newFlow, welcome_message: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Welcome! Complete the steps below..."
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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

function FlowCard({ flow, copiedId, onCopy, onDelete }: {
  flow: Flow
  copiedId: string | null
  onCopy: (slug: string, id: string) => void
  onDelete: (id: string) => void
}) {
  const progress = flow.total_steps > 0 ? (flow.completed_steps / flow.total_steps) * 100 : 0

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            flow.is_template ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
          }`}>
            {flow.is_template ? (
              <Repeat className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            ) : (
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {flow.client_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <Link 
              href={`/dashboard/flows/${flow.id}`}
              className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {flow.client_name}
            </Link>
            <div className="flex items-center gap-3 mt-1.5">
              {flow.status === 'published' ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <Globe className="w-3 h-3" /> Live
                </span>
              ) : flow.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                  <Check className="w-3 h-3" /> Completed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <FileText className="w-3 h-3" /> Draft
                </span>
              )}
              {flow.is_template && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  <Repeat className="w-3 h-3" /> Template
                </span>
              )}
              <span className="text-xs text-gray-400">{flow.total_steps} steps</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {flow.status === 'published' && (
            <>
              <button
                onClick={() => onCopy(flow.slug, flow.id)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy link"
              >
                {copiedId === flow.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`/onboard/${flow.slug}`}
                target="_blank"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Preview"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </>
          )}
          <Link
            href={`/dashboard/flows/${flow.id}`}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
      
      {/* Progress bar for published flows */}
      {flow.status === 'published' && flow.total_steps > 0 && !flow.is_template && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-500 dark:text-gray-400">Client Progress</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{flow.completed_steps}/{flow.total_steps} complete</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
