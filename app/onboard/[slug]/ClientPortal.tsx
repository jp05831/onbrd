'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Lock, ArrowUpRight, Sparkles, FileText, Camera, FileUp, RotateCcw, ChevronRight, LayoutDashboard, LogOut } from 'lucide-react'
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
  due_date: string | null
}

interface ClientPortalProps {
  flow: {
    id: string
    slug: string
    client_name: string
    welcome_message: string | null
    completion_message: string | null
    accent_color: string | null
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
  clientAccount: { id: string; name: string; email: string } | null
}

export default function ClientPortal({ flow, steps: initialSteps, owner, clientAccount }: ClientPortalProps) {
  const router = useRouter()
  const [steps, setSteps] = useState(initialSteps)
  const [completing, setCompleting] = useState<string | null>(null)
  const [uncompleting, setUncompleting] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/client-auth/logout', { method: 'POST' })
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  const accent = flow.accent_color || '#2563eb'

  useEffect(() => {
    fetch('/api/onboard/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flowSlug: flow.slug }),
    }).catch(() => {})
  }, [])

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
      const res = await fetch('/api/onboard/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, flowSlug: flow.slug }),
      })
      if (res.ok) setSteps(prev => prev.map(s => s.id === stepId ? { ...s, completed: true } : s))
    } catch (e) { console.error(e) } finally { setCompleting(null) }
  }

  const uncompleteStep = async (stepId: string) => {
    setUncompleting(stepId)
    try {
      const res = await fetch('/api/onboard/uncomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, flowSlug: flow.slug }),
      })
      if (res.ok) setSteps(prev => prev.map(s => s.id === stepId ? { ...s, completed: false, uploaded_file_id: null, uploaded_file_name: null } : s))
    } catch (e) { console.error(e) } finally { setUncompleting(null) }
  }

  const handleFileUpload = async (stepId: string, file: File) => {
    setUploading(stepId)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('stepId', stepId)
      formData.append('flowSlug', flow.slug)
      const res = await fetch('/api/onboard/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setSteps(prev => prev.map(s => s.id === stepId ? { ...s, uploaded_file_id: data.url, uploaded_file_name: data.name, completed: true } : s))
      } else {
        const error = await res.json()
        alert(error.error || 'Upload failed')
      }
    } catch (e) { alert('Upload failed') } finally { setUploading(null) }
  }

  // ── Completion screen ───────────────────────────────────────────────────────
  if (allComplete) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        {/* Subtle radial glow using accent color */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(600px circle at 50% 40%, ${accent}, transparent)` }}
        />

        <div className="relative max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            {(flow.logo_url || owner.logo_url) ? (
              <img src={flow.logo_url || owner.logo_url!} alt="" className="h-16 object-contain" />
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent }}>
                <span className="text-white font-bold text-xl">{(owner.company_name || owner.name).charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
            {/* Check circle */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: accent }}
            >
              <Check className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>

            <h1 className="text-2xl font-semibold text-white mb-3">You&apos;re all done! 🎉</h1>

            <p className="text-gray-400 leading-relaxed mb-6">
              {flow.completion_message || `You've completed all ${steps.length} steps. ${owner.company_name || owner.name} will be in touch with you soon.`}
            </p>

            {/* Steps summary */}
            <div className="border border-neutral-800 rounded-xl p-4 mb-6 bg-neutral-950/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">All steps completed</span>
                <span className="text-xs font-medium text-white">{steps.length}/{steps.length}</span>
              </div>
              <div className="h-1.5 bg-neutral-800 rounded-full">
                <div className="h-full rounded-full w-full" style={{ backgroundColor: accent }} />
              </div>
              <div className="mt-3 space-y-1.5">
                {steps.map(step => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accent }}>
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-gray-400 text-left">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const lastCompleted = [...steps].reverse().find(s => s.completed)
                if (lastCompleted) uncompleteStep(lastCompleted.id)
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-300 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Undo last step
            </button>
          </div>

          {owner.plan === 'free' && (
            <div className="text-center mt-6">
              <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-gray-500 transition-colors">
                <Sparkles className="w-3 h-3" />
                Powered by Onbrd
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Main portal ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />

      {/* Client account bar */}
      {clientAccount ? (
        <div className="bg-neutral-900/80 border-b border-neutral-800/60 px-5 py-2">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-400">
              Logged in as <span className="text-gray-200 font-medium">{clientAccount.name}</span>
            </span>
            <div className="flex items-center gap-3">
              <a
                href="/client/dashboard"
                className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <LayoutDashboard className="w-3 h-3" />
                Dashboard
              </a>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                <LogOut className="w-3 h-3" />
                {loggingOut ? 'Signing out...' : 'Log out'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900/60 border-b border-neutral-800/40 px-5 py-2.5">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-500">Want to save your progress?</span>
            <div className="flex items-center gap-3">
              <a
                href={`/client/signup?flow=${flow.slug}`}
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Create account
              </a>
              <span className="text-gray-700">·</span>
              <a
                href={`/client/login?flow=${flow.slug}`}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                Log in
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          {(flow.logo_url || owner.logo_url) ? (
            <img src={flow.logo_url || owner.logo_url!} alt="" className="h-9 object-contain" />
          ) : (
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accent }}>
              <span className="text-white font-semibold text-sm">{(owner.company_name || owner.name).charAt(0)}</span>
            </div>
          )}
          <p className="font-semibold text-white text-sm">{owner.company_name || owner.name}</p>
        </div>

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Welcome, {flow.client_name} 👋
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {flow.welcome_message || 'Complete the steps below to get started. Click each step to open it, then mark it done.'}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-400">Your progress</span>
            <span className="font-semibold text-white">{completedCount} of {steps.length} done</span>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%`, backgroundColor: accent }}
            />
          </div>
          {completedCount > 0 && completedCount < steps.length && (
            <p className="text-xs text-gray-600 mt-2">{steps.length - completedCount} step{steps.length - completedCount > 1 ? 's' : ''} remaining</p>
          )}
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
                className={`rounded-xl border transition-all duration-200 ${
                  status === 'active'
                    ? 'border-neutral-700 bg-neutral-900'
                    : status === 'completed'
                    ? 'border-neutral-800/60 bg-neutral-900/40'
                    : 'border-neutral-800/40 bg-neutral-900/20 opacity-50'
                }`}
                style={status === 'active' ? { boxShadow: `0 0 0 1px ${accent}33, 0 0 20px ${accent}0d` } : undefined}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Step number / status icon */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                      style={
                        status === 'completed'
                          ? { backgroundColor: accent }
                          : status === 'active'
                          ? { border: `2px solid ${accent}`, backgroundColor: `${accent}15` }
                          : { border: '2px solid #404040' }
                      }
                    >
                      {status === 'completed' ? (
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      ) : status === 'locked' ? (
                        <Lock className="w-3 h-3 text-neutral-600" />
                      ) : (
                        <span className="text-xs font-bold" style={{ color: accent }}>{index + 1}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`font-medium text-sm ${status === 'locked' ? 'text-neutral-600' : 'text-white'}`}>
                          {step.title}
                        </p>
                        {status === 'completed' && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: `${accent}20`, color: accent }}>
                            Done
                          </span>
                        )}
                      </div>

                      {step.description && (
                        <p className={`text-xs mt-0.5 leading-relaxed ${status === 'locked' ? 'text-neutral-700' : 'text-gray-500'}`}>
                          {step.description}
                        </p>
                      )}

                      {step.due_date && status !== 'completed' && (
                        <p className="text-xs text-amber-400 mt-1 font-medium">
                          📅 Due {new Date(step.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}

                      {/* Active step actions */}
                      {status === 'active' && (
                        <div className="mt-3">
                          {!isUploadType && (
                            <div className="flex flex-wrap gap-2">
                              {step.file_id ? (
                                <a
                                  href={step.file_id.startsWith('http') ? step.file_id : `/api/files/${step.file_id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-white transition-opacity hover:opacity-90"
                                  style={{ backgroundColor: accent }}
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  View Document
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </a>
                              ) : step.url ? (
                                <a
                                  href={step.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-white transition-opacity hover:opacity-90"
                                  style={{ backgroundColor: accent }}
                                >
                                  Open
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              ) : null}
                              <button
                                onClick={() => completeStep(step.id)}
                                disabled={completing === step.id}
                                className="px-4 py-2 border border-neutral-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-neutral-800 hover:border-neutral-600 transition-colors disabled:opacity-50"
                              >
                                {completing === step.id ? 'Saving...' : 'Mark done ✓'}
                              </button>
                            </div>
                          )}

                          {isUploadType && (
                            <div>
                              <input
                                ref={el => { fileInputRefs.current[step.id] = el }}
                                type="file"
                                accept={stepType === 'request_photo' ? 'image/*' : '.pdf,application/pdf'}
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(step.id, f) }}
                                className="hidden"
                              />
                              <button
                                onClick={() => fileInputRefs.current[step.id]?.click()}
                                disabled={uploading === step.id}
                                className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: accent }}
                              >
                                {uploading === step.id ? 'Uploading...' : stepType === 'request_photo' ? (
                                  <><Camera className="w-4 h-4" />Upload Photo</>
                                ) : (
                                  <><FileUp className="w-4 h-4" />Upload PDF</>
                                )}
                              </button>
                              <p className="text-xs text-gray-600 mt-2">
                                {stepType === 'request_photo' ? 'JPG, PNG, or other image formats' : 'PDF files only'}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Completed state */}
                      {status === 'completed' && (
                        <div className="mt-2 flex items-center gap-3 flex-wrap">
                          {isUploadType && step.uploaded_file_name ? (
                            <p className="text-xs text-gray-500">↑ {step.uploaded_file_name}</p>
                          ) : null}
                          {step.expire_at && <ExpiryBadge expireAt={step.expire_at} />}
                          <button
                            onClick={() => uncompleteStep(step.id)}
                            disabled={uncompleting === step.id}
                            className="inline-flex items-center gap-1 text-xs text-neutral-700 hover:text-gray-400 transition-colors disabled:opacity-50"
                          >
                            <RotateCcw className="w-3 h-3" />
                            {uncompleting === step.id ? 'Undoing...' : 'Undo'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {owner.plan === 'free' && (
          <div className="text-center mt-12">
            <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-gray-500 transition-colors">
              <Sparkles className="w-3 h-3" />
              Powered by Onbrd
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
