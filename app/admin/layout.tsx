import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/app/lib/admin-auth'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifyAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <AdminSidebar email={session.email} />
      <main className="flex-1 ml-56 p-8">
        {children}
      </main>
    </div>
  )
}
