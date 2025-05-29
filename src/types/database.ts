// Database types generated from Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          image?: string | null
          updated_at?: string
        }
      }
      practice_texts: {
        Row: {
          id: string
          content: string
          difficulty: 'easy' | 'medium' | 'hard'
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          difficulty: 'easy' | 'medium' | 'hard'
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          category?: string
        }
      }
      session_results: {
        Row: {
          id: string
          user_id: string
          wpm: number
          accuracy: number
          mistake_count: number
          duration: number
          text_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wpm: number
          accuracy: number
          mistake_count: number
          duration: number
          text_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wpm?: number
          accuracy?: number
          mistake_count?: number
          duration?: number
          text_id?: string
        }
      }
    }
  }
}

// Application types
export interface TypingSession {
  id: string
  text: string
  startTime: Date
  endTime?: Date
  currentIndex: number
  mistakes: number[]
  wpm: number
  accuracy: number
  isActive: boolean
}

export interface TypingStats {
  wpm: number
  accuracy: number
  mistakeCount: number
  duration: number
  charactersTyped: number
  correctCharacters: number
}

export interface UserProfile {
  id: string
  email: string
  name: string | null
  image: string | null
  createdAt: string
}

export interface SessionResult {
  id: string
  userId: string
  wpm: number
  accuracy: number
  mistakeCount: number
  duration: number
  textId: string
  createdAt: string
}

export interface PracticeText {
  id: string
  content: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  createdAt: string
}
