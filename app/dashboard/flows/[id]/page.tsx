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
  X
} from 'lucide-react'
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
  position: number
  completed: boolean
}

interface Flow {
  id: string
  client_name: string
  client_email: string | null
  welcome_message: string | null
  slug: string
  status: 'draft' | 'published' | 'completed'
}

function SortableStep({ step, index, onUpdate, onDelete, onFileUpload }: { 
  step: Step
  index: number
  onUpdate: (id: string, data: Partial<Step>) => void
  onDelete: (id: string) => void
  onFileUpload: (id: string, file: File) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const linkType = step.file_id ? 'file' : 'url'

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

  const switchToUrl = () => {
    onUpdate(step.id, { url: 'https://', file_id: null, file_name: null })
  }

  const switchToFile = () => {
    fileInputRef.current?.click()
  }

  const clearFile = () => {
    onUpdate(step.id, { url: 'https://', file_id: null, file_name: null })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg ${isDragging ? 'shadow-lg opacity-90' : ''}`}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-500">Step {index + 1}</span>
        <div className="flex-1" />
        <button
          onClick={() => onDelete(step.id)}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
          <input
            type="text"
            value={step.title}
            onChange={(e) => onUpdate(step.id, { title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Sign the contract"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description (optional)</label>
          <input
            type="text"
            value={step.description || ''}
            onChange={(e) => onUpdate(step.id, { description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief instructions"
          />
        </div>
        
        {/* Link Type Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Link to</label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={switchToUrl}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                linkType === 'url'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              URL
            </button>
            <button
              type="button"
              onClick={switchToFile}
              disabled={uploading}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                linkType === 'file'
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'PDF File'}
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {linkType === 'url' && !step.file_id && (
            <input
              type="url"
              value={step.url || ''}
              onChange={(e) => onUpdate(step.id, { url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://..."
            />
          )}
          
          {step.file_id && step.file_name && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
              <File className="w-4 h-4 text-red-500" />
              <span className="flex-1 text-sm text-gray-700 truncate">{step.file_name}</span>
              <button
                onClick={clearFile}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

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

  const addStep = async () => {
    const newStep: Step = {
      id: `temp-${Date.now()}`,
      title: '',
      description: null,
      url: 'https://',
      file_id: null,
      file_name: null,
      position: steps.length,
      completed: false,
    }
    setSteps([...steps, newStep])

    try {
      const res = await fetch(`/api/flows/${id}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Step',
          description: '',
          url: 'https://',
          position: steps.length,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSteps(prev => prev.map(s => s.id === newStep.id ? { ...s, id: data.id, title: 'New Step' } : s))
      }
    } catch (error) {
      console.error('Failed to add step:', error)
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
          url: null 
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
    const incompleteSteps = steps.filter(s => !s.title || (!s.url && !s.file_id))
    if (incompleteSteps.length > 0) return alert('Please fill in all step titles and provide a URL or file')

    setSaving(true)
    try {
      await fetch(`/api/flows/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })
      setFlow(prev => prev ? { ...prev, status: 'published' } : null)
    } catch (error) {
      console.error('Failed to publish:', error)
    } finally {
      setSaving(false)
    }
  }

  const copyLink = () => {
    if (!flow) return
    navigator.clipboard.writeText(`${window.location.origin}/onboard/${flow.slug}`)
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
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
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
              className="text-2xl font-semibold text-gray-900 bg-transparent border-none outline-none p-0 focus:ring-0"
            />
            <div className="flex items-center gap-2 mt-1">
              {flow.status === 'published' ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                  <Globe className="w-3 h-3" /> Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy link'}
                </button>
                <a
                  href={`/onboard/${flow.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  Preview
                </a>
              </>
            ) : (
              <button
                onClick={publishFlow}
                disabled={saving || steps.length === 0}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Client email (optional)</label>
            <input
              type="email"
              value={flow.client_email || ''}
              onChange={(e) => updateFlow({ client_email: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="client@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Welcome message (optional)</label>
            <textarea
              value={flow.welcome_message || ''}
              onChange={(e) => updateFlow({ welcome_message: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Welcome! Complete the steps below..."
            />
          </div>
          {flow.status === 'published' && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Portal URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/onboard/${flow.slug}`}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-mono text-gray-600"
                />
                <button
                  onClick={copyLink}
                  className="px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
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
        <h2 className="text-sm font-medium text-gray-900">Steps</h2>
        <button
          onClick={addStep}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add step
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No steps yet</p>
          <button
            onClick={addStep}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {steps.length > 0 && (
        <button
          onClick={addStep}
          className="w-full mt-3 py-3 border border-gray-200 border-dashed rounded-lg text-sm text-gray-500 hover:border-gray-300 hover:text-gray-600"
        >
          + Add another step
        </button>
      )}
    </div>
  )
}
