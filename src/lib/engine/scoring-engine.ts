import { ScoringWeights, PredictionItem } from '../../types';

export class ScoringEngine {
  private weights: ScoringWeights;
  private thresholds = {
    buy_score_min: 70.0,
    value_odds_ratio: 1.2,
    hold_score_min: 50.0
  };

  constructor(weights: ScoringWeights) {
    this.weights = weights;
  }

  public calculateScore(features: Partial<ScoringWeights>): number {
    let score = 0;
    for (const key in this.weights) {
      const weight = this.weights[key as keyof ScoringWeights];
      const val = (features[key as keyof ScoringWeights] as number) || 0;
      // シンプルな線形加算（実際には正規化が必要）
      score += val * weight;
    }
    return score;
  }

  public makeDecision(score: number, winOdds: number): { decision: string; reason: string } {
    const prob = score / 100.0; // ダミーの確率計算
    const expectedValue = prob * winOdds;

    if (score >= this.thresholds.buy_score_min && expectedValue >= this.thresholds.value_odds_ratio) {
      return {
        decision: '買い',
        reason: `スコア(${score.toFixed(1)})が高く、期待値(${expectedValue.toFixed(2)})も十分です。`
      };
    } else if (score >= this.thresholds.hold_score_min) {
      return {
        decision: '保留',
        reason: `スコア(${score.toFixed(1)})は一定基準を超えていますが、妙味（期待値 ${expectedValue.toFixed(2)}）が足りません。`
      };
    } else {
      return {
        decision: '見送り',
        reason: `スコア(${score.toFixed(1)})が購入基準に達していません。`
      };
    }
  }
}
