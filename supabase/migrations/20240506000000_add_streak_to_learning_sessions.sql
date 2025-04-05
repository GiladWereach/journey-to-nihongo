
-- Add streak tracking to kana_learning_sessions table
ALTER TABLE IF EXISTS public.kana_learning_sessions 
ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
