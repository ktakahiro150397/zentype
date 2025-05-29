'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { mockUser, LocalStorageService } from '@/lib/mockData'

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
}

interface MockAuthContextType {
  user: User | null
  isAuthenticated: boolean
  signIn: () => void
  signOut: () => void
  isLoading: boolean
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

interface MockAuthProviderProps {
  children: ReactNode
}

export function MockAuthProvider({ children }: MockAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and check if user was previously signed in
    const timer = setTimeout(() => {
      const storedAuth = localStorage.getItem('zentype_mock_auth')
      if (storedAuth === 'true') {
        setUser(mockUser)
      }
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const signIn = () => {
    setUser(mockUser)
    localStorage.setItem('zentype_mock_auth', 'true')
    LocalStorageService.saveUserProfile(mockUser)
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('zentype_mock_auth')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    signIn,
    signOut,
    isLoading,
  }

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuth() {
  const context = useContext(MockAuthContext)
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider')
  }
  return context
}
