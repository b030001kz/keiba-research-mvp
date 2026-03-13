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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {(races || []).map((race) => (
          <Link key={race.race_id} href={`/races/${race.race_id}`}>
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-blue-500 transition-all cursor-pointer group shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 px-3 py-1 rounded text-sm font-bold text-slate-300">
                    {race.venue} {race.race_number}R
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors uppercase italic">{race.race_name}</h3>
                </div>
                <div className="text-sm text-slate-400">{race.date}</div>
              </div>

              <div className="flex gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar size={14} /> {race.distance}m / {race.track_type}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} /> {race.weather} / {race.track_condition}
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <Gauge size={14} /> 予想準備完了
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
