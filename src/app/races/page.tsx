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
      <header className="mb-10 relative">
        <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">対象レース一覧</h2>
        <p className="text-slate-400 mt-3 text-lg font-medium">当日から直近3日間の全レースを表示しています。</p>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {(races || []).map((race) => (
          <Link key={race.race_id} href={`/races/${race.race_id}`}>
            <div className="bg-[#0F172A]/70 backdrop-blur-xl p-6 rounded-3xl border border-white/5 hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/10"></div>

              <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="bg-blue-500/10 px-3.5 py-1.5 rounded-xl text-xs text-blue-400 font-black tracking-widest uppercase border border-blue-500/20 shadow-inner">
                  {race.venue} {race.race_number}R
                </div>
                <div className="text-xs text-slate-400 font-bold bg-[#1E293B]/80 px-3.5 py-1.5 rounded-xl border border-white/5">
                  {new Date(race.date).toLocaleDateString('ja-JP')}
                </div>
              </div>
              
              <h3 className="text-2xl font-black mb-6 text-white group-hover:text-amber-400 transition-colors line-clamp-2 tracking-tight leading-tight relative z-10">
                {race.race_name}
              </h3>
              
              <div className="mt-auto space-y-3 relative z-10">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 bg-[#1E293B]/50 p-3 rounded-2xl border border-white/5">
                    <Calendar size={18} className="text-amber-500/70 shrink-0" strokeWidth={2.5} />
                    <span className="text-sm font-semibold text-slate-300">{race.distance}m / {race.track_type}</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#1E293B]/50 p-3 rounded-2xl border border-white/5">
                    <MapPin size={18} className="text-purple-500/70 shrink-0" strokeWidth={2.5} />
                    <span className="text-sm font-semibold text-slate-300">{race.weather} / {race.track_condition}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 justify-center shadow-inner group-hover:bg-emerald-500/20 transition-colors">
                  <Gauge size={18} strokeWidth={2.5} /> 
                  <span className="text-sm font-bold tracking-wider">予想準備完了</span>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
