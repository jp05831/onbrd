'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  ArrowRight, Sparkles, Check, Lock, Plus, Trash2, GripVertical,
  ExternalLink, FileUp, Camera, X, Globe, FileText, Upload, Link2,
  ShieldCheck, Zap
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

type GateReason = 'steps' | 'logo' | 'publish' | null

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function trackFbq(event: string, params?: object) {
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', event, params)
  }
}

function trackCTA() {
  trackFbq('InitiateCheckout')
}

// ─── Pro Gate Modal ───────────────────────────────────────────────────────────

function ProGateModal({ reason, onClose }: { reason: GateReason; onClose: () => void }) {
  if (!reason) return null

  const subtitles: Record<NonNullable<GateReason>, string> = {
    steps: 'Free plan includes 2 steps per flow. Pro gives you unlimited steps, unlimited flows, and unlimited clients.',
    logo: 'White-label branding is a Pro feature. Remove Onbrd branding and add your own logo to the client portal.',
    publish: 'Ready to share this with your client? Create an account to publish your flow and get a shareable link.',
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">You've discovered a Pro feature</h2>
                <p className="text-sm text-gray-400 mt-0.5 max-w-xs">{subtitles[reason]}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-300 transition-colors ml-4">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Everything in Pro</p>
          <ul className="space-y-2.5 mb-6">
            {[
              'Unlimited flows & steps',
              'Unlimited clients — no per-seat fees',
              'White-label branding',
              'Email notifications on completion',
              'Priority support',
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="bg-neutral-800 rounded-lg p-3 mb-5 text-center">
            <p className="text-white font-semibold">$15<span className="text-gray-400 font-normal text-sm">/mo</span>
              <span className="text-gray-400 font-normal text-sm mx-2">or</span>
              <span className="text-blue-400 font-semibold">$12.50/mo</span>
              <span className="text-gray-400 font-normal text-sm"> billed annually</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">7-day money-back guarantee · Cancel anytime</p>
          </div>

          <a
            href="/signup"
            onClick={trackCTA}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Onbrd Pro
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/signup"
            onClick={trackCTA}
            className="block text-center text-sm text-gray-500 hover:text-gray-300 mt-3 transition-colors"
          >
            Start free instead
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Step Type Selector ───────────────────────────────────────────────────────

function StepTypeButton({
  type, label, icon: Icon, active, isProType, onClick,
}: {
  type: StepType; label: string; icon: any; active: boolean; isProType: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium rounded-md border transition-colors ${
        active
          ? isProType
            ? 'border-purple-600 bg-purple-900/30 text-purple-400'
            : 'border-blue-600 bg-blue-900/30 text-blue-400'
          : 'border-neutral-700 text-gray-400 hover:bg-neutral-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {isProType && (
        <span className="absolute -top-2 -right-2 text-[9px] font-bold bg-purple-600 text-white px-1 py-0.5 rounded leading-none">
          PRO
        </span>
      )}
    </button>
  )
}

// ─── Builder Step Card ────────────────────────────────────────────────────────

function BuilderStep({
  step, index, onUpdate, onDelete, onProGate, showProBanner,
}: {
  step: Step
  index: number
  onUpdate: (id: string, data: Partial<Step>) => void
  onDelete: (id: string) => void
  onProGate: (reason: GateReason) => void
  showProBanner: boolean
}) {
  const isProType = step.step_type === 'request_pdf' || step.step_type === 'request_photo'

  const handleTypeChange = (type: StepType) => {
    onUpdate(step.id, { step_type: type })
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg transition-colors">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-neutral-950/50 rounded-t-lg">
        <button className="p-1 text-gray-600 cursor-grab">
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-500">Step {index + 1}</span>
        {isProType && (
          <span className="ml-1 text-[10px] font-semibold text-purple-400 bg-purple-900/40 border border-purple-800 px-1.5 py-0.5 rounded">
            ⚡ PRO FEATURE
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
            placeholder="Brief instructions"
          />
        </div>

        {/* Type selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Step Type</label>
          <div className="grid grid-cols-4 gap-2">
            <StepTypeButton type="link" label="URL" icon={ExternalLink} active={step.step_type === 'link'} isProType={false} onClick={() => handleTypeChange('link')} />
            <StepTypeButton type="link" label="PDF" icon={Upload} active={false} isProType={false} onClick={() => handleTypeChange('link')} />
            <StepTypeButton type="request_pdf" label="Request PDF" icon={FileUp} active={step.step_type === 'request_pdf'} isProType={true} onClick={() => handleTypeChange('request_pdf')} />
            <StepTypeButton type="request_photo" label="Request Photo" icon={Camera} active={step.step_type === 'request_photo'} isProType={true} onClick={() => handleTypeChange('request_photo')} />
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
            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-purple-900/20 border border-purple-800 rounded-md">
              <FileUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Client will upload a PDF document</span>
            </div>
          )}

          {step.step_type === 'request_photo' && (
            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-purple-900/20 border border-purple-800 rounded-md">
              <Camera className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Client will upload a photo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Client Preview Panel ─────────────────────────────────────────────────────

function PreviewPanel({ flow, completedIds, onComplete }: {
  flow: FlowState
  completedIds: Set<string>
  onComplete: (id: string) => void
}) {
  const allDone = flow.steps.length > 0 && flow.steps.every(s => completedIds.has(s.id))
  const completedCount = flow.steps.filter(s => completedIds.has(s.id)).length
  const progress = flow.steps.length > 0 ? (completedCount / flow.steps.length) * 100 : 0

  const getStatus = (step: Step, index: number) => {
    if (completedIds.has(step.id)) return 'completed'
    const firstUncompleted = flow.steps.find(s => !completedIds.has(s.id))
    if (firstUncompleted?.id === step.id) return 'active'
    return 'locked'
  }

  if (allDone) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6 py-12">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">All done!</h2>
        <p className="text-gray-400 mb-8">
          You've completed all steps. {flow.client_name || 'Your team'} will be in touch.
        </p>
        <p className="text-sm text-gray-600 mb-8">{flow.steps.length} steps completed</p>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-sm w-full">
          <p className="text-sm text-gray-400 mb-4">Want to create onboarding flows like this for your own clients?</p>
          <a
            href="/signup"
            onClick={trackCTA}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create your own flow
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-xs text-gray-600 mt-2 text-center">Free to start · No credit card required</p>
        </div>
        <div className="mt-8">
          <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-500">
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
        <div className="text-center py-12 text-gray-600">
          <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Add steps in the builder to see them here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flow.steps.map((step, index) => {
            const status = getStatus(step, index)
            const isUpload = step.step_type === 'request_pdf' || step.step_type === 'request_photo'

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
                  {/* Status icon */}
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
                      {step.title || 'Untitled step'}
                    </p>
                    {step.description && (
                      <p className={`text-sm mt-0.5 ${status === 'locked' ? 'text-neutral-700' : 'text-gray-500'}`}>
                        {step.description}
                      </p>
                    )}

                    {status === 'active' && (
                      <div className="mt-3 flex gap-2 flex-wrap">
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
                          <button
                            onClick={() => alert('This is a live demo — uploads are disabled. Sign up to collect real files from clients!')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                          >
                            {step.step_type === 'request_photo' ? (
                              <><Camera className="w-4 h-4" /> Upload Photo</>
                            ) : (
                              <><FileUp className="w-4 h-4" /> Upload PDF</>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => onComplete(step.id)}
                            className="px-3 py-1.5 border border-neutral-700 text-gray-300 text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors"
                          >
                            Mark done
                          </button>
                        )}
                        {isUpload && (
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
        <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-500">
          <Sparkles className="w-3 h-3" />
          Powered by Onbrd
        </a>
      </div>
    </div>
  )
}

// ─── Main Demo Page ───────────────────────────────────────────────────────────

const INITIAL_STEPS: Step[] = [
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
]

const INITIAL_FLOW: FlowState = {
  client_name: 'Acme Design Co.',
  welcome_message: 'Welcome! Complete these steps to kick things off.',
  steps: INITIAL_STEPS,
}

export default function DemoPage() {
  const [flow, setFlow] = useState<FlowState>(INITIAL_FLOW)
  const [gateReason, setGateReason] = useState<GateReason>(null)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [showProBanner, setShowProBanner] = useState(true) // visible since we have a pro step pre-loaded

  useEffect(() => {
    trackFbq('ViewContent', { content_name: 'Demo Page' })
  }, [])

  const updateFlow = (data: Partial<FlowState>) => {
    setFlow(prev => ({ ...prev, ...data }))
    // Reset completions if steps change
    if (data.steps) setCompletedIds(new Set())
  }

  const updateStep = (id: string, data: Partial<Step>) => {
    const updated = flow.steps.map(s => s.id === id ? { ...s, ...data } : s)
    setFlow(prev => ({ ...prev, steps: updated }))
    setCompletedIds(new Set())
    // Show pro banner if any pro type in use
    const hasProStep = updated.some(s => s.step_type === 'request_pdf' || s.step_type === 'request_photo')
    if (hasProStep) setShowProBanner(true)
  }

  const addStep = () => {
    if (flow.steps.length >= 2) {
      setGateReason('steps')
      return
    }
    const newStep: Step = {
      id: uid(),
      title: '',
      description: '',
      url: '',
      step_type: 'link',
    }
    updateFlow({ steps: [...flow.steps, newStep] })
  }

  const deleteStep = (id: string) => {
    const updated = flow.steps.filter(s => s.id !== id)
    setFlow(prev => ({ ...prev, steps: updated }))
    setCompletedIds(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  const handleComplete = (stepId: string) => {
    setCompletedIds(prev => new Set([...prev, stepId]))
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Banner */}
      <div className="bg-blue-600 py-2.5 px-4 text-center text-sm font-medium text-white flex items-center justify-center gap-2 flex-wrap">
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <span>You are previewing Onbrd Pro — the fastest way to onboard clients</span>
        <a
          href="/signup"
          onClick={trackCTA}
          className="underline underline-offset-2 hover:no-underline font-semibold"
        >
          Get started free →
        </a>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* ── LEFT: Builder ── */}
        <div className="lg:w-[42%] border-b lg:border-b-0 lg:border-r border-neutral-800 flex flex-col overflow-y-auto">
          {/* Builder header */}
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60 sticky top-0 z-10 backdrop-blur">
            <div>
              <div className="flex items-center gap-2">
                <Image src="/logo-dark.png" alt="Onbrd" width={80} height={40} className="h-7 w-auto opacity-80" />
                <span className="text-xs text-neutral-500 border border-neutral-700 rounded px-1.5 py-0.5">Flow Builder</span>
              </div>
            </div>
            <button
              onClick={() => { setGateReason('publish'); trackFbq('AddToCart') }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Publish & Share
            </button>
          </div>

          <div className="p-6 space-y-5 flex-1">
            {/* Flow meta */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-4">
              <h2 className="text-sm font-medium text-white">Settings</h2>

              {/* Logo */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Company logo (optional)</label>
                <button
                  onClick={() => setGateReason('logo')}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-neutral-700 border-dashed rounded-md text-sm text-gray-500 hover:border-neutral-500 hover:text-gray-300 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload logo
                  <span className="text-[10px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded">PRO</span>
                </button>
                <p className="text-xs text-gray-600 mt-1">White-label branding — Pro feature</p>
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
                <label className="block text-xs font-medium text-gray-500 mb-1">Welcome message (optional)</label>
                <textarea
                  value={flow.welcome_message}
                  onChange={e => updateFlow({ welcome_message: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-700 bg-neutral-800 text-white rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Welcome! Complete the steps below..."
                />
              </div>
            </div>

            {/* Steps section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-medium text-white">Steps</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{flow.steps.length} of 2 steps used (free plan)</p>
                </div>
                <button
                  onClick={addStep}
                  className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
                    flow.steps.length < 2
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-gray-500 hover:text-gray-400'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  {flow.steps.length < 2 ? 'Add step' : 'Upgrade for more'}
                </button>
              </div>

              {flow.steps.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 border-dashed rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">No steps yet</p>
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
                      onProGate={setGateReason}
                      showProBanner={showProBanner}
                    />
                  ))}
                </div>
              )}

              {/* Add step / upgrade nudge */}
              {flow.steps.length > 0 && flow.steps.length < 2 && (
                <button
                  onClick={addStep}
                  className="w-full mt-3 py-3 border border-neutral-700 border-dashed rounded-lg text-sm text-gray-500 hover:border-neutral-500 hover:text-gray-300 transition-colors"
                >
                  + Add another step
                </button>
              )}

              {flow.steps.length >= 2 && (
                <div className="w-full mt-3 py-4 px-4 border border-orange-800 bg-orange-900/20 rounded-lg text-center">
                  <p className="text-sm text-orange-400 mb-2">Free plan limit: 2 steps per flow</p>
                  <button
                    onClick={() => setGateReason('steps')}
                    className="text-sm font-medium text-orange-400 hover:text-orange-300 underline"
                  >
                    Upgrade to Pro for unlimited steps →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Pro feature sticky banner */}
          {showProBanner && (
            <div className="sticky bottom-0 bg-blue-600 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-white">
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span>You're using Pro features in this demo</span>
              </div>
              <a
                href="/signup"
                onClick={trackCTA}
                className="text-sm font-semibold text-white underline underline-offset-2 hover:no-underline whitespace-nowrap"
              >
                Get Onbrd Pro →
              </a>
            </div>
          )}
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div className="lg:w-[58%] flex flex-col overflow-y-auto bg-black">
          {/* Preview label */}
          <div className="px-6 py-3 border-b border-neutral-800 bg-neutral-950/60 sticky top-0 z-10 backdrop-blur flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">Live Preview — this is what your client sees</span>
          </div>

          <div className="flex-1">
            <PreviewPanel
              flow={flow}
              completedIds={completedIds}
              onComplete={handleComplete}
            />
          </div>

          {/* Bottom CTA */}
          <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">Stop copy-pasting links to clients.</p>
                <p className="text-xs text-gray-500 mt-0.5">Give them one place to complete everything — no app, no friction.</p>
              </div>
              <a
                href="/signup"
                onClick={trackCTA}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
              <p className="text-xs text-gray-600">No credit card required · 7-day money-back guarantee · Cancel anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Gate Modal */}
      <ProGateModal reason={gateReason} onClose={() => setGateReason(null)} />
    </div>
  )
}
