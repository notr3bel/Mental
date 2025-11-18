import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  full_name?: string;
  phone_number?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  date_of_birth?: string;
  bio?: string;
  location?: string;
  created_at: string;
  updated_at: string;
};

export type Assessment = {
  id: string;
  user_id: string;
  score: number;
  answers: Record<string, any>;
  recommendations: string;
  happiness_secret?: string;
  created_at: string;
};
