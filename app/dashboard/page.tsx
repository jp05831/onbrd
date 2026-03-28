'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, ExternalLink, Trash2, Copy, Check, Globe, FileText, Users, 
  Repeat, CheckCircle2, Search, Paperclip, X, Image, FileUp, Download, Link2
} from 'lucide-react'

interface Flow {
  id: string
  client_name: string
  slug: string
  status: 'draft' | 'published' | 'completed'
  is_template: boolean
  total_steps: number
  completed_steps: number
  uploaded_files_count: number
  created_at: string
}

interface UploadedFile {
  id: string
  title: string
  step_type: 'request_pdf' | 'request_photo'
  uploaded_file_id: string
  uploaded_file_name: string
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
  const [newFlowType, setNewFlowType] = useState<'client' | 'template' | 'from_template'>('client')
  const [newFlow, setNewFlow] = useState({ client_name: '', client_email: '', welcome_message: '', is_template: false })
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [useTemplateModal, setUseTemplateModal] = useState<{ flowId: string; flowName: string } | null>(null)
  const [templateClientName, setTemplateClientName] = useState('')
  const [templateClientEmail, setTemplateClientEmail] = useState('')
  const [cloningTemplate, setCloningTemplate] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'templates'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filesModal, setFilesModal] = useState<{ flowId: string; flowName: string } | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [publishedToast, setPublishedToast] = useState(false)

  const searchParams = useSearchParams()

  // Fire Meta Pixel Lead event for Google signups
  useEffect(() => {
    if (searchParams.get('signup') === '1') {
      if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Lead')
      }
      window.history.replaceState({}, '', '/dashboard')
    }
    if (searchParams.get('published') === '1') {
      setPublishedToast(true)
      const slug = searchParams.get('slug')
      window.history.replaceState({}, '', '/dashboard')
      setTimeout(() => setPublishedToast(false), 5000)
      if (slug) {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/onboard/${slug}`)
        } catch {}
      }
    }
  }, [searchParams])

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
      let res: Response
      if (newFlowType === 'from_template' && selectedTemplateId) {
        res = await fetch(`/api/flows/${selectedTemplateId}/clone`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_name: newFlow.client_name.trim(), client_email: newFlow.client_email || undefined }),
        })
      } else {
        res = await fetch('/api/flows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newFlow, is_template: newFlowType === 'template' }),
        })
      }
      if (res.ok) {
        const data = await res.json()
        setShowNewModal(false)
        setNewFlow({ client_name: '', client_email: '', welcome_message: '', is_template: false })
        setSelectedTemplateId('')
        setNewFlowType('client')
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

  const useTemplate = async () => {
    if (!useTemplateModal || !templateClientName.trim()) return
    setCloningTemplate(true)
    try {
      const res = await fetch(`/api/flows/${useTemplateModal.flowId}/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_name: templateClientName.trim(), client_email: templateClientEmail.trim() || undefined }),
      })
      if (res.ok) {
        const data = await res.json()
        setUseTemplateModal(null)
        setTemplateClientName('')
        setTemplateClientEmail('')
        window.location.href = `/dashboard/flows/${data.id}`
      }
    } catch (error) {
      console.error('Failed to clone template:', error)
    } finally {
      setCloningTemplate(false)
    }
  }

  const viewFiles = async (flowId: string) => {
    const flow = flows.find(f => f.id === flowId)
    if (!flow) return
    
    setFilesModal({ flowId, flowName: flow.client_name })
    setLoadingFiles(true)
    
    try {
      const res = await fetch(`/api/flows/${flowId}/uploads`)
      if (res.ok) {
        const data = await res.json()
        setUploadedFiles(data.uploads)
      }
    } catch (error) {
      console.error('Failed to fetch uploads:', error)
    } finally {
      setLoadingFiles(false)
    }
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
      {/* Published toast */}
      {publishedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-neutral-900 border border-green-500/30 rounded-xl shadow-2xl shadow-black/40 animate-in fade-in slide-in-from-top-2">
          <div className="w-7 h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Link2 className="w-3.5 h-3.5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Flow published! 🎉</p>
            <p className="text-xs text-gray-400">Portal link copied to clipboard</p>
          </div>
          <button onClick={() => setPublishedToast(false)} className="ml-2 text-gray-600 hover:text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Flows</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {userPlan.plan === 'free' 
              ? `${userPlan.activeFlows} of ${userPlan.maxFlows} flows used`
              : `${clientFlows.length} flows`}
          </p>
        </div>
      </div>

      {/* Flows Section */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl">
        {/* Toolbar */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex flex-col gap-3">
            {/* Row 1: filters + New Flow button */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                {(['all', 'active', 'completed', 'templates'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      filter === f
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { if (canCreateFlow) { setNewFlowType('client'); setNewFlow({ client_name: '', client_email: '', welcome_message: '', is_template: false }); setSelectedTemplateId(''); setShowNewModal(true) } else { window.location.href = '/dashboard/billing' } }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Flow</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
            {/* Row 2: search + export */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <a href="/api/flows/export" download className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0" title="Export CSV">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </a>
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
                onViewFiles={viewFiles}
                onUseTemplate={(id, name) => { setUseTemplateModal({ flowId: id, flowName: name }); setTemplateClientName(''); setTemplateClientEmail('') }}
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
              {/* Flow Type — 3 options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flow Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewFlowType('client')}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      newFlowType === 'client'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Users className="w-4 h-4 mb-1" />
                    <span className="font-medium text-xs block">Single Client</span>
                    <p className="text-xs text-gray-400 mt-0.5">One-time use</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFlowType('from_template')}
                    disabled={flows.filter(f => f.is_template).length === 0}
                    className={`p-3 border rounded-lg text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      newFlowType === 'from_template'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Repeat className="w-4 h-4 mb-1" />
                    <span className="font-medium text-xs block">From Template</span>
                    <p className="text-xs text-gray-400 mt-0.5">Use existing</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFlowType('template')}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      newFlowType === 'template'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <FileText className="w-4 h-4 mb-1" />
                    <span className="font-medium text-xs block">New Template</span>
                    <p className="text-xs text-gray-400 mt-0.5">Reusable base</p>
                  </button>
                </div>
                {newFlowType === 'from_template' && flows.filter(f => f.is_template).length === 0 && (
                  <p className="text-xs text-gray-400 mt-2">No templates yet — create one first.</p>
                )}
              </div>

              {/* Template picker */}
              {newFlowType === 'from_template' && flows.filter(f => f.is_template).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Choose Template *</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a template...</option>
                    {flows.filter(f => f.is_template).map(t => (
                      <option key={t.id} value={t.id}>{t.client_name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {newFlowType === 'template' ? 'Template Name' : 'Client Name'} *
                </label>
                <input
                  type="text"
                  value={newFlow.client_name}
                  onChange={(e) => setNewFlow({ ...newFlow, client_name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={newFlowType === 'template' ? 'e.g., Standard Onboarding' : 'e.g., Acme Corp'}
                  autoFocus
                />
              </div>

              {newFlowType !== 'template' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Email <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    type="email"
                    value={newFlow.client_email}
                    onChange={(e) => setNewFlow({ ...newFlow, client_email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="client@company.com"
                  />
                </div>
              )}

              {newFlowType !== 'from_template' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Welcome Message <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    value={newFlow.welcome_message}
                    onChange={(e) => setNewFlow({ ...newFlow, welcome_message: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Welcome! Complete the steps below..."
                  />
                </div>
              )}
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
                disabled={
                  !newFlow.client_name.trim() ||
                  (newFlowType === 'from_template' && !selectedTemplateId) ||
                  creating
                }
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Flow'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use Template Modal */}
      {useTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 dark:border-neutral-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Use Template</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Creates a fresh copy of <span className="font-medium text-gray-700 dark:text-gray-300">{useTemplateModal.flowName}</span> for a new client.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  value={templateClientName}
                  onChange={(e) => setTemplateClientName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && useTemplate()}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Acme Corp"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Email <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="email"
                  value={templateClientEmail}
                  onChange={(e) => setTemplateClientEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="client@company.com"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50 rounded-b-xl">
              <button
                onClick={() => { setUseTemplateModal(null); setTemplateClientName(''); setTemplateClientEmail('') }}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={useTemplate}
                disabled={!templateClientName.trim() || cloningTemplate}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {cloningTemplate ? 'Creating...' : 'Create Flow'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Files Modal */}
      {filesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Uploaded Files</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filesModal.flowName}</p>
              </div>
              <button
                onClick={() => { setFilesModal(null); setUploadedFiles([]); }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {loadingFiles ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : uploadedFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No files uploaded yet</div>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        file.step_type === 'request_photo' 
                          ? 'bg-blue-100 dark:bg-blue-900/30' 
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {file.step_type === 'request_photo' ? (
                          <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <FileUp className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{file.uploaded_file_name}</p>
                      </div>
                      <a
                        href={file.uploaded_file_id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50 rounded-b-xl">
              <button
                onClick={() => { setFilesModal(null); setUploadedFiles([]); }}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FlowRow({ flow, copiedId, onCopy, onDelete, onViewFiles, onUseTemplate }: {
  flow: Flow
  copiedId: string | null
  onCopy: (slug: string, id: string) => void
  onDelete: (id: string) => void
  onViewFiles: (flowId: string) => void
  onUseTemplate: (id: string, name: string) => void
}) {
  const progress = flow.total_steps > 0 ? (flow.completed_steps / flow.total_steps) * 100 : 0

  return (
    <div className="flex items-center gap-3 p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
      {/* Icon */}
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        flow.is_template 
          ? 'bg-purple-100 dark:bg-purple-900/30' 
          : flow.status === 'completed'
          ? 'bg-green-100 dark:bg-green-900/30'
          : 'bg-blue-100 dark:bg-blue-900/30'
      }`}>
        {flow.is_template ? (
          <Repeat className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
        ) : flow.status === 'completed' ? (
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
        ) : (
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {flow.client_name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
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
        <div className="flex items-center gap-2 mt-1 flex-wrap">
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
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">{flow.total_steps} steps</span>
          {flow.status === 'published' && flow.total_steps > 0 && !flow.is_template && (
            <>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{flow.completed_steps}/{flow.total_steps}</span>
              <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        {flow.uploaded_files_count > 0 && (
          <button
            onClick={() => onViewFiles(flow.id)}
            className="p-1.5 sm:p-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
            title="View uploaded files"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        )}
        {flow.is_template ? (
          <button
            onClick={() => onUseTemplate(flow.id, flow.client_name)}
            className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors border border-purple-200 dark:border-purple-800 whitespace-nowrap"
          >
            Use
          </button>
        ) : (
          flow.status === 'published' && (
            <>
              <button
                onClick={() => onCopy(flow.slug, flow.id)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                title="Copy link"
              >
                {copiedId === flow.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`/onboard/${flow.slug}`}
                target="_blank"
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                title="Preview"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </>
          )
        )}
        <Link
          href={`/dashboard/flows/${flow.id}`}
          className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(flow.id)}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
