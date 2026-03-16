'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, LogOut } from 'lucide-react'

export default function AdminSidebar({ email }: { email: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 w-56 bg-neutral-900 border-r border-neutral-800 flex flex-col z-30">
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Image src="/logo-dark.png" alt="Onbrd" width={80} height={32} className="h-7 w-auto" priority />
          <span className="text-xs font-medium text-neutral-500 border border-neutral-800 rounded px-1.5 py-0.5">admin</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-neutral-800">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-neutral-500 truncate">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
