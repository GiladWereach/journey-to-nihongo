
-- Create user_learning_streaks table to track daily learning activity
CREATE TABLE IF NOT EXISTS public.user_learning_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  activity_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, date)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_learning_streaks_user_id ON public.user_learning_streaks (user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_streaks_date ON public.user_learning_streaks (date);

-- Add RLS policies
ALTER TABLE public.user_learning_streaks ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own streak data
CREATE POLICY "Users can view their own streak data"
  ON public.user_learning_streaks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streak data"
  ON public.user_learning_streaks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streak data"
  ON public.user_learning_streaks
  FOR UPDATE
  USING (auth.uid() = user_id);
