import { BacktestEngine } from '@/lib/backtest/backtest-engine';
import { ScoringWeights } from '@/types';
import { Play, TrendingUp, Wallet, Receipt, Percent, AlertCircle } from 'lucide-react';

export default async function BacktestPage() {
  const weights: ScoringWeights = {
    rank_last: 2.0, diff_last: 1.5, rank_avg_3: 3.0, diff_avg_3: 2.5,
    agari_rank: 2.0, distance_suit: 1.5, venue_suit: 1.0, track_suit: 1.5,
    jockey_win_rate: 1.0, trainer_win_rate: 0.8, bracket_fav: 0.5, position_fav: 1.0
  };

  const engine = new BacktestEngine(weights);
  const result = await engine.run('2026-03-01', '2026-03-31');

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">バックテスト結果</h2>
          <p className="text-slate-400 mt-2">設定されたパラメータに基づき、3月分のデータをシミュレーションしました。</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg flex items-center gap-2 font-bold transition-all shadow-lg active:scale-95">
          <Play fill="currentColor" size={20} /> シミュレーション実行
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="的中率" value={`${result.stats.winRate.toFixed(1)}%`} icon={<Percent />} color="text-blue-400" />
        <StatCard title="回収率" value={`${result.stats.returnRate.toFixed(1)}%`} icon={<Activity />} color={result.stats.returnRate >= 100 ? "text-emerald-400" : "text-amber-400"} />
        <StatCard title="総的中数" value={result.stats.winCount} icon={<TrendingUp />} color="text-slate-100" />
        <StatCard title="純損益" value={`${result.stats.profit > 0 ? "+" : ""}${result.stats.profit}円`} icon={<Wallet />} color={result.stats.profit >= 0 ? "text-emerald-400" : "text-red-400"} />
      </div>

      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Receipt size={24} className="text-blue-400" /> 詳細データ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-slate-500 text-sm">総投資額</div>
            <div className="text-2xl font-bold">{result.stats.totalBet}円</div>
          </div>
          <div className="space-y-1 text-emerald-400">
            <div className="text-slate-500 text-sm">総払戻金</div>
            <div className="text-2xl font-bold">{result.stats.totalPayout}円</div>
          </div>
          <div className="space-y-1">
            <div className="text-slate-500 text-sm">買い判定件数</div>
            <div className="text-2xl font-bold">{result.stats.betCount}件</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl flex gap-4 items-start">
        <AlertCircle className="text-blue-400 shrink-0" />
        <div className="text-sm text-slate-300 leading-relaxed">
          <strong className="text-blue-400 block mb-1">バックテストに関する注意</strong>
          この結果はシミュレーション用ダミーデータに基づく推定値です。ルールの微調整により回収率は変動します。
          特に本番データでは「中間のオッズ変動」や「締切直前の購入」によるバイアスに注意してください。
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-400 text-sm">{title}</span>
        <div className="text-slate-500">{icon}</div>
      </div>
      <div className={`text-3xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function Activity({ size }: { size?: number }) {
  return <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
}
