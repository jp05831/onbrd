'use client'

import { useState } from 'react'
import { Check, Lock, ArrowUpRight, Sparkles, FileText } from 'lucide-react'

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

interface ClientPortalProps {
  flow: {
    id: string
    client_name: string
    welcome_message: string | null
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

  if (allComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">All done!</h1>
          <p className="text-gray-500 mb-8">
            You've completed all steps. {owner.company_name || owner.name} will be in touch.
          </p>
          <p className="text-sm text-gray-400">{steps.length} steps completed</p>
          
          {owner.plan === 'free' && (
            <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-400 mt-12 hover:text-gray-500">
              <Sparkles className="w-3 h-3" />
              Powered by OnboardLink
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          {owner.logo_url ? (
            <img src={owner.logo_url} alt="" className="h-10 object-contain" />
          ) : (
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">
                {(owner.company_name || owner.name).charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{owner.company_name || owner.name}</p>
            <p className="text-sm text-gray-500">Client Onboarding</p>
          </div>
        </div>

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Welcome, {flow.client_name}
          </h1>
          <p className="text-gray-500">
            {flow.welcome_message || 'Complete the steps below to get started.'}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-gray-900">{completedCount}/{steps.length}</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full">
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
            
            return (
              <div
                key={step.id}
                className={`bg-white border rounded-lg p-4 transition-all ${
                  status === 'active' 
                    ? 'border-blue-600 ring-1 ring-blue-600' 
                    : status === 'completed'
                    ? 'border-gray-200'
                    : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    status === 'completed'
                      ? 'bg-blue-600'
                      : status === 'active'
                      ? 'border-2 border-blue-600'
                      : 'border-2 border-gray-300'
                  }`}>
                    {status === 'completed' ? (
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    ) : status === 'locked' ? (
                      <Lock className="w-3 h-3 text-gray-400" />
                    ) : (
                      <span className="w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className={`text-sm mt-0.5 ${status === 'locked' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {step.description}
                      </p>
                    )}

                    {status === 'active' && (
                      <div className="flex gap-2 mt-3">
                        {step.file_id ? (
                          <a
                            href={step.file_id.startsWith('http') ? step.file_id : `/api/files/${step.file_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View PDF
                          </a>
                        ) : step.url ? (
                          <a
                            href={step.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                          >
                            Open
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        ) : null}
                        <button
                          onClick={() => completeStep(step.id)}
                          disabled={completing === step.id}
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {completing === step.id ? 'Saving...' : 'Mark done'}
                        </button>
                      </div>
                    )}

                    {status === 'completed' && (
                      <p className="text-sm text-blue-600 mt-1">Completed</p>
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
            <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-500">
              <Sparkles className="w-3 h-3" />
              Powered by OnboardLink
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
