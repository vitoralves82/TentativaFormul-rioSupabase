import { createClient } from '@supabase/supabase-js'

// These should be environment variables in a real application
const supabaseUrl = 'https://wlveikyzyrkbuwxetamo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsdmVpa3l6eXJrYnV3eGV0YW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjc2NzAsImV4cCI6MjA3Mjg0MzY3MH0.YPCcQc6wqDKTv1V_gmUb9TvUmTxgjgXmn6nqOWwhCY0'

// Use .env.local (Vite) com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// Type definition for Answer
export type Answer = {
  question: string;
  answer: string;
};

// Async function to submit answers using Supabase Functions
export async function submitAnswers(submissionId: string, answers: Answer[]) {
  const { data, error } = await supabase.functions.invoke('submit-intake', {
    body: { mode: 'answers', submissionId, answers },
  });
  if (error) throw error;
  return data;
}