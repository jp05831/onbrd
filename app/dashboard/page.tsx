'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, ExternalLink, Trash2, Copy, Check, Globe, FileText } from 'lucide-react'

interface Flow {
  id: string
  client_name: string
  slug: string
  status: 'draft' | 'published' | 'completed'
  total_steps: number
  completed_steps: number
  created_at: string
}

interface UserPlan {
  plan: 'free' | 'pro'
  activeFlows: number
  maxFlows: number
}

export default function DashboardPage() {
  const [flows, setFlows] = useState<Flow[]>([])
  const [userPlan, setUserPlan] = useState<UserPlan>({ plan: 'free', activeFlows: 0, maxFlows: 3 })
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [newFlow, setNewFlow] = useState({ client_name: '', client_email: '', welcome_message: '' })
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
        setNewFlow({ client_name: '', client_email: '', welcome_message: '' })
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Flows</h1>
          <p className="text-sm text-gray-500 mt-1">
            {userPlan.plan === 'free' 
              ? `${userPlan.activeFlows}/${userPlan.maxFlows} flows`
              : 'Unlimited flows'}
          </p>
        </div>
        <button
          onClick={() => canCreateFlow ? setShowNewModal(true) : window.location.href = '/dashboard/billing'}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New flow
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : flows.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">No flows yet</p>
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create your first flow
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {flows.map((flow) => (
            <div key={flow.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="font-semibold text-gray-600">
                      {flow.client_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Link 
                      href={`/dashboard/flows/${flow.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {flow.client_name}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      {flow.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                          <Globe className="w-3 h-3" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <FileText className="w-3 h-3" /> Draft
                        </span>
                      )}
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{flow.total_steps} steps</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {flow.status === 'published' && (
                    <>
                      <button
                        onClick={() => copyLink(flow.slug, flow.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md"
                        title="Copy link"
                      >
                        {copiedId === flow.id ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={`/onboard/${flow.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md"
                        title="Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </>
                  )}
                  <Link
                    href={`/dashboard/flows/${flow.id}`}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteFlow(flow.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {flow.status === 'published' && flow.total_steps > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-gray-600">{flow.completed_steps}/{flow.total_steps}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(flow.completed_steps / flow.total_steps) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">New flow</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client name *</label>
                <input
                  type="text"
                  value={newFlow.client_name}
                  onChange={(e) => setNewFlow({ ...newFlow, client_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Corp"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client email</label>
                <input
                  type="email"
                  value={newFlow.client_email}
                  onChange={(e) => setNewFlow({ ...newFlow, client_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="client@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Welcome message</label>
                <textarea
                  value={newFlow.welcome_message}
                  onChange={(e) => setNewFlow({ ...newFlow, welcome_message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Welcome! Complete the steps below..."
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={createFlow}
                disabled={!newFlow.client_name.trim() || creating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
