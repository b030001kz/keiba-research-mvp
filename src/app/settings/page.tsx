import { db } from '@/lib/db';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default async function SettingsPage() {
  // 実際の実装ではここでDBから重みを読み書きする
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold">設定</h2>
        <p className="text-slate-400 mt-2">スコアリングエンジンの重みや閾値を調整します（現在は表示のみ）。</p>
      </header>

      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl max-w-2xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <SettingsIcon size={24} className="text-blue-400" /> 特徴量重み設定
        </h3>
        
        <div className="space-y-4">
          <WeightItem label="前走着順" value="2.0" />
          <WeightItem label="近3走平均着順" value="3.0" />
          <WeightItem label="上がり順位" value="2.0" />
          <WeightItem label="騎手勝率" value="1.0" />
          <hr className="border-slate-700" />
          <WeightItem label="買い判定最小スコア" value="70.0" />
          <WeightItem label="期待値閾値" value="1.2" />
        </div>

        <button className="mt-8 w-full bg-slate-700 text-slate-400 p-3 rounded-lg font-bold flex items-center justify-center gap-2 cursor-not-allowed">
          <Save size={20} /> 設定を保存 (次フェーズ実装)
        </button>
      </div>
    </div>
  );
}

function WeightItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
      <span className="text-slate-300">{label}</span>
      <span className="font-mono text-blue-400 font-bold">{value}</span>
    </div>
  );
}
