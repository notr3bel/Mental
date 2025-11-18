/*
  # Mental Health Companion Database Schema

  ## Overview
  This migration creates the database structure for an AI mental health companion application
  that assesses users' mental health through standardized questionnaires and provides
  personalized recommendations.

  ## New Tables
  
  ### `profiles`
  User profile information linked to auth.users
  - `id` (uuid, primary key) - References auth.users.id
  - `username` (text, unique) - User's chosen username
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp
  
  ### `assessments`
  Mental health assessment records
  - `id` (uuid, primary key) - Unique assessment identifier
  - `user_id` (uuid, foreign key) - References profiles.id
  - `score` (integer) - Mental health score (1-10)
  - `answers` (jsonb) - User's responses to assessment questions
  - `recommendations` (text) - AI-generated recommendations
  - `happiness_secret` (text, nullable) - User's shared happiness secret (for scores > 8)
  - `created_at` (timestamptz) - Assessment completion timestamp
  
  ## Security
  
  ### Row Level Security (RLS)
  All tables have RLS enabled with the following policies:
  
  #### `profiles` table policies:
  1. Users can view their own profile
  2. Users can insert their own profile during signup
  3. Users can update their own profile
  
  #### `assessments` table policies:
  1. Users can view only their own assessments
  2. Users can insert their own assessments
  3. Users can update their own assessments (for adding happiness secrets)
  
  ## Important Notes
  - All user data is protected by RLS and only accessible to the authenticated user
  - Passwords are handled by Supabase Auth (not stored in these tables)
  - Assessment answers are stored as JSONB for flexibility
  - Scores range from 1-10 with different recommendation categories
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 1 AND score <= 10),
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommendations text NOT NULL DEFAULT '',
  happiness_secret text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS assessments_user_id_idx ON assessments(user_id);
CREATE INDEX IF NOT EXISTS assessments_created_at_idx ON assessments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Assessments table policies
CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own assessments"
  ON assessments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
