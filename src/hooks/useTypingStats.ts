'use client'

import { useState, useEffect, useCallback } from 'react'
import { TypingStats } from '@/types/database'

interface UseTypingStatsProps {
  text: string
  currentInput: string
  startTime: Date | null
  mistakes: number[]
}

export function useTypingStats({ text, currentInput, startTime, mistakes }: UseTypingStatsProps) {
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    mistakeCount: 0,
    duration: 0,
    charactersTyped: 0,
    correctCharacters: 0,
  })

  const calculateStats = useCallback(() => {
    if (!startTime || currentInput.length === 0) {
      return {
        wpm: 0,
        accuracy: 100,
        mistakeCount: 0,
        duration: 0,
        charactersTyped: 0,
        correctCharacters: 0,
      }
    }

    const now = new Date()
    const durationMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60)
    const durationSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000)
    
    const charactersTyped = currentInput.length
    const mistakeCount = mistakes.length
    
    // Calculate correct characters
    let correctCharacters = 0
    for (let i = 0; i < Math.min(currentInput.length, text.length); i++) {
      if (currentInput[i] === text[i] && !mistakes.includes(i)) {
        correctCharacters++
      }
    }

    // Calculate WPM (Words Per Minute)
    // Standard: 5 characters = 1 word
    const wordsTyped = correctCharacters / 5
    const wpm = durationMinutes > 0 ? Math.round(wordsTyped / durationMinutes) : 0

    // Calculate accuracy
    const accuracy = charactersTyped > 0 ? Math.round((correctCharacters / charactersTyped) * 100) : 100

    return {
      wpm,
      accuracy,
      mistakeCount,
      duration: durationSeconds,
      charactersTyped,
      correctCharacters,
    }
  }, [text, currentInput, startTime, mistakes])

  useEffect(() => {
    const newStats = calculateStats()
    setStats(newStats)
  }, [calculateStats])

  return stats
}
