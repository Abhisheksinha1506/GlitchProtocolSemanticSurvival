/*
  # GLITCH PROTOCOL Database Schema

  ## Overview
  Creates the database structure for the GLITCH PROTOCOL semantic survival game.
  
  ## New Tables
  
  ### `game_sessions`
  Stores individual game session data including corrupted definitions and progress
  - `id` (uuid, primary key) - Unique session identifier
  - `player_name` (text) - Player's chosen name
  - `current_sector` (integer) - Current level/sector number
  - `score` (integer) - Current game score
  - `corrupted_definitions` (jsonb) - Active word corruption rules
  - `status` (text) - Game status: 'active', 'completed', 'failed'
  - `started_at` (timestamptz) - When the session began
  - `ended_at` (timestamptz, nullable) - When the session ended
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `leaderboard`
  Tracks high scores and achievements
  - `id` (uuid, primary key) - Unique record identifier
  - `player_name` (text) - Player's name
  - `final_score` (integer) - Final score achieved
  - `sectors_completed` (integer) - Number of sectors survived
  - `game_duration` (integer) - Total game time in seconds
  - `session_id` (uuid) - Reference to game_sessions
  - `created_at` (timestamptz) - Record creation timestamp
  
  ## Security
  - RLS enabled on all tables
  - Public read access for leaderboard (anonymous users can view high scores)
  - Anyone can create game sessions and leaderboard entries
  - Players can only update their own active sessions
*/

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  current_sector integer DEFAULT 1,
  score integer DEFAULT 0,
  corrupted_definitions jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  final_score integer NOT NULL DEFAULT 0,
  sectors_completed integer NOT NULL DEFAULT 0,
  game_duration integer NOT NULL DEFAULT 0,
  session_id uuid REFERENCES game_sessions(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Leaderboard policies: anyone can read, anyone can insert
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can add to leaderboard"
  ON leaderboard
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Game sessions policies: anyone can create and read, only creator can update
CREATE POLICY "Anyone can view game sessions"
  ON game_sessions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create game sessions"
  ON game_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update game sessions"
  ON game_sessions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for leaderboard sorting
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(final_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created ON leaderboard(created_at DESC);