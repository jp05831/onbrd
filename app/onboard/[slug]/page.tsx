import { notFound } from 'next/navigation'
import database from '../../lib/db'
import ClientPortal from './ClientPortal'

export default async function OnboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const flow = database.getFlowBySlug(slug)
  
  if (!flow || flow.status === 'draft') {
    notFound()
  }

  const steps = database.getStepsByFlowId(flow.id)
  const user = database.getUserById(flow.user_id)

  return (
    <ClientPortal
      flow={{
        id: flow.id,
        client_name: flow.client_name,
        welcome_message: flow.welcome_message,
        status: flow.status,
      }}
      steps={steps.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        url: s.url,
        file_id: s.file_id,
        file_name: s.file_name,
        position: s.position,
        completed: s.completed,
      }))}
      owner={{
        name: user?.name || 'Unknown',
        company_name: user?.company_name,
        logo_url: user?.logo_url,
        plan: user?.plan || 'free',
      }}
    />
  )
}
