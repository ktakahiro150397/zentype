-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your_jwt_secret';

-- Users table (handled by NextAuth.js adapter)
-- This will be created automatically by the SupabaseAdapter

-- Practice texts table
CREATE TABLE IF NOT EXISTS practice_texts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Session results table
CREATE TABLE IF NOT EXISTS session_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wpm INTEGER NOT NULL CHECK (wpm >= 0),
  accuracy DECIMAL(5,2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
  mistake_count INTEGER NOT NULL CHECK (mistake_count >= 0),
  duration INTEGER NOT NULL CHECK (duration > 0), -- in seconds
  text_id UUID NOT NULL REFERENCES practice_texts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE practice_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_results ENABLE ROW LEVEL SECURITY;

-- Practice texts are public (everyone can read)
CREATE POLICY "Practice texts are viewable by everyone" 
ON practice_texts FOR SELECT 
USING (true);

-- Session results are private (users can only see their own)
CREATE POLICY "Users can view own session results" 
ON session_results FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session results" 
ON session_results FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert some sample practice texts
INSERT INTO practice_texts (content, difficulty, category) VALUES
  ('The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.', 'easy', 'general'),
  ('Programming is not about typing, it''s about thinking. Good code is written to be read by humans, not just computers.', 'medium', 'programming'),
  ('Polymorphism, encapsulation, and inheritance are fundamental object-oriented programming concepts that enable flexible software architecture.', 'hard', 'programming'),
  ('In the beginning was the Word, and the Word was with God, and the Word was God. All things were made through Him.', 'medium', 'literature'),
  ('To be or not to be, that is the question: Whether ''tis nobler in the mind to suffer the slings and arrows of outrageous fortune.', 'hard', 'literature')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_session_results_user_id ON session_results(user_id);
CREATE INDEX IF NOT EXISTS idx_session_results_created_at ON session_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_practice_texts_difficulty ON practice_texts(difficulty);
CREATE INDEX IF NOT EXISTS idx_practice_texts_category ON practice_texts(category);
