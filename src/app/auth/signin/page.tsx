'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMockAuth } from '@/components/MockAuthProvider'

export default function SignIn() {
  const router = useRouter()
  const { signIn, isAuthenticated } = useMockAuth()
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleSignIn = async () => {
    await signIn()
    router.push('/')
  }

  return (    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ZenType</h1>
          <p className="text-gray-600">Minimal typing practice</p>
          {isDemoMode && (
            <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
              Demo Mode
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isDemoMode ? 'Enter Demo' : 'Sign in with Google'}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          {isDemoMode 
            ? 'Demo mode uses local storage for data persistence.' 
            : 'By signing in, you agree to our minimal data collection for progress tracking.'
          }
        </p>
      </div>
    </div>
  )
}
