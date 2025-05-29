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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [mistakes, setMistakes] = useState<number[]>([])
  const [isActive, setIsActive] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isWaitingForCorrectKey, setIsWaitingForCorrectKey] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const stats = useTypingStats({
    text,
    currentInput,
    startTime,
    mistakes,
  })
  // Handle key down event
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if not focused or completed
    if (!isFocused || isCompleted) return

    // Start timing on first key press
    if (!startTime && !isActive) {
      setStartTime(new Date())
      setIsActive(true)
    }

    // Handle special keys
    if (e.key === 'Escape') {
      reset()
      return
    }

    // Ignore non-printable characters except space
    if (e.key.length > 1 && e.key !== ' ') return

    const expectedChar = text[currentIndex]
    const typedChar = e.key

    if (typedChar === expectedChar) {
      // Correct key pressed
      setIsWaitingForCorrectKey(false)
      const newInput = currentInput + typedChar
      setCurrentInput(newInput)
      setCurrentIndex(prev => prev + 1)

      // Check for completion
      if (newInput.length === text.length) {
        setIsCompleted(true)
        setIsActive(false)
        saveResult()
      }
    } else {
      // Wrong key pressed
      if (!mistakes.includes(currentIndex)) {
        setMistakes(prev => [...prev, currentIndex])
      }
      setIsWaitingForCorrectKey(true)
    }
  }, [text, currentInput, currentIndex, startTime, isActive, isFocused, isCompleted, mistakes])
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
    setCurrentIndex(0)
    setStartTime(null)
    setIsCompleted(false)
    setMistakes([])
    setIsActive(false)
    setIsWaitingForCorrectKey(false)
    containerRef.current?.focus()
  }, [])
  // Keyboard shortcuts and focus management
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault()
        reset()
      }
    }

    // Add event listener to container when focused
    if (isFocused) {
      containerRef.current?.addEventListener('keydown', handleKeyDown)
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    
    return () => {
      containerRef.current?.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [handleKeyDown, isFocused, reset])

  // Auto-focus on mount
  useEffect(() => {
    containerRef.current?.focus()  }, [])

  // Render character with styling
  const renderCharacter = (char: string, index: number) => {
    let className = 'text-gray-400'
    
    if (index < currentIndex) {
      if (mistakes.includes(index)) {
        className = 'bg-red-200 text-red-800'
      } else {
        className = 'text-green-600 bg-green-50'
      }
    } else if (index === currentIndex) {
      if (isWaitingForCorrectKey) {
        className = 'text-gray-900 bg-red-300 animate-pulse' // error state
      } else {
        className = 'text-gray-900 bg-blue-200' // cursor position
      }
    }    return (
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
      </div>      {/* Main Typing Area */}
      <div 
        ref={containerRef}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          bg-white p-4 md:p-6 rounded-lg cursor-text outline-none transition-all duration-300
          ${isFocused 
            ? 'border-2 border-blue-500 bg-blue-50/30 shadow-lg' 
            : 'border-2 border-gray-200 hover:border-gray-300'
          }
          ${isCompleted ? 'border-green-400 bg-green-50/30' : ''}
        `}
      >        {/* Instruction Text with smooth animation */}
        <div 
          className={`text-center overflow-hidden transition-all duration-200 ease-in-out ${
            !isActive && !isCompleted 
              ? 'max-h-0 opacity-0 mb-0' 
              : 'max-h-0 opacity-0 mb-0'
          }`}
        >
        </div>

        {/* Text Display */}
        <div className="text-lg md:text-xl leading-relaxed font-mono whitespace-normal break-words word-wrap">
          {text.split('').map((char, index) => renderCharacter(char, index))}
        </div>        {/* Status Messages */}
        <div className="mt-4 text-center">
          {isWaitingForCorrectKey && (
            <div className="text-red-600 text-sm animate-pulse bg-red-50 px-4 py-2 rounded-lg inline-block">
              <span className="mr-2">❌</span>
              正しいキーを入力してください: <kbd className="bg-red-200 px-2 py-1 rounded font-mono">{text[currentIndex]}</kbd>
            </div>
          )}
          
          {isCompleted && (
            <div className="text-green-600 font-semibold bg-green-50 px-6 py-3 rounded-lg inline-block animate-bounce">
              <span className="mr-2">🎉</span>
              完了！お疲れ様でした
              <span className="ml-2">✨</span>
            </div>
          )}
        </div>
      </div>        
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
        </div>      {/* Bottom Instruction Caption */}
      <div 
        className={`text-center overflow-hidden transition-all duration-200 ease-in-out ${
          !isActive && !isCompleted 
            ? 'max-h-20 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-gray-500 py-3 bg-gray-50/50 rounded-lg border border-gray-100">
          {!isFocused ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">👆</span>
              <p className="text-sm font-medium">上のタイピングエリアをクリックして開始</p>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl animate-pulse">⌨️</span>
              <p className="text-sm font-medium">準備完了！キーを押してタイピング開始...</p>
              <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse rounded-sm ml-1"></span>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="text-center text-sm text-gray-500">
        <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> to reset, <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+R</kbd> to restart</p>
      </div>
    </div>
  )
}
