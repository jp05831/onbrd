'use client'

import { Users, Plus, Mail } from 'lucide-react'

export default function TeamPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Team</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage team members and permissions.
        </p>
      </div>

      {/* Coming Soon State */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Team collaboration coming soon
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          Invite team members to collaborate on flows, manage permissions, and track activity.
        </p>
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
        >
          <Mail className="w-4 h-4" />
          Invite team member
        </button>
      </div>
    </div>
  )
}
