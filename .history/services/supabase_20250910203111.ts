import { createClient } from '@supabase/supabase-js'

// These should be environment variables in a real application
const supabaseUrl = 'https://wlveikyzyrkbuwxetamo.supabase.co'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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