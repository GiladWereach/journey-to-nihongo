
-- Table for tracking user progress with kana characters
CREATE TABLE IF NOT EXISTS public.user_kana_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  character_id TEXT NOT NULL,
  proficiency INTEGER NOT NULL DEFAULT 0,
  last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_due TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mistake_count INTEGER NOT NULL DEFAULT 0,
  total_practice_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, character_id)
);

-- Table for kana learning sessions
CREATE TABLE IF NOT EXISTS public.kana_learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  kana_type TEXT NOT NULL CHECK (kana_type IN ('hiragana', 'katakana', 'both')),
  characters_studied TEXT[] NOT NULL DEFAULT '{}',
  accuracy INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for these tables
ALTER TABLE public.user_kana_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kana_learning_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Users can view their own kana progress"
ON public.user_kana_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own kana progress"
ON public.user_kana_progress
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own kana progress"
ON public.user_kana_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own learning sessions"
ON public.kana_learning_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning sessions"
ON public.kana_learning_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning sessions"
ON public.kana_learning_sessions
FOR UPDATE
USING (auth.uid() = user_id);
