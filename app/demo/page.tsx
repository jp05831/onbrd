'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  ArrowRight, Check, Lock, Plus, Trash2, GripVertical,
  ExternalLink, FileUp, Camera, X, Globe, FileText, Upload,
  ShieldCheck, Sparkles
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type StepType = 'link' | 'request_pdf' | 'request_photo'

interface Step {
  id: string
  title: string
  description: string
  url: string
  step_type: StepType
}

interface FlowState {
  client_name: string
  welcome_message: string
  steps: Step[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function trackFbq(event: string, params?: object) {
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', event, params)
  }
}

// ─── Publish Modal ────────────────────────────────────────────────────────────

function PublishModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-7">
          <button onClick={onClose} className="absolute top-5 right-5 p-1 text-gray-600 hover:text-gray-300 transition-colors">
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-xl font-semibold text-white mb-2">Ready to share this with your client?</h2>
          <p className="text-sm text-gray-400 mb-7 leading-relaxed">
            Create a free account to publish your flow and get a shareable link. You've built something great — now send it.
          </p>

          <ul className="space-y-2.5 mb-7">
            {[
              'Unlimited flows & steps',
              'Unlimited clients — no per-seat fees',
              'Collect PDFs and photos from clients',
              'Email notifications on completion',
              'White-label — remove Onbrd branding',
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="bg-neutral-800 rounded-xl p-4 mb-6 text-center">
            <p className="text-white">
              <span className="text-2xl font-bold">$15</span>
              <span className="text-gray-400 text-sm">/mo</span>
              <span className="text-gray-500 text-sm mx-2">or</span>
              <span className="text-blue-400 font-semibold">$12.50/mo</span>
              <span className="text-gray-500 text-sm"> billed annually</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">7-day money-back guarantee · Cancel anytime</p>
          </div>

          <a
            href="/signup"
            onClick={() => trackFbq('InitiateCheckout')}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Get Onbrd Pro
            <ArrowRight className="w-4 h-4" />
          </a>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
            <p className="text-xs text-gray-600">7-day money-back guarantee · Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Builder Step Card ────────────────────────────────────────────────────────

function BuilderStep({
  step,
  index,
  onUpdate,
  onDelete,
}: {
  step: Step
  index: number
  onUpdate: (id: string, data: Partial<Step>) => void
  onDelete: (id: string) => void
}) {
  const isProType = step.step_type === 'request_pdf' || step.step_type === 'request_photo'

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-neutral-950/50 rounded-t-lg">
        <button className="p-1 text-gray-600 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-500">Step {index + 1}</span>
        {isProType && (
          <span className="text-[10px] font-semibold text-purple-400 bg-purple-900/40 border border-purple-800/60 px-1.5 py-0.5 rounded">
            PRO
          </span>
        )}
        <div className="flex-1" />
        <button
          onClick={() => onDelete(step.id)}
          className="p-1 text-gray-600 hover:text-red-400 transition-colors"
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
            onChange={e => onUpdate(step.id, { title: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Sign the contract"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description (optional)</label>
          <input
            type="text"
            value={step.description}
            onChange={e => onUpdate(step.id, { description: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief instructions for your client"
          />
        </div>

        {/* Step type */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Step type</label>
          <div className="grid grid-cols-4 gap-2">
            {([
              { type: 'link' as StepType, label: 'URL', icon: ExternalLink, pro: false },
              { type: 'link' as StepType, label: 'PDF', icon: Upload, pro: false },
              { type: 'request_pdf' as StepType, label: 'Request PDF', icon: FileUp, pro: true },
              { type: 'request_photo' as StepType, label: 'Request Photo', icon: Camera, pro: true },
            ] as { type: StepType; label: string; icon: any; pro: boolean }[]).map((opt, i) => {
              const active = i === 0
                ? step.step_type === 'link'
                : i === 1
                ? false // PDF upload (non-functional in demo, acts as link)
                : step.step_type === opt.type

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onUpdate(step.id, { step_type: opt.type })}
                  className={`relative flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium rounded-md border transition-colors ${
                    active
                      ? opt.pro
                        ? 'border-purple-600 bg-purple-900/30 text-purple-400'
                        : 'border-blue-600 bg-blue-900/30 text-blue-400'
                      : 'border-neutral-700 text-gray-400 hover:bg-neutral-800'
                  }`}
                >
                  <opt.icon className="w-4 h-4" />
                  <span className="leading-tight text-center">{opt.label}</span>
                  {opt.pro && (
                    <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold bg-purple-600 text-white px-1 py-0.5 rounded leading-none">
                      PRO
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {step.step_type === 'link' && (
            <input
              type="url"
              value={step.url}
              onChange={e => onUpdate(step.id, { url: e.target.value })}
              className="mt-2 w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          )}

          {step.step_type === 'request_pdf' && (
            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-purple-900/20 border border-purple-800/50 rounded-md">
              <FileUp className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-sm text-purple-300">Client will upload a PDF document</span>
            </div>
          )}

          {step.step_type === 'request_photo' && (
            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-purple-900/20 border border-purple-800/50 rounded-md">
              <Camera className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-sm text-purple-300">Client will upload a photo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Client Preview Panel ─────────────────────────────────────────────────────

function PreviewPanel({
  flow,
  completedIds,
  onComplete,
  onShowPublish,
}: {
  flow: FlowState
  completedIds: Set<string>
  onComplete: (id: string) => void
  onShowPublish: () => void
}) {
  const allDone = flow.steps.length > 0 && flow.steps.every(s => completedIds.has(s.id))
  const completedCount = flow.steps.filter(s => completedIds.has(s.id)).length
  const progress = flow.steps.length > 0 ? (completedCount / flow.steps.length) * 100 : 0

  const getStatus = (step: Step) => {
    if (completedIds.has(step.id)) return 'completed'
    const firstUncompleted = flow.steps.find(s => !completedIds.has(s.id))
    if (firstUncompleted?.id === step.id) return 'active'
    return 'locked'
  }

  if (allDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-6 py-16">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">All done!</h2>
        <p className="text-gray-400 mb-10 max-w-xs">
          You've completed all steps. This is what your client would see after finishing.
        </p>

        <div className="bg-neutral-900 border border-blue-600/40 rounded-2xl p-6 max-w-sm w-full mb-6">
          <p className="text-sm font-medium text-white mb-1">Ready to do this for real?</p>
          <p className="text-sm text-gray-400 mb-5">Publish your flow and send the link to your actual clients.</p>
          <button
            onClick={() => onShowPublish()}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Publish this flow
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => onComplete('reset')}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Reset demo
        </button>

        <div className="mt-10">
          <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-gray-500">
            <Sparkles className="w-3 h-3" />
            Powered by Onbrd
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-10 max-w-xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {(flow.client_name || 'A').charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-white">{flow.client_name || 'Your Client'}</p>
          <p className="text-sm text-gray-500">Client Onboarding</p>
        </div>
      </div>

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white mb-1">Welcome, {flow.client_name || 'there'}</h1>
        <p className="text-gray-400">
          {flow.welcome_message || 'Complete the steps below to get started.'}
        </p>
      </div>

      {/* Progress */}
      {flow.steps.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-white">{completedCount}/{flow.steps.length}</span>
          </div>
          <div className="h-1.5 bg-neutral-800 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Steps */}
      {flow.steps.length === 0 ? (
        <div className="text-center py-16 text-gray-700">
          <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Add steps in the builder to see your client's view</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flow.steps.map((step) => {
            const status = getStatus(step)
            const isUpload = step.step_type === 'request_pdf' || step.step_type === 'request_photo'

            return (
              <div
                key={step.id}
                className={`bg-neutral-900 border rounded-xl p-4 transition-all ${
                  status === 'active'
                    ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-600/5'
                    : status === 'completed'
                    ? 'border-neutral-800'
                    : 'border-neutral-800 opacity-40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    status === 'completed'
                      ? 'bg-blue-600'
                      : status === 'active'
                      ? 'border-2 border-blue-500'
                      : 'border-2 border-neutral-700'
                  }`}>
                    {status === 'completed' ? (
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    ) : status === 'locked' ? (
                      <Lock className="w-3 h-3 text-neutral-600" />
                    ) : (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${status === 'locked' ? 'text-neutral-600' : 'text-white'}`}>
                      {step.title || 'Untitled step'}
                    </p>
                    {step.description && (
                      <p className={`text-sm mt-0.5 ${status === 'locked' ? 'text-neutral-700' : 'text-gray-500'}`}>
                        {step.description}
                      </p>
                    )}

                    {status === 'active' && (
                      <div className="mt-3 flex gap-2 flex-wrap items-center">
                        {!isUpload && step.url && (
                          <a
                            href="#"
                            onClick={e => e.preventDefault()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                          >
                            Open
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {isUpload ? (
                          <>
                            {/* Hidden real file input — opens picker, then gates on select */}
                            <input
                              type="file"
                              accept={step.step_type === 'request_photo' ? 'image/*' : '.pdf,application/pdf'}
                              className="hidden"
                              id={`upload-${step.id}`}
                              onChange={() => onShowPublish()}
                            />
                            <label
                              htmlFor={`upload-${step.id}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                              {step.step_type === 'request_photo' ? (
                                <><Camera className="w-4 h-4" /> Upload Photo</>
                              ) : (
                                <><FileUp className="w-4 h-4" /> Upload PDF</>
                              )}
                            </label>
                          </>
                        ) : (
                          <button
                            onClick={() => onComplete(step.id)}
                            className="px-3 py-1.5 border border-neutral-700 text-gray-300 text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors"
                          >
                            Mark done
                          </button>
                        )}
                      </div>
                    )}

                    {status === 'completed' && (
                      <p className="text-sm text-blue-400 mt-2">✓ Completed</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Powered by */}
      <div className="text-center mt-10">
        <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-gray-500">
          <Sparkles className="w-3 h-3" />
          Powered by Onbrd
        </a>
      </div>
    </div>
  )
}

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_FLOW: FlowState = {
  client_name: 'Acme Design Co.',
  welcome_message: 'Welcome! Complete these steps to kick things off.',
  steps: [
    {
      id: 'step-1',
      title: 'Sign the contract',
      description: 'Review and e-sign your service agreement',
      url: 'https://example.com/contract',
      step_type: 'link',
    },
    {
      id: 'step-2',
      title: 'Submit your brand assets',
      description: 'Upload your logo and brand guidelines PDF',
      url: '',
      step_type: 'request_pdf',
    },
  ],
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [flow, setFlow] = useState<FlowState>(INITIAL_FLOW)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [showPublish, setShowPublish] = useState(false)
  const [logoInput] = useState<null>(null)

  useEffect(() => {
    trackFbq('ViewContent', { content_name: 'Demo Page' })
  }, [])

  const updateFlow = (data: Partial<FlowState>) => {
    setFlow(prev => ({ ...prev, ...data }))
    if (data.steps) setCompletedIds(new Set())
  }

  const updateStep = (id: string, data: Partial<Step>) => {
    setFlow(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === id ? { ...s, ...data } : s),
    }))
    setCompletedIds(new Set())
  }

  const addStep = () => {
    const newStep: Step = {
      id: uid(),
      title: '',
      description: '',
      url: '',
      step_type: 'link',
    }
    setFlow(prev => ({ ...prev, steps: [...prev.steps, newStep] }))
  }

  const deleteStep = (id: string) => {
    setFlow(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== id) }))
    setCompletedIds(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  const handleComplete = (stepId: string) => {
    if (stepId === 'reset') {
      setCompletedIds(new Set())
      return
    }
    setCompletedIds(prev => new Set([...prev, stepId]))
  }

  const handlePublish = () => {
    trackFbq('AddToCart')
    setShowPublish(true)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Top banner */}
      <div className="bg-blue-600 py-2.5 px-4 text-center text-sm font-medium text-white">
        Build your flow below — hit Publish when you're ready to share it with clients
      </div>

      {/* Main split layout */}
      <div className="flex flex-col lg:flex-row flex-1">

        {/* ── LEFT: Builder ── */}
        <div className="lg:w-[42%] border-b lg:border-b-0 lg:border-r border-neutral-800 flex flex-col">

          {/* Builder header */}
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60 sticky top-0 z-10 backdrop-blur">
            <div className="flex items-center gap-2">
              <Image src="/logo-dark.png" alt="Onbrd" width={80} height={40} className="h-7 w-auto opacity-80" />
              <span className="text-xs text-neutral-600 border border-neutral-800 rounded px-1.5 py-0.5">Builder</span>
            </div>
            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Publish & Share
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto flex-1">

            {/* Settings card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-4">
              <h2 className="text-sm font-medium text-white">Settings</h2>

              {/* Logo */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Company logo (optional)</label>
                <button
                  onClick={handlePublish}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-neutral-700 border-dashed rounded-md text-sm text-gray-500 hover:border-neutral-500 hover:text-gray-300 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload logo
                </button>
                <p className="text-xs text-gray-600 mt-1">Displays at the top of the client portal</p>
              </div>

              {/* Client name */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Client name</label>
                <input
                  type="text"
                  value={flow.client_name}
                  onChange={e => updateFlow({ client_name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Acme Corp"
                />
              </div>

              {/* Welcome message */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Welcome message</label>
                <textarea
                  value={flow.welcome_message}
                  onChange={e => updateFlow({ welcome_message: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Welcome! Complete the steps below..."
                />
              </div>
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-white">
                  Steps <span className="text-gray-600 font-normal">({flow.steps.length})</span>
                </h2>
                <button
                  onClick={addStep}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add step
                </button>
              </div>

              {flow.steps.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 border-dashed rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4 text-sm">No steps yet</p>
                  <button
                    onClick={addStep}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add first step
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {flow.steps.map((step, i) => (
                    <BuilderStep
                      key={step.id}
                      step={step}
                      index={i}
                      onUpdate={updateStep}
                      onDelete={deleteStep}
                    />
                  ))}
                  <button
                    onClick={addStep}
                    className="w-full py-3 border border-neutral-800 border-dashed rounded-lg text-sm text-gray-600 hover:border-neutral-600 hover:text-gray-400 transition-colors"
                  >
                    + Add another step
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky bottom — pro nudge */}
          <div className="border-t border-neutral-800 px-6 py-4 bg-neutral-950">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-400 font-medium">You're using Pro features</p>
                <p className="text-xs text-gray-600 mt-0.5">Collect documents, request photos, unlimited steps</p>
              </div>
              <button
                onClick={handlePublish}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Onbrd Pro
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div className="lg:w-[58%] flex flex-col bg-black overflow-y-auto">

          {/* Preview label */}
          <div className="px-6 py-3 border-b border-neutral-800 bg-neutral-950/60 sticky top-0 z-10 backdrop-blur flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs text-gray-500 font-medium">Live preview — what your client sees</span>
          </div>

          <div className="flex-1">
            <PreviewPanel
              flow={flow}
              completedIds={completedIds}
              onComplete={handleComplete}
              onShowPublish={handlePublish}
            />
          </div>

          {/* Bottom CTA */}
          <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Ready to send this to a real client?</p>
                <p className="text-xs text-gray-500 mt-0.5">Hit publish and get a shareable link in seconds.</p>
              </div>
              <button
                onClick={handlePublish}
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Publish & Share
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-700" />
              <p className="text-xs text-gray-700">7-day money-back guarantee · Cancel anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Publish / signup modal */}
      {showPublish && <PublishModal onClose={() => setShowPublish(false)} />}
    </div>
  )
}
