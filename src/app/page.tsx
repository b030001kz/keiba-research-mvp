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
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div className="text-slate-400 text-sm">総レース数</div>
          </div>
          <div className="text-3xl font-bold">{(raceCount as any) || 0} <span className="text-sm font-normal text-slate-500">Races</span></div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Award size={24} />
            </div>
            <div className="text-slate-400 text-sm">総出走馬数</div>
          </div>
          <div className="text-3xl font-bold">{(runnerCount as any) || 0} <span className="text-sm font-normal text-slate-500">Horses</span></div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg">
              <Activity size={24} />
            </div>
            <div className="text-slate-400 text-sm">バックテスト実行数</div>
          </div>
          <div className="text-3xl font-bold">0 <span className="text-sm font-normal text-slate-500">Runs</span></div>
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
        <h3 className="text-xl font-bold mb-6">システムの概要</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          keiba-research-mvp は、競馬予想の期待値と資金曲線を研究するためのプロトタイプツールです。
          現在はルールの重み付けに基づくスコアリングエンジンを使用しています。
        </p>
        <ul className="list-disc list-inside text-slate-400 space-y-2">
          <li>中央競馬全場対応 (ダミーデータ)</li>
          <li>ルールベース・スコアリング</li>
          <li>単勝期待値シミュレーション</li>
        </ul>
      </div>
    </div>
  );
}
