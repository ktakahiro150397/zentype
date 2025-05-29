'use client'

import { useMockAuth } from '@/components/MockAuthProvider'
import Link from 'next/link'

export function Header() {
  const { user, isAuthenticated, signOut, isLoading } = useMockAuth()
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-900">ZenType</div>
            {isDemoMode && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Demo</span>
            )}
          </Link>

          {/* Navigation & Auth */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/history"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  History
                </Link>                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-700">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Sign out
                </button>
              </div>            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {isDemoMode ? 'Demo Sign in' : 'Sign in'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
