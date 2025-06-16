/*
  # Add Referral and Token System

  1. New Tables
    - `user_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles.id)
      - `balance` (integer, current token balance)
      - `total_earned` (integer, total tokens earned)
      - `total_spent` (integer, total tokens spent)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `token_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles.id)
      - `transaction_type` (enum: 'earned', 'spent', 'purchased', 'bonus')
      - `amount` (integer, positive for earned/purchased, negative for spent)
      - `source` (text, e.g., 'referral', 'voice_command', 'purchase', 'signup_bonus')
      - `reference_id` (uuid, nullable, reference to related record)
      - `description` (text, human-readable description)
      - `created_at` (timestamp)
    
    - `referral_codes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles.id)
      - `code` (text, unique referral code)
      - `uses_count` (integer, number of times used)
      - `max_uses` (integer, nullable, maximum uses allowed)
      - `is_active` (boolean, whether code is active)
      - `created_at` (timestamp)
    
    - `referrals`
      - `id` (uuid, primary key)
      - `referrer_user_id` (uuid, foreign key to user_profiles.id)
      - `referred_user_id` (uuid, foreign key to user_profiles.id)
      - `referral_code_id` (uuid, foreign key to referral_codes.id)
      - `status` (enum: 'pending', 'completed', 'rewarded')
      - `reward_amount` (integer, tokens awarded to referrer)
      - `bonus_amount` (integer, tokens awarded to referred user)
      - `completed_at` (timestamp, when referral was completed)
      - `rewarded_at` (timestamp, when rewards were given)
      - `created_at` (timestamp)

  2. Modifications to Existing Tables
    - Add `referral_code` column to `user_profiles`
    - Add `referred_by_user_id` column to `user_profiles`

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for user access
    - Add indexes for performance

  4. Functions
    - Function to generate unique referral codes
    - Function to process token transactions
    - Function to handle referral rewards
*/

-- Create enums for token transactions and referral status
CREATE TYPE token_transaction_type AS ENUM ('earned', 'spent', 'purchased', 'bonus');
CREATE TYPE referral_status AS ENUM ('pending', 'completed', 'rewarded');

-- Add columns to existing user_profiles table
DO $$
BEGIN
  -- Add referral_code column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN referral_code text UNIQUE;
  END IF;

  -- Add referred_by_user_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'referred_by_user_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN referred_by_user_id uuid REFERENCES user_profiles(id);
  END IF;
END $$;

-- Create user_tokens table
CREATE TABLE IF NOT EXISTS user_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  balance integer NOT NULL DEFAULT 1000,
  total_earned integer NOT NULL DEFAULT 1000,
  total_spent integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create token_transactions table
CREATE TABLE IF NOT EXISTS token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  transaction_type token_transaction_type NOT NULL,
  amount integer NOT NULL,
  source text NOT NULL,
  reference_id uuid,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create referral_codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  uses_count integer NOT NULL DEFAULT 0,
  max_uses integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  referral_code_id uuid NOT NULL REFERENCES referral_codes(id),
  status referral_status NOT NULL DEFAULT 'pending',
  reward_amount integer NOT NULL DEFAULT 500,
  bonus_amount integer NOT NULL DEFAULT 200,
  completed_at timestamptz,
  rewarded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referred_user_id) -- Each user can only be referred once
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_created_at ON token_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_user_id ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON user_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referred_by ON user_profiles(referred_by_user_id);

-- Enable RLS on all new tables
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_tokens
CREATE POLICY "Users can read own token balance"
  ON user_tokens
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own token balance"
  ON user_tokens
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for token_transactions
CREATE POLICY "Users can read own token transactions"
  ON token_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert token transactions"
  ON token_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for referral_codes
CREATE POLICY "Users can read own referral codes"
  ON referral_codes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own referral codes"
  ON referral_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own referral codes"
  ON referral_codes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for referrals
CREATE POLICY "Users can read referrals they're involved in"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_user_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "System can insert referrals"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Allow system to create referrals

CREATE POLICY "System can update referrals"
  ON referrals
  FOR UPDATE
  TO authenticated
  USING (true); -- Allow system to update referral status

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate a random 8-character code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE referral_codes.code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

