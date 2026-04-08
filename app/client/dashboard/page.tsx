import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import database from '../../lib/db'
import type { Flow } from '../../lib/db'
import LogoutButton from './LogoutButton'

type FlowWithCounts = Flow & { total_steps: number; completed_steps: number }

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    draft: 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400',
  }
  const labels: Record<string, string> = {
    published: 'Active',
    completed: 'Completed',
    draft: 'Draft',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
      {labels[status] || status}
    </span>
  )
}

export default async function ClientDashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('client_token')?.value

  if (!token) {
    redirect('/client/login')
  }

  const session = await database.getClientSession(token)
  if (!session) {
    redirect('/client/login')
  }

  const flows = await database.getFlowsByClientAccountId(session.id) as FlowWithCounts[]

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      {/* Nav */}
      <header className="border-b border-gray-100 dark:border-neutral-900 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <Image src="/logo-light.png" alt="Onbrd" width={100} height={50} className="h-8 w-auto dark:hidden" priority />
            <Image src="/logo-dark.png" alt="Onbrd" width={100} height={50} className="h-8 w-auto hidden dark:block" priority />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {session.name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Your onboarding
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {flows.length === 0
              ? 'No flows linked to your account yet.'
              : `${flows.length} flow${flows.length === 1 ? '' : 's'} linked to your account`}
          </p>
        </div>

        {flows.length === 0 ? (
          <div className="text-center py-16 px-6 border border-dashed border-gray-200 dark:border-neutral-800 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">No flows yet</p>
            <p className="text-gray-400 dark:text-gray-600 text-xs">
              When someone shares an onboarding link with you, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {flows.map((flow) => {
              const total = Number(flow.total_steps) || 0
              const completed = Number(flow.completed_steps) || 0
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0

              return (
                <div
                  key={flow.id}
                  className="border border-gray-100 dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900/50 hover:border-gray-200 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {flow.client_name}
                      </p>
                    </div>
                    <StatusBadge status={flow.status} />
                  </div>

                  {total > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                        <span>Progress</span>
                        <span>{completed}/{total} steps</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/onboard/${flow.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {flow.status === 'completed' ? 'View completed flow' : 'Continue onboarding'}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
