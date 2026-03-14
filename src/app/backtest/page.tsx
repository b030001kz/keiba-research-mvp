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
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 tracking-tight">
            バックテスト結果
          </h2>
          <p className="text-slate-400 mt-3 text-lg font-medium">
            設定されたパラメータに基づき、最新データでシミュレーションを実行しました。
          </p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-2xl flex items-center gap-3 font-black transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:-translate-y-1 active:scale-95 shrink-0">
          <Play fill="currentColor" size={20} /> RUN SIMULATION
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <StatCard title="的中率" value={`${result.stats.winRate.toFixed(1)}%`} icon={<Percent size={24} />} color="from-blue-400 to-cyan-300" iconBg="bg-blue-500/20" iconColor="text-blue-400" borderHover="hover:border-blue-500/50" />
        <StatCard title="回収率" value={`${result.stats.returnRate.toFixed(1)}%`} icon={<Activity size={24} />} color={result.stats.returnRate >= 100 ? "from-emerald-400 to-teal-300" : "from-amber-400 to-orange-400"} iconBg={result.stats.returnRate >= 100 ? "bg-emerald-500/20" : "bg-amber-500/20"} iconColor={result.stats.returnRate >= 100 ? "text-emerald-400" : "text-amber-400"} borderHover={result.stats.returnRate >= 100 ? "hover:border-emerald-500/50" : "hover:border-amber-500/50"} />
        <StatCard title="総的中数" value={result.stats.winCount} icon={<TrendingUp size={24} />} color="from-white to-slate-400" iconBg="bg-white/10" iconColor="text-white" borderHover="hover:border-white/30" />
        <StatCard title="純損益" value={`${result.stats.profit > 0 ? "+" : ""}${result.stats.profit.toLocaleString()}円`} icon={<Wallet size={24} />} color={result.stats.profit >= 0 ? "from-emerald-400 to-teal-300" : "from-red-400 to-rose-400"} iconBg={result.stats.profit >= 0 ? "bg-emerald-500/20" : "bg-red-500/20"} iconColor={result.stats.profit >= 0 ? "text-emerald-400" : "text-red-400"} borderHover={result.stats.profit >= 0 ? "hover:border-emerald-500/50" : "hover:border-red-500/50"} />
      </div>

      <div className="bg-[#0F172A]/70 backdrop-blur-2xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <h3 className="text-2xl font-black mb-8 text-white flex items-center gap-3 relative z-10">
          <div className="p-2 bg-blue-500/20 rounded-lg"><Receipt size={24} className="text-blue-400" /></div>
          取引サマリー詳細
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
          <div className="bg-[#1E293B]/50 p-6 rounded-2xl border border-white/5 space-y-2">
            <div className="text-slate-500 text-sm font-bold tracking-widest uppercase">総投資額</div>
            <div className="text-3xl font-black text-white">{result.stats.totalBet.toLocaleString()}<span className="text-base text-slate-500 ml-1 font-medium">円</span></div>
          </div>
          <div className="bg-[#1E293B]/50 p-6 rounded-2xl border border-emerald-500/20 space-y-2 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <div className="text-emerald-500/80 text-sm font-bold tracking-widest uppercase">総払戻金</div>
            <div className="text-3xl font-black text-emerald-400">{result.stats.totalPayout.toLocaleString()}<span className="text-base text-emerald-500/60 ml-1 font-medium">円</span></div>
          </div>
          <div className="bg-[#1E293B]/50 p-6 rounded-2xl border border-white/5 space-y-2">
            <div className="text-slate-500 text-sm font-bold tracking-widest uppercase">買い判定件数</div>
            <div className="text-3xl font-black text-white">{result.stats.betCount}<span className="text-base text-slate-500 ml-1 font-medium">件</span></div>
          </div>
        </div>
      </div>

      <div className="bg-blue-950/30 border border-blue-500/20 p-6 rounded-2xl flex gap-4 items-start relative overflow-hidden shadow-inner">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
        <AlertCircle className="text-blue-400 shrink-0 mt-1" size={24} strokeWidth={2.5} />
        <div className="text-sm text-slate-300 leading-relaxed font-medium">
          <strong className="text-blue-400 text-base block mb-2 tracking-tight">バックテストに関する注意</strong>
          この結果はシミュレーション用ダミーデータに基づく推定値です。ルールの微調整により回収率は変動します。
          特に本番データでは「中間のオッズ変動」や「締切直前の購入」によるバイアスに注意してください。
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, iconBg, iconColor, borderHover }: any) {
  return (
    <div className={`bg-[#0F172A]/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl transition-all ${borderHover} group relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${iconBg} rounded-full blur-2xl -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <span className="text-slate-400 text-sm font-bold tracking-widest uppercase">{title}</span>
        <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shadow-inner border border-white/5`}>{icon}</div>
      </div>
      <div className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br ${color} relative z-10`}>{value}</div>
    </div>
  );
}

function Activity({ size }: { size?: number }) {
  return <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
}
