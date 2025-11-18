-- Add additional profile fields to the profiles table
-- This migration adds fields for personal details that users can edit

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS location text;

-- Add check constraint for gender that allows NULL values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_gender_check'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_gender_check 
    CHECK (gender IS NULL OR gender IN ('Male', 'Female', 'Other', 'Prefer not to say'));
  END IF;
END $$;

-- Add index on phone_number for potential lookups (if needed)
CREATE INDEX IF NOT EXISTS profiles_phone_number_idx ON profiles(phone_number) WHERE phone_number IS NOT NULL;

-- Add comment to document the new fields
COMMENT ON COLUMN profiles.full_name IS 'User''s full name';
COMMENT ON COLUMN profiles.phone_number IS 'User''s phone number';
COMMENT ON COLUMN profiles.gender IS 'User''s gender identity';
COMMENT ON COLUMN profiles.date_of_birth IS 'User''s date of birth';
COMMENT ON COLUMN profiles.bio IS 'User''s bio or personal description';
COMMENT ON COLUMN profiles.location IS 'User''s location (city, state, etc.)';
