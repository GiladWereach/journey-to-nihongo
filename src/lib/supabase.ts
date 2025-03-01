
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from the environment or use the ones from integrations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ggsmginwnfdvhnuqashe.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdnc21naW53bmZkdmhudXFhc2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3ODg3ODEsImV4cCI6MjA1NjM2NDc4MX0.ThmYE6uRPWID3eVhaZu84NBO7HLhzYjCgkctQYmqJH8";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
