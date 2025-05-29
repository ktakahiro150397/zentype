'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { dataService, type SessionResult } from '@/lib/dataService'
import { useMockAuth } from '@/components/MockAuthProvider'
import Link from 'next/link'

export default function History() {
  const { user, isAuthenticated, isLoading } = useMockAuth()
  const [results, setResults] = useState<SessionResult[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageWpm: 0,
    averageAccuracy: 0,
    bestWpm: 0,
  })

  useEffect(() => {
    if (user?.id) {
      fetchResults()
    }
  }, [user])

  const fetchResults = async () => {
    if (!user?.id) return

    try {
      const data = await dataService.getSessionResults(user.id)
      setResults(data)
      calculateStats(data)
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: SessionResult[]) => {
    if (data.length === 0) {
      setStats({
        totalSessions: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        bestWpm: 0,
      })
      return
    }

    const totalSessions = data.length
    const averageWpm = Math.round(data.reduce((sum, result) => sum + result.wpm, 0) / totalSessions)
    const averageAccuracy = Math.round(data.reduce((sum, result) => sum + result.accuracy, 0) / totalSessions)
    const bestWpm = Math.max(...data.map(result => result.wpm))

    setStats({
      totalSessions,
      averageWpm,
      averageAccuracy,
      bestWpm,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view your typing history and progress.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Typing History</h1>
          <p className="text-gray-600">Track your progress and improve your typing skills</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.averageWpm}</div>
            <div className="text-sm text-gray-600">Average WPM</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.averageAccuracy}%</div>
            <div className="text-sm text-gray-600">Average Accuracy</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{stats.bestWpm}</div>
            <div className="text-sm text-gray-600">Best WPM</div>
          </div>
        </div>

        {/* Results Table */}
        {results.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WPM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Errors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Text
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(result.created_at || '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">{result.wpm}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">{result.accuracy}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-red-600">{result.errors}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(result.time_taken)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                            ID: {result.text_id}
                          </span>
                          {result.text_content.substring(0, 50)}...
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No typing sessions yet</h3>
            <p className="text-gray-500 mb-6">
              Start practicing to see your progress and statistics here.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Practicing
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
