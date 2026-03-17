'use client'

import { useState, useRef } from 'react'
import { Check, Lock, ArrowUpRight, Sparkles, FileText, Upload, Camera, FileUp, RotateCcw } from 'lucide-react'
import ExpiryBadge from '../../components/ExpiryBadge'

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
  expire_at: string | null
}

interface ClientPortalProps {
  flow: {
    id: string
    client_name: string
    welcome_message: string | null
    logo_url: string | null
    status: string
  }
  steps: Step[]
  owner: {
    name: string
    company_name: string | null
    logo_url: string | null
    plan: string
  }
}

export default function ClientPortal({ flow, steps: initialSteps, owner }: ClientPortalProps) {
  const [steps, setSteps] = useState(initialSteps)
  const [completing, setCompleting] = useState<string | null>(null)
  const [uncompleting, setUncompleting] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const completedCount = steps.filter(s => s.completed).length
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0
  const allComplete = completedCount === steps.length && steps.length > 0

  const getStepStatus = (step: Step, index: number) => {
    if (step.completed) return 'completed'
    const firstUncompletedIndex = steps.findIndex(s => !s.completed)
    if (index === firstUncompletedIndex) return 'active'
    return 'locked'
  }

  const completeStep = async (stepId: string) => {
    setCompleting(stepId)
    try {
      const res = await fetch(`/api/onboard/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId }),
      })
      if (res.ok) {
        setSteps(prev => prev.map(s => 
          s.id === stepId ? { ...s, completed: true } : s
        ))
      }
    } catch (error) {
      console.error('Failed to complete step:', error)
    } finally {
      setCompleting(null)
    }
  }

  const uncompleteStep = async (stepId: string) => {
    setUncompleting(stepId)
    try {
      const res = await fetch(`/api/onboard/uncomplete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId }),
      })
      if (res.ok) {
        setSteps(prev => prev.map(s => 
          s.id === stepId ? { ...s, completed: false, uploaded_file_id: null, uploaded_file_name: null } : s
        ))
      }
    } catch (error) {
      console.error('Failed to uncomplete step:', error)
    } finally {
      setUncompleting(null)
    }
  }

  const handleFileUpload = async (stepId: string, file: File) => {
    setUploading(stepId)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('stepId', stepId)

      const res = await fetch('/api/onboard/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setSteps(prev => prev.map(s => 
          s.id === stepId 
            ? { ...s, uploaded_file_id: data.url, uploaded_file_name: data.name, completed: true } 
            : s
        ))
      } else {
        const error = await res.json()
        alert(error.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed')
    } finally {
      setUploading(null)
    }
  }

  const triggerFileInput = (stepId: string) => {
    fileInputRefs.current[stepId]?.click()
  }

  if (allComplete) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">All done!</h1>
          <p className="text-gray-400 mb-8">
            You&apos;ve completed all steps. {owner.company_name || owner.name} will be in touch.
          </p>
          <p className="text-sm text-gray-600">{steps.length} steps completed</p>
          
          {/* Undo last step */}
          <button
            onClick={() => {
              const lastCompleted = [...steps].reverse().find(s => s.completed)
              if (lastCompleted) uncompleteStep(lastCompleted.id)
            }}
            className="inline-flex items-center gap-1.5 mt-6 px-4 py-2 text-sm text-gray-500 hover:text-gray-300 border border-neutral-800 rounded-lg hover:bg-neutral-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Undo last step
          </button>
          
          {owner.plan === 'free' && (
            <div className="mt-12">
              <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-500">
                <Sparkles className="w-3 h-3" />
                Powered by Onbrd
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          {(flow.logo_url || owner.logo_url) ? (
            <img src={flow.logo_url || owner.logo_url!} alt="" className="h-10 object-contain" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">
                {(owner.company_name || owner.name).charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-white">{owner.company_name || owner.name}</p>
            <p className="text-sm text-gray-500">Client Onboarding</p>
          </div>
        </div>

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-white mb-1">
            Welcome, {flow.client_name}
          </h1>
          <p className="text-gray-400">
            {flow.welcome_message || 'Complete the steps below to get started.'}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-white">{completedCount}/{steps.length}</span>
          </div>
          <div className="h-1.5 bg-neutral-800 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index)
            const stepType = step.step_type || 'link'
            const isUploadType = stepType === 'request_pdf' || stepType === 'request_photo'
            
            return (
              <div
                key={step.id}
                className={`bg-neutral-900 border rounded-xl p-4 transition-all ${
                  status === 'active' 
                    ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-600/5' 
                    : status === 'completed'
                    ? 'border-neutral-800'
                    : 'border-neutral-800 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    status === 'completed'
                      ? 'bg-blue-600'
                      : status === 'active'
                      ? 'border-2 border-blue-500'
                      : 'border-2 border-neutral-600'
                  }`}>
                    {status === 'completed' ? (
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    ) : status === 'locked' ? (
                      <Lock className="w-3 h-3 text-neutral-500" />
                    ) : (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${status === 'locked' ? 'text-neutral-600' : 'text-white'}`}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className={`text-sm mt-0.5 ${status === 'locked' ? 'text-neutral-700' : 'text-gray-500'}`}>
                        {step.description}
                      </p>
                    )}

                    {status === 'active' && (
                      <div className="mt-3">
                        {/* Link/File step types */}
                        {!isUploadType && (
                          <div className="flex gap-2">
                            {step.file_id ? (
                              <a
                                href={step.file_id.startsWith('http') ? step.file_id : `/api/files/${step.file_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                View PDF
                              </a>
                            ) : step.url ? (
                              <a
                                href={step.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                              >
                                Open
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            ) : null}
                            <button
                              onClick={() => completeStep(step.id)}
                              disabled={completing === step.id}
                              className="px-3 py-1.5 border border-neutral-700 text-gray-300 text-sm font-medium rounded-md hover:bg-neutral-800 hover:border-neutral-600 transition-colors disabled:opacity-50"
                            >
                              {completing === step.id ? 'Saving...' : 'Mark done'}
                            </button>
                          </div>
                        )}

                        {/* Upload step types */}
                        {isUploadType && (
                          <div>
                            <input
                              ref={el => { fileInputRefs.current[step.id] = el }}
                              type="file"
                              accept={stepType === 'request_photo' ? 'image/*' : '.pdf,application/pdf'}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(step.id, file)
                              }}
                              className="hidden"
                            />
                            <button
                              onClick={() => triggerFileInput(step.id)}
                              disabled={uploading === step.id}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              {uploading === step.id ? (
                                'Uploading...'
                              ) : stepType === 'request_photo' ? (
                                <>
                                  <Camera className="w-4 h-4" />
                                  Upload Photo
                                </>
                              ) : (
                                <>
                                  <FileUp className="w-4 h-4" />
                                  Upload PDF
                                </>
                              )}
                            </button>
                            <p className="text-xs text-gray-600 mt-2">
                              {stepType === 'request_photo' 
                                ? 'Accepts JPG, PNG, or other image formats'
                                : 'Accepts PDF files only'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {status === 'completed' && (
                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        {isUploadType && step.uploaded_file_name ? (
                          <p className="text-sm text-blue-400">
                            ✓ Uploaded: {step.uploaded_file_name}
                          </p>
                        ) : (
                          <p className="text-sm text-blue-400">Completed</p>
                        )}
                        {step.expire_at && (
                          <ExpiryBadge expireAt={step.expire_at} />
                        )}
                        <button
                          onClick={() => uncompleteStep(step.id)}
                          disabled={uncompleting === step.id}
                          className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-50"
                          title="Mark as not done"
                        >
                          <RotateCcw className="w-3 h-3" />
                          {uncompleting === step.id ? 'Undoing...' : 'Undo'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {owner.plan === 'free' && (
          <div className="text-center mt-12">
            <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-500">
              <Sparkles className="w-3 h-3" />
              Powered by Onbrd
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
