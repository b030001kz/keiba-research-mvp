import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'keiba.db');
const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS race (
      race_id TEXT PRIMARY KEY,
      date TEXT,
      venue TEXT,
      race_number INTEGER,
      race_name TEXT,
      distance INTEGER,
      track_type TEXT,
      weather TEXT,
      track_condition TEXT
    );

    CREATE TABLE IF NOT EXISTS horse (
      horse_id TEXT PRIMARY KEY,
      horse_name TEXT
    );

    CREATE TABLE IF NOT EXISTS runner (
      race_id TEXT,
      horse_id TEXT,
      bracket_number INTEGER,
      horse_number INTEGER,
      jockey_name TEXT,
      trainer_name TEXT,
      PRIMARY KEY (race_id, horse_number),
      FOREIGN KEY (race_id) REFERENCES race (race_id),
      FOREIGN KEY (horse_id) REFERENCES horse (horse_id)
    );

    CREATE TABLE IF NOT EXISTS odds_snapshot (
      race_id TEXT,
      horse_number INTEGER,
      win_odds REAL,
      popularity INTEGER,
      timestamp TEXT,
      PRIMARY KEY (race_id, horse_number, timestamp),
      FOREIGN KEY (race_id) REFERENCES race (race_id)
    );

    CREATE TABLE IF NOT EXISTS feature_snapshot (
      race_id TEXT,
      horse_number INTEGER,
      feature_json TEXT,
      PRIMARY KEY (race_id, horse_number),
      FOREIGN KEY (race_id) REFERENCES race (race_id)
    );

    CREATE TABLE IF NOT EXISTS prediction_run (
      run_id TEXT PRIMARY KEY,
      timestamp TEXT,
      config_json TEXT
    );

    CREATE TABLE IF NOT EXISTS prediction_item (
      run_id TEXT,
      race_id TEXT,
      horse_number INTEGER,
      score REAL,
      decision TEXT,
      reason TEXT,
      PRIMARY KEY (run_id, race_id, horse_number),
      FOREIGN KEY (run_id) REFERENCES prediction_run (run_id)
    );

    CREATE TABLE IF NOT EXISTS race_result (
      race_id TEXT,
      horse_number INTEGER,
      payout INTEGER,
      PRIMARY KEY (race_id),
      FOREIGN KEY (race_id) REFERENCES race (race_id)
    );

    CREATE TABLE IF NOT EXISTS bankroll_log (
      timestamp TEXT PRIMARY KEY,
      balance INTEGER,
      pnl INTEGER
    );
  `);
}

export default db;
export { db };
