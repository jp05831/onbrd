'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  LayoutDashboard, Settings, LogOut, CreditCard, Sun, Moon, 
  ChevronLeft, ChevronRight, Sparkles, Users, Menu, X
} from 'lucide-react'
import { useTheme } from '../lib/theme'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isPro = (session.user as any)?.plan === 'pro'

  const mainNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Flows' },
    { href: '/dashboard/team', icon: Users, label: 'Team' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  ]

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`p-4 ${sidebarOpen ? '' : 'flex justify-center'}`}>
        <Link href="/dashboard" className="flex items-center">
          {sidebarOpen ? (
            <>
              <Image
                src="/logo-light.png"
                alt="Onbrd"
                width={100}
                height={40}
                className="h-8 w-auto dark:hidden"
                priority
              />
              <Image
                src="/logo-dark.png"
                alt="Onbrd"
                width={100}
                height={40}
                className="h-8 w-auto hidden dark:block"
                priority
              />
            </>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
          )}
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${!sidebarOpen ? 'justify-center' : ''}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          )
        })}

        {/* Upgrade Button */}
        {!isPro && (
          <Link
            href="/dashboard/billing"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all ${!sidebarOpen ? 'justify-center' : ''}`}
            title={!sidebarOpen ? 'Upgrade to Pro' : undefined}
          >
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Upgrade</span>}
          </Link>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
          title={!sidebarOpen ? (theme === 'light' ? 'Dark mode' : 'Light mode') : undefined}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 flex-shrink-0" />
          ) : (
            <Sun className="w-5 h-5 flex-shrink-0" />
          )}
          {sidebarOpen && <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>}
        </button>

        {/* User */}
        {sidebarOpen ? (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {session.user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session.user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-3 py-2.5 mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        <SidebarContent />
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-7 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shadow-sm"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-30">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo-light.png"
            alt="Onbrd"
            width={80}
            height={32}
            className="h-7 w-auto dark:hidden"
            priority
          />
          <Image
            src="/logo-dark.png"
            alt="Onbrd"
            width={80}
            height={32}
            className="h-7 w-auto hidden dark:block"
            priority
          />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-16'}`}>
        <div className="lg:hidden h-14" /> {/* Spacer for mobile header */}
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
