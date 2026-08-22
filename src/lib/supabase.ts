import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://niealkjjqlcyutnjuvkf.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pZWFsa2pqcWxjeXV0bmp1dmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTczNTAsImV4cCI6MjEwMjg3MzM1MH0.tcvZ7CKZqan9miRHvcsvV1WIZlfrFYCM2xmBHQg-Log";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
