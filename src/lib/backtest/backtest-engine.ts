import { supabase } from '../db/supabase';
import { ScoringEngine } from '../engine/scoring-engine';
import { ScoringWeights } from '../../types';

export class BacktestEngine {
  private scoringEngine: ScoringEngine;

  constructor(weights: ScoringWeights) {
    this.scoringEngine = new ScoringEngine(weights);
  }

  public async run(startDate: string, endDate: string) {
    const { data: races } = await supabase
      .from('race')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);
    
    let totalBet = 0;
    let totalPayout = 0;
    let winCount = 0;
    let betCount = 0;

    if (!races) return { stats: { betCount: 0, winCount: 0, winRate: 0, returnRate: 0, totalBet: 0, totalPayout: 0, profit: 0 } };

    for (const race of races) {
      const { data: runners } = await supabase
        .from('runner')
        .select('*, odds_snapshot(*)')
        .eq('race_id', race.race_id);

      if (!runners) continue;
      
      for (const runner of runners) {
        const oddsArray = runner.odds_snapshot as any[];
        const horseOdds = Array.isArray(oddsArray) ? oddsArray[0] : oddsArray;
        if (!horseOdds) continue;

        // 生成ダミー特徴量（実際は過去データから計算）
        const features: Partial<ScoringWeights> = {
          rank_last: Math.floor(Math.random() * 10) + 1,
          rank_avg_3: Math.floor(Math.random() * 10) + 1,
          jockey_win_rate: Math.random() * 0.2
        };

        const score = this.scoringEngine.calculateScore(features);
        const { decision } = this.scoringEngine.makeDecision(score, horseOdds.win_odds);

        if (decision === '買い') {
          betCount++;
          totalBet += 100; // 1単位 100円
          
          // 的中判定（ダミー：人気順が1位なら30%で的中とする）
          const isWin = horseOdds.popularity === 1 ? Math.random() < 0.3 : Math.random() < 0.1;
          if (isWin) {
            winCount++;
            const payout = Math.floor(100 * horseOdds.win_odds);
            totalPayout += payout;
          }
        }
      }
    }

    return {
      stats: {
        betCount,
        winCount,
        winRate: betCount > 0 ? (winCount / betCount) * 100 : 0,
        returnRate: totalBet > 0 ? (totalPayout / totalBet) * 100 : 0,
        totalBet,
        totalPayout,
        profit: totalPayout - totalBet
      }
    };
  }
}
