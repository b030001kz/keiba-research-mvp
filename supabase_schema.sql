-- Supabase (PostgreSQL) Schema for keiba-research-mvp

-- 1. race table
CREATE TABLE IF NOT EXISTS race (
  race_id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  venue TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  race_name TEXT,
  distance INTEGER,
  track_type TEXT,
  weather TEXT,
  track_condition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. horse table
CREATE TABLE IF NOT EXISTS horse (
  horse_id TEXT PRIMARY KEY,
  horse_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. runner table
CREATE TABLE IF NOT EXISTS runner (
  race_id TEXT REFERENCES race(race_id) ON DELETE CASCADE,
  horse_id TEXT REFERENCES horse(horse_id),
  bracket_number INTEGER,
  horse_number INTEGER,
  jockey_name TEXT,
  trainer_name TEXT,
  PRIMARY KEY (race_id, horse_number),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. odds_snapshot table
CREATE TABLE IF NOT EXISTS odds_snapshot (
  id BIGSERIAL PRIMARY KEY,
  race_id TEXT REFERENCES race(race_id) ON DELETE CASCADE,
  horse_number INTEGER,
  win_odds REAL,
  popularity INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. feature_snapshot table
CREATE TABLE IF NOT EXISTS feature_snapshot (
  race_id TEXT REFERENCES race(race_id) ON DELETE CASCADE,
  horse_number INTEGER,
  feature_json JSONB,
  PRIMARY KEY (race_id, horse_number),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. prediction_run table
CREATE TABLE IF NOT EXISTS prediction_run (
  run_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk User ID
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  config_json JSONB
);

-- 7. prediction_item table
CREATE TABLE IF NOT EXISTS prediction_item (
  run_id UUID REFERENCES prediction_run(run_id) ON DELETE CASCADE,
  race_id TEXT,
  horse_number INTEGER,
  score REAL,
  decision TEXT,
  reason TEXT,
  PRIMARY KEY (run_id, race_id, horse_number)
);

-- 8. race_result table
CREATE TABLE IF NOT EXISTS race_result (
  race_id TEXT PRIMARY KEY REFERENCES race(race_id) ON DELETE CASCADE,
  horse_number INTEGER,
  payout INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. bankroll_log table
CREATE TABLE IF NOT EXISTS bankroll_log (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk User ID
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  balance INTEGER,
  pnl INTEGER
);

-- RLS (Row Level Security) - 必要に応じて有効化
-- ALTER TABLE prediction_run ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can only see their own predictions" ON prediction_run FOR ALL USING (auth.uid() = user_id);
