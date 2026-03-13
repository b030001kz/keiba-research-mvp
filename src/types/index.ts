export type Race = {
  race_id: string;
  date: string;
  venue: string;
  race_number: number;
  race_name: string;
  distance: number;
  track_type: string;
  weather: string;
  track_condition: string;
};

export type Horse = {
  horse_id: string;
  horse_name: string;
};

export type Runner = {
  race_id: string;
  horse_id: string;
  bracket_number: number;
  horse_number: number;
  jockey_name: string;
  trainer_name: string;
};

export type Odds = {
  race_id: string;
  horse_number: number;
  win_odds: number;
  popularity: number;
  timestamp: string;
};

export type PredictionItem = {
  run_id: string;
  race_id: string;
  horse_number: number;
  score: number;
  decision: '買い' | '見送り' | '保留';
  reason: string;
};

export type ScoringWeights = {
  rank_last: number;
  diff_last: number;
  rank_avg_3: number;
  diff_avg_3: number;
  agari_rank: number;
  distance_suit: number;
  venue_suit: number;
  track_suit: number;
  jockey_win_rate: number;
  trainer_win_rate: number;
  bracket_fav: number;
  position_fav: number;
};
