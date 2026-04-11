'use client'

import { useEffect, useState, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical, 
  Copy, 
  Check,
  ExternalLink,
  Globe,
  FileText,
  Upload,
  File,
  X,
  Camera,
  FileUp,
  Clock
} from 'lucide-react'
import ExpiryBadge from '../../../components/ExpiryBadge'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Step {
  id: string
  title: string
  description: string | null
  url: string | null
  file_id: string | null
  file_name: string | null
  step_type: 'link' | 'request_pdf' | 'request_photo'
  uploaded_file_id: string | null
  uploaded_file_name: string | null
  position: number
  completed: boolean
  expire_days: number | null
  expire_at: string | null
  due_date: string | null
}

interface Flow {
  id: string
  client_name: string
  client_email: string | null
  welcome_message: string | null
  completion_message: string | null
  accent_color: string | null
  logo_url: string | null
  slug: string
  status: 'draft' | 'published' | 'completed'
}

interface UserPlan {
  plan: 'free' | 'pro'
  maxStepsPerFlow: number
}

function SortableStep({ step, index, onUpdate, onDelete, onFileUpload, onSetExpiry, flowId }: { 
  step: Step
  index: number
  onUpdate: (id: string, data: Partial<Step>) => void
  onDelete: (id: string) => void
  onFileUpload: (id: string, file: File) => void
  onSetExpiry: (stepId: string, expireDays: number | null) => void
  flowId: string
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const stepType = step.step_type || 'link'
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const stepTypeOptions = [
    { value: 'link', label: 'URL Link', icon: ExternalLink, color: 'text-blue-500', desc: 'Send client to a link' },
    { value: 'pdf', label: 'Upload PDF', icon: Upload, color: 'text-orange-500', desc: 'Attach a PDF for client to view' },
    { value: 'request_pdf', label: 'Request PDF', icon: FileUp, color: 'text-purple-500', desc: 'Client uploads a PDF' },
    { value: 'request_photo', label: 'Request Photo', icon: Camera, color: 'text-pink-500', desc: 'Client uploads a photo' },
  ]

  const activeOption = step.file_id
    ? stepTypeOptions[1]
    : stepTypeOptions.find(o => o.value === stepType) ?? stepTypeOptions[0]

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      await onFileUpload(step.id, file)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const setStepType = (type: 'link' | 'request_pdf' | 'request_photo') => {
    if (type === 'link') {
      onUpdate(step.id, { step_type: type, url: '', file_id: null, file_name: null })
    } else {
      onUpdate(step.id, { step_type: type, url: null, file_id: null, file_name: null })
    }
  }

  const switchToFile = () => {
    fileInputRef.current?.click()
  }

  const clearFile = () => {
    onUpdate(step.id, { url: '', file_id: null, file_name: null })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg transition-colors ${isDragging ? 'shadow-lg opacity-90' : ''}`}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50 rounded-t-lg">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Step {index + 1}</span>
        <div className="flex-1" />
        <button
          onClick={() => onDelete(step.id)}
          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title</label>
          <input
            type="text"
            value={step.title}
            onChange={(e) => onUpdate(step.id, { title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="e.g., Sign the contract"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description (optional)</label>
          <input
            type="text"
            value={step.description || ''}
            onChange={(e) => onUpdate(step.id, { description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Brief instructions"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Due date (optional)</label>
          <input
            type="date"
            value={step.due_date || ''}
            onChange={(e) => onUpdate(step.id, { due_date: e.target.value || null })}
            className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        
        {/* Step Type Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Step Type</label>
          <div className="relative mb-2" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(o => !o)}
              className="w-full flex items-center gap-3 px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg text-sm text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-neutral-600 transition-colors"
            >
              <activeOption.icon className={`w-4 h-4 ${activeOption.color} flex-shrink-0`} />
              <span className="flex-1 text-left font-medium">{activeOption.label}</span>
              <span className="text-xs text-gray-400 hidden sm:block">{activeOption.desc}</span>
              <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden">
                {stepTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false)
                      if (opt.value === 'pdf') {
                        switchToFile()
                      } else {
                        setStepType(opt.value as 'link' | 'request_pdf' | 'request_photo')
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-left ${activeOption.value === opt.value ? 'bg-gray-50 dark:bg-neutral-700' : ''}`}
                  >
                    <opt.icon className={`w-4 h-4 ${opt.color} flex-shrink-0`} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{opt.label}</div>
                      <div className="text-xs text-gray-400">{opt.desc}</div>
                    </div>
                    {activeOption.value === opt.value && (
                      <Check className="w-4 h-4 text-blue-500 ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* URL input for link type */}
          {stepType === 'link' && !step.file_id && (
            <input
              type="url"
              value={step.url || ''}
              onChange={(e) => onUpdate(step.id, { url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="https://..."
            />
          )}
          
          {/* File display */}
          {step.file_id && step.file_name && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md">
              <File className="w-4 h-4 text-red-500" />
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{step.file_name}</span>
              <button
                onClick={clearFile}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Request type info + expiry */}
          {stepType === 'request_pdf' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md">
                <FileUp className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-purple-700 dark:text-purple-300">Client will upload a PDF document</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">Auto-delete uploaded file:</span>
                <select
                  value={step.expire_days ?? 'never'}
                  onChange={(e) => {
                    const val = e.target.value
                    onSetExpiry(step.id, val === 'never' ? null : parseInt(val))
                  }}
                  className="flex-1 text-xs bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-none outline-none cursor-pointer rounded"
                >
                  <option value="never">Never</option>
                  <option value="7">After 7 days</option>
                  <option value="30">After 30 days</option>
                </select>
                {step.expire_at && <ExpiryBadge expireAt={step.expire_at} />}
              </div>
            </div>
          )}

          {stepType === 'request_photo' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md">
                <Camera className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-purple-700 dark:text-purple-300">Client will upload a photo</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">Auto-delete uploaded file:</span>
                <select
                  value={step.expire_days ?? 'never'}
                  onChange={(e) => {
                    const val = e.target.value
                    onSetExpiry(step.id, val === 'never' ? null : parseInt(val))
                  }}
                  className="flex-1 text-xs bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-none outline-none cursor-pointer rounded"
                >
                  <option value="never">Never</option>
                  <option value="7">After 7 days</option>
                  <option value="30">After 30 days</option>
                </select>
                {step.expire_at && <ExpiryBadge expireAt={step.expire_at} />}
              </div>
            </div>
          )}

          {/* Show uploaded file if client has submitted */}
          {(stepType === 'request_pdf' || stepType === 'request_photo') && step.uploaded_file_name && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md mt-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="flex-1 text-sm text-green-700 dark:text-green-300 truncate">
                Uploaded: {step.uploaded_file_name}
              </span>
              {step.uploaded_file_id && (
                <a
                  href={step.uploaded_file_id}
                  target="_blank"
                  className="text-xs text-green-600 dark:text-green-400 hover:underline"
                >
                  View
                </a>
              )}
            </div>
          )}


        </div>
      </div>
    </div>
  )
}

export default function FlowEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [flow, setFlow] = useState<Flow | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  const [userPlan, setUserPlan] = useState<UserPlan>({ plan: 'free', maxStepsPerFlow: 2 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [activity, setActivity] = useState<{ id: string; event: string; detail: string | null; created_at: string }[]>([])
  const logoInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    fetchFlow()
  }, [id])

  const fetchFlow = async () => {
    try {
      const res = await fetch(`/api/flows/${id}`)
      if (res.ok) {
        const data = await res.json()
        setFlow(data.flow)
        setSteps(data.steps)
        if (data.userPlan) {
          setUserPlan(data.userPlan)
        }
        const actRes = await fetch(`/api/flows/${id}/activity`)
        if (actRes.ok) { const actData = await actRes.json(); setActivity(actData.activity || []) }
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to fetch flow:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFlow = async (data: Partial<Flow>) => {
    if (!flow) return
    setFlow({ ...flow, ...data })
    try {
      await fetch(`/api/flows/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Failed to update flow:', error)
    }
  }

  const canAddStep = userPlan.plan === 'pro' || steps.length < userPlan.maxStepsPerFlow

  const addStep = async () => {
    if (!canAddStep) {
      router.push('/dashboard/billing')
      return
    }

    const newStep: Step = {
      id: `temp-${Date.now()}`,
      title: '',
      description: null,
      url: '',
      file_id: null,
      file_name: null,
      step_type: 'link',
      uploaded_file_id: null,
      uploaded_file_name: null,
      position: steps.length,
      completed: false,
      expire_days: null,
      expire_at: null,
      due_date: null,
    }
    setSteps([...steps, newStep])

    try {
      const res = await fetch(`/api/flows/${id}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Step',
          description: '',
          url: '',
          step_type: 'link',
          position: steps.length,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSteps(prev => prev.map(s => s.id === newStep.id ? { ...s, id: data.id, title: 'New Step' } : s))
      } else {
        const error = await res.json()
        setSteps(prev => prev.filter(s => s.id !== newStep.id))
        alert(error.error || 'Failed to add step')
      }
    } catch (error) {
      console.error('Failed to add step:', error)
      setSteps(prev => prev.filter(s => s.id !== newStep.id))
    }
  }

  const updateStep = async (stepId: string, data: Partial<Step>) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, ...data } : s))
    if (stepId.startsWith('temp-')) return
    try {
      await fetch(`/api/flows/${id}/steps/${stepId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Failed to update step:', error)
    }
  }

  const handleFileUpload = async (stepId: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        updateStep(stepId, { 
          file_id: data.url || data.id, 
          file_name: data.name,
          url: null,
          step_type: 'link'
        })
      } else {
        const error = await res.json()
        alert(error.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed')
    }
  }

  const setStepExpiry = async (stepId: string, expireDays: number | null) => {
    try {
      const res = await fetch(`/api/flows/${id}/steps/${stepId}/expire`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expire_days: expireDays }),
      })
      if (res.ok) {
        const data = await res.json()
        setSteps(prev => prev.map(s =>
          s.id === stepId
            ? { ...s, expire_days: data.expire_days, expire_at: data.expire_at }
            : s
        ))
      }
    } catch (error) {
      console.error('Failed to set expiry:', error)
    }
  }

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        await updateFlow({ logo_url: data.url || `/api/files/${data.id}` })
      } else {
        const error = await res.json()
        alert(error.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Logo upload failed:', error)
      alert('Logo upload failed')
    } finally {
      setUploadingLogo(false)
      if (logoInputRef.current) {
        logoInputRef.current.value = ''
      }
    }
  }

  const removeLogo = async () => {
    await updateFlow({ logo_url: null })
  }

  const deleteStep = async (stepId: string) => {
    setSteps(prev => prev.filter(s => s.id !== stepId))
    if (stepId.startsWith('temp-')) return
    try {
      await fetch(`/api/flows/${id}/steps/${stepId}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to delete step:', error)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex(s => s.id === active.id)
      const newIndex = steps.findIndex(s => s.id === over.id)
      const newSteps = arrayMove(steps, oldIndex, newIndex)
      setSteps(newSteps)
      try {
        await fetch(`/api/flows/${id}/reorder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepIds: newSteps.map(s => s.id) }),
        })
      } catch (error) {
        console.error('Failed to reorder steps:', error)
      }
    }
  }

  const publishFlow = async () => {
    if (steps.length === 0) return alert('Add at least one step before publishing')
    const incompleteSteps = steps.filter(s => {
      if (s.step_type === 'request_pdf' || s.step_type === 'request_photo') {
        return !s.title
      }
      return !s.title || (!s.url && !s.file_id)
    })
    if (incompleteSteps.length > 0) return alert('Please fill in all step titles and provide content where required')

    setSaving(true)
    try {
      // Fetch fresh flow data to get the definitive slug from DB
      const freshRes = await fetch(`/api/flows/${id}`)
      const freshData = await freshRes.json()
      const freshSlug = freshData?.flow?.slug

      await fetch(`/api/flows/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })
      setFlow(prev => prev ? { ...prev, status: 'published' } : null)
      if (freshSlug) {
        const origin = 'https://www.onbrd.net'
        sessionStorage.setItem('publishedSlug', `${origin}/onboard/${freshSlug}`)
      }
      router.push('/dashboard?published=1')
    } catch (error) {
      console.error('Failed to publish:', error)
    } finally {
      setSaving(false)
    }
  }

  const copyLink = () => {
    if (!flow) return
    const origin = window.location.origin.includes('localhost') ? window.location.origin : 'https://www.onbrd.net'
    navigator.clipboard.writeText(`${origin}/onboard/${flow.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!flow) return null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to flows
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <input
              type="text"
              value={flow.client_name}
              onChange={(e) => updateFlow({ client_name: e.target.value })}
              className="text-2xl font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none p-0 focus:ring-0"
            />
            <div className="flex items-center gap-2 mt-1">
              {flow.status === 'published' ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                  <Globe className="w-3 h-3" /> Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <FileText className="w-3 h-3" /> Draft
                </span>
              )}
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">{steps.length} steps</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {flow.status === 'published' ? (
              <>
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-neutral-700 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy link'}
                </button>
                <a
                  href={`/onboard/${flow.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-neutral-700 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Preview
                </a>
              </>
            ) : (
              <button
                onClick={publishFlow}
                disabled={saving || steps.length === 0}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-4 mb-6 transition-colors">
        <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Settings</h2>
        <div className="space-y-4">
          {/* Logo upload */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Portal logo (optional)</label>
            {flow.logo_url ? (
              <div className="flex items-center gap-3">
                <img src={flow.logo_url} alt="Logo" className="h-12 w-auto max-w-[120px] object-contain rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 p-1" />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                  >
                    {uploadingLogo ? 'Uploading...' : 'Change photo'}
                  </button>
                  <button onClick={removeLogo} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 dark:border-neutral-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                {uploadingLogo ? 'Uploading...' : 'Upload photo / logo'}
              </button>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f) }}
            />
            <p className="text-xs text-gray-400 mt-1">Shown at the top of your client portal</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Portal accent color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={flow.accent_color || '#2563eb'}
                onChange={(e) => updateFlow({ accent_color: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-200 dark:border-neutral-700 cursor-pointer bg-transparent p-0.5"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">{flow.accent_color || '#2563eb'}</span>
              <button onClick={() => updateFlow({ accent_color: '#2563eb' })} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Reset</button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Used for buttons and progress bar in your client portal</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Client email (optional)</label>
            <input
              type="email"
              value={flow.client_email || ''}
              onChange={(e) => updateFlow({ client_email: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="client@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Welcome message (optional)</label>
            <textarea
              value={flow.welcome_message || ''}
              onChange={(e) => updateFlow({ welcome_message: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              rows={2}
              placeholder="Welcome! Complete the steps below..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Completion message (optional)</label>
            <textarea
              value={flow.completion_message || ''}
              onChange={(e) => updateFlow({ completion_message: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              rows={2}
              placeholder="You're all set! We'll be in touch within 24 hours..."
            />
            <p className="text-xs text-gray-400 mt-1">Shown to clients after they complete all steps</p>
          </div>
          {flow.status === 'published' && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Portal URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${typeof window !== 'undefined' ? (window.location.origin.includes('localhost') ? window.location.origin : 'https://www.onbrd.net') : 'https://www.onbrd.net'}/onboard/${flow.slug}`}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md text-sm font-mono text-gray-600 dark:text-gray-300 transition-colors"
                />
                <button
                  onClick={copyLink}
                  className="px-3 py-2 border border-gray-200 dark:border-neutral-700 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">Steps</h2>
          {userPlan.plan === 'free' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {steps.length} of {userPlan.maxStepsPerFlow} steps used
            </p>
          )}
        </div>
        <button
          onClick={addStep}
          className={`inline-flex items-center gap-1 text-sm font-medium ${
            canAddStep 
              ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' 
              : 'text-gray-400 hover:text-gray-500'
          }`}
        >
          <Plus className="w-4 h-4" />
          {canAddStep ? 'Add step' : 'Upgrade for more'}
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 border-dashed rounded-lg p-8 text-center transition-colors">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No steps yet</p>
          <button
            onClick={addStep}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add first step
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <SortableStep
                  key={step.id}
                  step={step}
                  index={index}
                  onUpdate={updateStep}
                  onDelete={deleteStep}
                  onFileUpload={handleFileUpload}
                  onSetExpiry={setStepExpiry}
                  flowId={id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {steps.length > 0 && canAddStep && (
        <button
          onClick={addStep}
          className="w-full mt-3 py-3 border border-gray-200 dark:border-neutral-700 border-dashed rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          + Add another step
        </button>
      )}

      {steps.length > 0 && !canAddStep && (
        <div className="w-full mt-3 py-4 px-4 border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-center transition-colors">
          <p className="text-sm text-orange-700 dark:text-orange-400 mb-2">Free plan limit: {userPlan.maxStepsPerFlow} steps per flow</p>
          <button
            onClick={() => router.push('/dashboard/billing')}
            className="text-sm font-medium text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 underline"
          >
            Upgrade to Pro for unlimited steps →
          </button>
        </div>
      )}

      {/* Activity */}
      <div className="mt-8">
        <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Activity</h2>
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg divide-y divide-gray-100 dark:divide-neutral-800">
          {activity.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No activity yet — share the portal link to get started.</div>
          ) : (
            activity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.event === 'step_completed' || item.event === 'file_uploaded' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {item.event === 'step_completed' && `Completed: ${item.detail}`}
                    {item.event === 'file_uploaded' && `Uploaded file for: ${item.detail}`}
                    {item.event === 'portal_opened' && 'Client opened the portal'}
                    {!['step_completed','file_uploaded','portal_opened'].includes(item.event) && item.event}
                  </p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

