import { supabase } from '@/lib/db/supabase';
import Link from 'next/link';
import { Calendar, MapPin, Gauge } from 'lucide-react';

export default async function RacesPage() {
  const { data: races } = await supabase
    .from('race')
    .select('*')
    .order('date', { ascending: false })
    .order('race_number', { ascending: true });

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold">対象レース一覧</h2>
        <p className="text-slate-400 mt-2">当日から直近3日間の全レースを表示しています。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(races || []).map((race) => (
          <Link key={race.race_id} href={`/races/${race.race_id}`}>
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-900/50 px-3 py-1.5 rounded-lg text-sm text-blue-400 font-mono font-medium border border-blue-500/20">
                  {race.venue} {race.race_number}R
                </div>
                <div className="text-sm text-slate-500 font-medium bg-slate-900/40 px-3 py-1.5 rounded-lg">
                  {new Date(race.date).toLocaleDateString('ja-JP')}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-6 text-white group-hover:text-blue-300 transition-colors line-clamp-1">{race.race_name}</h3>
              
              <div className="mt-auto space-y-3 text-slate-400">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-slate-900/30 p-2.5 rounded-xl">
                    <Calendar size={16} className="text-slate-500 shrink-0" />
                    <span className="text-sm">{race.distance}m / {race.track_type}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/30 p-2.5 rounded-xl">
                    <MapPin size={16} className="text-slate-500 shrink-0" />
                    <span className="text-sm">{race.weather} / {race.track_condition}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400/90 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10 justify-center">
                  <Gauge size={16} /> 
                  <span className="text-sm font-bold">予想準備完了</span>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
