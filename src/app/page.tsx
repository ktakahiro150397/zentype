'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { TypingPractice } from '@/components/TypingPractice'
import { dataService, type PracticeText } from '@/lib/dataService'
import { useMockAuth } from '@/components/MockAuthProvider'
import Link from 'next/link'

export default function Home() {
  const { user, isAuthenticated, isLoading } = useMockAuth()
  const [practiceTexts, setPracticeTexts] = useState<PracticeText[]>([])
  const [currentText, setCurrentText] = useState<PracticeText | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPracticeTexts()
  }, [])

  const fetchPracticeTexts = async () => {
    try {
      const texts = await dataService.getPracticeTexts()
      setPracticeTexts(texts)
      if (texts.length > 0) {
        setCurrentText(texts[0])
      }
    } catch (error) {
      console.error('Error fetching practice texts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTextChange = (textId: string) => {
    const selectedText = practiceTexts.find(text => text.id === textId)
    if (selectedText) {
      setCurrentText(selectedText)
    }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to ZenType</h1>
          <p className="text-xl text-gray-600 mb-8">
            Ultimate minimal typing practice for focused improvement
          </p>
          <div className="space-y-4">
            <p className="text-gray-500">
              Sign in with Google to start tracking your typing progress and access personalized features.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
          
          {/* Demo section */}
          <div className="mt-16 text-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Try a Quick Demo</h2>
            {practiceTexts.length > 0 && (
              <TypingPractice
                text={practiceTexts[0].content}
                textId={practiceTexts[0].id}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Text Selection */}
        {practiceTexts.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {practiceTexts.map((text) => (
                <button
                  key={text.id}
                  onClick={() => handleTextChange(text.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentText?.id === text.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {text.category} ({text.difficulty})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Typing Practice */}
        {currentText ? (
          <TypingPractice
            text={currentText.content}
            textId={currentText.id}
            onComplete={(stats) => {
              console.log('Session completed:', stats)
            }}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No practice texts available.</p>
          </div>
        )}
      </main>
    </div>
  )
}
