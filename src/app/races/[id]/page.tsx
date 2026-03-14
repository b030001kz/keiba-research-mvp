import { supabase } from '@/lib/db/supabase';
import { ScoringEngine } from '@/lib/engine/scoring-engine';
import { ScoringWeights } from '@/types';
import { ChevronLeft, Info, ShoppingCart, Ban, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function RaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: race } = await supabase
    .from('race')
    .select('*')
    .eq('race_id', id)
    .single();

  const { data: runners } = await supabase
    .from('runner')
    .select('*, odds_snapshot(*)')
    .eq('race_id', id)
    .order('horse_number', { ascending: true });

  if (!race) return <div>Race not found</div>;

  // MVP固定の重み（本来は設定UIから取得）
  const weights: ScoringWeights = {
    rank_last: 2.0, diff_last: 1.5, rank_avg_3: 3.0, diff_avg_3: 2.5,
    agari_rank: 2.0, distance_suit: 1.5, venue_suit: 1.0, track_suit: 1.5,
    jockey_win_rate: 1.0, trainer_win_rate: 0.8, bracket_fav: 0.5, position_fav: 1.0
  };

  const engine = new ScoringEngine(weights);

  const runnerResults = (runners || []).map(runner => {
    // 実際の実装では最新のオッズを取得するロジックが必要
    const latestOdds = Array.isArray(runner.odds_snapshot) ? runner.odds_snapshot[0] : runner.odds_snapshot;
    
    // ダミーの計算済み特徴量
    const features = {
      rank_last: Math.floor(Math.random() * 8) + 1,
      rank_avg_3: Math.floor(Math.random() * 8) + 1,
      jockey_win_rate: 0.1 + Math.random() * 0.1
    };
    const score = engine.calculateScore(features);
    const { decision, reason } = engine.makeDecision(score, latestOdds?.win_odds || 0);
    return { ...runner, win_odds: latestOdds?.win_odds, popularity: latestOdds?.popularity, score, decision, reason };
  });

  return (
    <div className="space-y-8 relative">
      {/* Background glow for the header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <header className="relative z-10">
        <Link href="/races" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">
          <ChevronLeft size={16} /> レース一覧に戻る
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-sm font-bold tracking-widest border border-blue-500/20">{race.date}</span>
              <span className="text-slate-300 font-medium tracking-wide">{race.venue} {race.race_number}R</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight leading-tight">
              {race.race_name}
            </h2>
          </div>
          <div className="bg-[#0F172A]/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shrink-0 shadow-xl">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">条件</span>
              <span className="text-slate-200 font-semibold">{race.distance}m / {race.track_type}</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">馬場</span>
              <span className="text-emerald-400 font-semibold">{race.track_condition}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-[#0F172A]/70 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/40 text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-white/10">
                <th className="px-6 py-5 pl-8 w-24">馬番</th>
                <th className="px-6 py-5">馬名 / 騎手 / 厩舎</th>
                <th className="px-6 py-5">オッズ / 人気</th>
                <th className="px-6 py-5 text-center">期待値スコア</th>
                <th className="px-6 py-5">システム判定</th>
                <th className="px-6 py-5 w-64 text-right pr-8">判定理由</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {runnerResults.map((r) => {
                const isBuy = r.decision === '買い';
                const isHold = r.decision === '保留';
                return (
                  <tr key={r.horse_number} className={`hover:bg-white/[0.02] transition-colors ${
                    isBuy ? 'bg-blue-500/[0.03] hover:bg-blue-500/[0.05]' : ''
                  }`}>
                    <td className="px-6 py-5 pl-8">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-inner border ${
                        r.bracket_number === 1 ? 'bg-white text-slate-900 border-slate-300' : 
                        r.bracket_number === 2 ? 'bg-slate-900 text-white border-slate-700' :
                        r.bracket_number === 3 ? 'bg-red-500 text-white border-red-600' :
                        r.bracket_number === 4 ? 'bg-blue-500 text-white border-blue-600' :
                        r.bracket_number === 5 ? 'bg-yellow-400 text-slate-900 border-yellow-500' :
                        r.bracket_number === 6 ? 'bg-green-500 text-white border-green-600' :
                        r.bracket_number === 7 ? 'bg-orange-500 text-white border-orange-600' : 'bg-pink-500 text-white border-pink-600'
                      }`}>
                        {r.horse_number}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-200 text-lg tracking-tight">DummyHorse_{r.horse_id}</div>
                      <div className="text-sm text-slate-500 mt-1 font-medium">{r.jockey_name} / {r.trainer_name}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xl font-black text-white">{r.win_odds?.toFixed(1) || '-'}</div>
                      <div className="text-xs text-slate-500 font-bold tracking-wider mt-1">{r.popularity}人気</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={`text-2xl font-black ${
                        r.score >= 70 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
                        r.score >= 50 ? 'text-amber-400' : 'text-slate-600'
                      }`}>
                        {r.score.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {isBuy ? (
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 shadow-inner">
                          <ShoppingCart size={16} strokeWidth={2.5} /> 買い
                        </span>
                      ) : isHold ? (
                        <span className="inline-flex items-center gap-2 text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 shadow-inner">
                          <Clock size={16} strokeWidth={2.5} /> 保留
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-slate-500 font-bold bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                          <Ban size={16} strokeWidth={2.5} /> 見送り
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 pr-8 text-sm text-slate-400 leading-relaxed text-right font-medium">
                      {r.reason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
