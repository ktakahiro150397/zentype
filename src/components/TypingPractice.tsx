'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTypingStats } from '@/hooks/useTypingStats'
import { dataService } from '@/lib/dataService'
import { useMockAuth } from '@/components/MockAuthProvider'

interface TypingPracticeProps {
  text: string
  textId: string
  onComplete?: (stats: any) => void
}

export function TypingPractice({ text, textId, onComplete }: TypingPracticeProps) {
  const { user } = useMockAuth()
  const [currentInput, setCurrentInput] = useState('')
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [mistakes, setMistakes] = useState<number[]>([])
  const [isActive, setIsActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const stats = useTypingStats({
    text,
    currentInput,
    startTime,
    mistakes,
  })

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    if (!startTime && value.length > 0) {
      setStartTime(new Date())
      setIsActive(true)
    }

    // Check for new mistakes
    const newMistakes = [...mistakes]
    const currentIndex = value.length - 1

    if (currentIndex >= 0 && currentIndex < text.length) {
      if (value[currentIndex] !== text[currentIndex] && !newMistakes.includes(currentIndex)) {
        newMistakes.push(currentIndex)
        setMistakes(newMistakes)
      }
    }

    setCurrentInput(value)

    // Check for completion
    if (value.length === text.length) {
      setIsCompleted(true)
      setIsActive(false)
      saveResult()
    }
  }, [text, startTime, mistakes])
  // Save result to database
  const saveResult = async () => {
    if (!user?.id || !startTime) return

    try {
      const finalStats = {
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: stats.mistakeCount,
        time_taken: stats.duration,
      }

      await dataService.saveSessionResult({
        user_id: user.id,
        wpm: finalStats.wpm,
        accuracy: finalStats.accuracy,
        text_id: textId,
        text_content: text,
        time_taken: finalStats.time_taken,
        errors: finalStats.errors,
      })

      if (onComplete) {
        onComplete(finalStats)
      }
    } catch (error) {
      console.error('Error saving result:', error)
    }
  }

  // Reset function
  const reset = useCallback(() => {
    setCurrentInput('')
    setStartTime(null)
    setIsCompleted(false)
    setMistakes([])
    setIsActive(false)
    inputRef.current?.focus()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        reset()
      } else if (e.key === 'Enter' && !isActive && !isCompleted) {
        inputRef.current?.focus()
      } else if (e.ctrlKey && e.key === 'r') {
        e.preventDefault()
        reset()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [reset, isActive, isCompleted])

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Render character with styling
  const renderCharacter = (char: string, index: number) => {
    let className = 'text-gray-400'
    
    if (index < currentInput.length) {
      if (mistakes.includes(index)) {
        className = 'bg-red-200 text-red-800'
      } else if (currentInput[index] === char) {
        className = 'text-green-600 bg-green-50'
      } else {
        className = 'bg-red-200 text-red-800'
      }
    } else if (index === currentInput.length) {
      className = 'text-gray-900 bg-blue-200' // cursor position
    }

    return (
      <span key={index} className={className}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    )
  }
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Stats Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.wpm}</div>
          <div className="text-sm text-gray-600">WPM</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.mistakeCount}</div>
          <div className="text-sm text-gray-600">Errors</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{stats.duration}s</div>
          <div className="text-sm text-gray-600">Time</div>
        </div>
      </div>      {/* Text Display */}
      <div className="bg-white p-4 md:p-6 rounded-lg border-2 border-gray-200 focus-within:border-blue-500">
        <div className="text-lg md:text-xl leading-relaxed font-mono whitespace-normal break-words word-wrap">
          {text.split('').map((char, index) => renderCharacter(char, index))}
        </div>
      </div>

      {/* Input Field */}
      <div className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={isCompleted}
          className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          placeholder={isCompleted ? "Completed!" : "Start typing here..."}
        />
        
        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset (Esc)
          </button>
          {isCompleted && (
            <button
              onClick={reset}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="text-center text-sm text-gray-500">
        <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> to focus, <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to reset, <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+R</kbd> to restart</p>
      </div>
    </div>
  )
}
