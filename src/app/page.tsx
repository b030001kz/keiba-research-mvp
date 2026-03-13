import { supabase } from '@/lib/db/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Award, Activity } from 'lucide-react';

export default async function DashboardPage() {
  const { count: raceCount } = await supabase.from('race').select('*', { count: 'exact', head: true });
  const { count: runnerCount } = await supabase.from('runner').select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">ダッシュボード</h2>
        <div className="text-slate-400">最終更新: {new Date().toLocaleString()}</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-blue-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div className="text-slate-400 font-medium">登録レース数</div>
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            {(raceCount as any) || 0}
            <span className="text-sm font-normal text-slate-500 ml-2">Races</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Award size={24} />
            </div>
            <div className="text-slate-400 font-medium">登録出走馬数</div>
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            {(runnerCount as any) || 0}
            <span className="text-sm font-normal text-slate-500 ml-2">Horses</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-purple-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <Activity size={24} />
            </div>
            <div className="text-slate-400 font-medium">実行済みテスト</div>
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
            0
            <span className="text-sm font-normal text-slate-500 ml-2">Runs</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-6 text-white">システムの概要</h3>
        <p className="text-slate-300 leading-relaxed mb-6 text-lg">
          keiba-research-mvp は、競馬予想の期待値と資金曲線を研究するためのプロトタイプツールです。ルールの重み付けに基づくスコアリングエンジンを使用し、「勝つ」だけでなく「儲かる」ロジックを探索します。
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-blue-500 block"></span>
            中央競馬全場対応
          </li>
          <li className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
            ルールベース スコアリング
          </li>
          <li className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-purple-500 block"></span>
            単勝期待値シミュレーション
          </li>
          <li className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-pink-500 block"></span>
            クラウドDB連携実装済
          </li>
        </ul>
      </div>
    </div>
  );
}
