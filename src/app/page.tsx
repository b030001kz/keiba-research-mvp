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
        <div className="bg-[#0F172A]/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl shadow-inner border border-blue-500/20">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
            <div className="text-slate-400 font-semibold tracking-wide text-sm">登録レース数</div>
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 relative z-10 mt-2">
            {(raceCount as any) || 0}
            <span className="text-sm font-medium text-slate-500 ml-3 tracking-widest uppercase">Races</span>
          </div>
        </div>

        <div className="bg-[#0F172A]/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/20"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl shadow-inner border border-emerald-500/20">
              <Award size={24} strokeWidth={2.5} />
            </div>
            <div className="text-slate-400 font-semibold tracking-wide text-sm">登録出走馬数</div>
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 relative z-10 mt-2">
            {(runnerCount as any) || 0}
            <span className="text-sm font-medium text-slate-500 ml-3 tracking-widest uppercase">Horses</span>
          </div>
        </div>

        <div className="bg-[#0F172A]/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/20"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-2xl shadow-inner border border-purple-500/20">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div className="text-slate-400 font-semibold tracking-wide text-sm">実行済みテスト</div>
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 relative z-10 mt-2">
            0
            <span className="text-sm font-medium text-slate-500 ml-3 tracking-widest uppercase">Runs</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0F172A]/70 backdrop-blur-2xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <h3 className="text-2xl font-black text-white mb-6 relative z-10 tracking-tight">システムの概要</h3>
        <p className="text-slate-400 leading-relaxed mb-8 text-lg relative z-10 font-medium max-w-3xl">
          keiba-research-mvp は、競馬予想の期待値と資金曲線を研究するためのプロトタイプツールです。ルールの重み付けに基づくスコアリングエンジンを使用し、「勝つ」だけでなく「儲かる」ロジックを探索します。
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <li className="flex items-center gap-4 text-slate-300 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <TrendingUp className="text-blue-400" size={18} />
            </span>
            <span className="font-medium">中央競馬全場対応</span>
          </li>
          <li className="flex items-center gap-4 text-slate-300 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Award className="text-emerald-400" size={18} />
            </span>
            <span className="font-medium">ルールベース スコアリング</span>
          </li>
          <li className="flex items-center gap-4 text-slate-300 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Activity className="text-purple-400" size={18} />
            </span>
            <span className="font-medium">単勝期待値シミュレーション</span>
          </li>
          <li className="flex items-center gap-4 text-slate-300 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center shrink-0">
              <TrendingUp className="text-pink-400" size={18} />
            </span>
            <span className="font-medium">クラウドDB連携実装済</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
