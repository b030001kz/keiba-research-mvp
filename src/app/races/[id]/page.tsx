import { supabase } from '@/lib/db/supabase';
import { ScoringEngine } from '@/lib/engine/scoring-engine';
import { ScoringWeights } from '@/types';
import { ChevronLeft, Info, ShoppingCart, Ban, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function RaceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: race } = await supabase
    .from('race')
    .select('*')
    .eq('race_id', params.id)
    .single();

  const { data: runners } = await supabase
    .from('runner')
    .select('*, odds_snapshot(*)')
    .eq('race_id', params.id)
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
    <div className="space-y-8">
      <header>
        <Link href="/races" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-4 text-sm">
          <ChevronLeft size={16} /> レース一覧に戻る
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-slate-400 text-sm mb-1">{race.date} {race.venue} {race.race_number}R</div>
            <h2 className="text-4xl font-black uppercase italic">{race.race_name}</h2>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-sm">{race.distance}m / {race.track_type} / {race.track_condition}</span>
          </div>
        </div>
      </header>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">馬番</th>
              <th className="px-6 py-4 font-semibold">馬名 / 騎手 / 厩舎</th>
              <th className="px-6 py-4 font-semibold">オッズ / 人気</th>
              <th className="px-6 py-4 font-semibold text-center">スコア</th>
              <th className="px-6 py-4 font-semibold">判定</th>
              <th className="px-6 py-4 font-semibold">判断理由</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {runnerResults.map((r) => (
              <tr key={r.horse_number} className={`hover:bg-slate-700/30 transition-colors ${r.decision === '買い' ? 'bg-blue-500/5' : ''}`}>
                <td className="px-6 py-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    r.bracket_number === 1 ? 'bg-white text-black' : 
                    r.bracket_number === 2 ? 'bg-black text-white border border-slate-600' :
                    r.bracket_number === 3 ? 'bg-red-600 text-white' :
                    r.bracket_number === 4 ? 'bg-blue-600 text-white' :
                    r.bracket_number === 5 ? 'bg-yellow-500 text-black' :
                    r.bracket_number === 6 ? 'bg-green-600 text-white' :
                    r.bracket_number === 7 ? 'bg-orange-500 text-white' : 'bg-pink-500 text-black'
                  }`}>
                    {r.horse_number}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-100 italic">DummyHorse_{r.horse_id}</div>
                  <div className="text-xs text-slate-500 mt-1">{r.jockey_name} / {r.trainer_name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-lg font-bold text-blue-400">{r.win_odds?.toFixed(1) || '-'}</div>
                  <div className="text-xs text-slate-500">{r.popularity}人気</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className={`text-xl font-black ${r.score >= 70 ? 'text-blue-400' : r.score >= 50 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {r.score.toFixed(1)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {r.decision === '買い' ? (
                    <span className="flex items-center gap-1 text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded">
                      <ShoppingCart size={14} /> 買い
                    </span>
                  ) : r.decision === '保留' ? (
                    <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded">
                      <Clock size={14} /> 保留
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500 font-bold bg-slate-500/10 px-2 py-1 rounded">
                      <Ban size={14} /> 見送り
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 max-w-xs">{r.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