-- Function to create user tokens and referral code on user creation
CREATE OR REPLACE FUNCTION create_user_tokens_and_referral()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ref_code text;
BEGIN
  -- Generate unique referral code
  ref_code := generate_referral_code();
  
  -- Update user profile with referral code
  UPDATE user_profiles 
  SET referral_code = ref_code 
  WHERE id = NEW.id;
  
  -- Create user tokens record
  INSERT INTO user_tokens (user_id, balance, total_earned, total_spent)
  VALUES (NEW.id, 1000, 1000, 0);
  
  -- Create referral code record
  INSERT INTO referral_codes (user_id, code)
  VALUES (NEW.id, ref_code);
  
  -- Create initial token transaction
  INSERT INTO token_transactions (
    user_id, 
    transaction_type, 
    amount, 
    source, 
    description
  )
  VALUES (
    NEW.id, 
    'bonus', 
    1000, 
    'signup_bonus', 
    'Welcome bonus for new user'
  );
  
  RETURN NEW;
END;
$$;

-- Function to process token spending
CREATE OR REPLACE FUNCTION spend_tokens(
  p_user_id uuid,
  p_amount integer,
  p_source text,
  p_description text,
  p_reference_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance integer;
BEGIN
  -- Get current balance
  SELECT balance INTO current_balance
  FROM user_tokens
  WHERE user_id = p_user_id;
  
  -- Check if user has enough tokens
  IF current_balance < p_amount THEN
    RETURN false;
  END IF;
  
  -- Update token balance
  UPDATE user_tokens
  SET 
    balance = balance - p_amount,
    total_spent = total_spent + p_amount,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Record transaction
  INSERT INTO token_transactions (
    user_id,
    transaction_type,
    amount,
    source,
    reference_id,
    description
  )
  VALUES (
    p_user_id,
    'spent',
    -p_amount,
    p_source,
    p_reference_id,
    p_description
  );
  
  RETURN true;
END;
$$;

-- Function to award tokens
CREATE OR REPLACE FUNCTION award_tokens(
  p_user_id uuid,
  p_amount integer,
  p_transaction_type token_transaction_type,
  p_source text,
  p_description text,
  p_reference_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update token balance
  UPDATE user_tokens
  SET 
    balance = balance + p_amount,
    total_earned = total_earned + p_amount,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Record transaction
  INSERT INTO token_transactions (
    user_id,
    transaction_type,
    amount,
    source,
    reference_id,
    description
  )
  VALUES (
    p_user_id,
    p_transaction_type,
    p_amount,
    p_source,
    p_reference_id,
    p_description
  );
END;
$$;

-- Function to process referral
CREATE OR REPLACE FUNCTION process_referral(
  p_referral_code text,
  p_referred_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  referrer_id uuid;
  code_id uuid;
  referral_id uuid;
BEGIN
  -- Get referrer info
  SELECT rc.user_id, rc.id INTO referrer_id, code_id
  FROM referral_codes rc
  WHERE rc.code = p_referral_code 
    AND rc.is_active = true
    AND (rc.max_uses IS NULL OR rc.uses_count < rc.max_uses);
  
  -- Check if referral code exists and is valid
  IF referrer_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user is trying to refer themselves
  IF referrer_id = p_referred_user_id THEN
    RETURN false;
  END IF;
  
  -- Update user profile with referrer
  UPDATE user_profiles
  SET referred_by_user_id = referrer_id
  WHERE id = p_referred_user_id;
  
  -- Create referral record
  INSERT INTO referrals (
    referrer_user_id,
    referred_user_id,
    referral_code_id,
    status
  )
  VALUES (
    referrer_id,
    p_referred_user_id,
    code_id,
    'completed'
  )
  RETURNING id INTO referral_id;
  
  -- Update referral code usage count
  UPDATE referral_codes
  SET uses_count = uses_count + 1
  WHERE id = code_id;
  
  -- Award tokens to referrer
  PERFORM award_tokens(
    referrer_id,
    500,
    'earned',
    'referral',
    'Referral reward for bringing new user',
    referral_id
  );
  
  -- Award bonus tokens to referred user
  PERFORM award_tokens(
    p_referred_user_id,
    200,
    'bonus',
    'referral_bonus',
    'Bonus for joining through referral',
    referral_id
  );
  
  -- Update referral status
  UPDATE referrals
  SET 
    status = 'rewarded',
    completed_at = now(),
    rewarded_at = now()
  WHERE id = referral_id;
  
  RETURN true;
END;
$$;

-- Create trigger to automatically create tokens and referral code for new users
DROP TRIGGER IF EXISTS create_user_tokens_trigger ON user_profiles;
CREATE TRIGGER create_user_tokens_trigger
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_tokens_and_referral();

-- Create trigger to update updated_at on user_tokens
CREATE OR REPLACE FUNCTION update_user_tokens_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_user_tokens_updated_at_trigger ON user_tokens;
CREATE TRIGGER update_user_tokens_updated_at_trigger
  BEFORE UPDATE ON user_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_user_tokens_updated_at();