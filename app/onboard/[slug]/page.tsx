import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { cookies } from 'next/headers'
import database from '../../lib/db'
import ClientPortal from './ClientPortal'

export default async function OnboardPage({ params }: { params: Promise<{ slug: string }> }) {
  noStore()
  const { slug } = await params

  const flow = await database.getFlowBySlug(slug)

  if (!flow || flow.status === 'draft') {
    notFound()
  }

  const steps = await database.getStepsByFlowId(flow.id)
  const user = await database.getUserById(flow.user_id)

  // Check for logged-in client account
  const cookieStore = await cookies()
  const clientToken = cookieStore.get('client_token')?.value
  let clientAccount: { id: string; name: string; email: string } | null = null

  if (clientToken) {
    const session = await database.getClientSession(clientToken)
    if (session) {
      clientAccount = { id: session.id, name: session.name, email: session.email }
    }
  }

  return (
    <ClientPortal
      flow={{
        id: flow.id,
        slug: flow.slug,
        client_name: flow.client_name,
        welcome_message: flow.welcome_message,
        completion_message: flow.completion_message,
        accent_color: flow.accent_color,
        logo_url: flow.logo_url,
        status: flow.status,
      }}
      steps={steps.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        url: s.url,
        file_id: s.file_id,
        file_name: s.file_name,
        step_type: s.step_type,
        uploaded_file_id: s.uploaded_file_id,
        uploaded_file_name: s.uploaded_file_name,
        position: s.position,
        completed: s.completed,
        expire_at: s.expire_at ?? null,
        due_date: s.due_date ?? null,
      }))}
      owner={{
        name: user?.name || 'Unknown',
        company_name: user?.company_name ?? null,
        logo_url: user?.logo_url ?? null,
        plan: user?.plan || 'free',
      }}
      clientAccount={clientAccount}
    />
  )
}

