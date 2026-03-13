import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env.local から読み込み
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedSupabase() {
  console.log("Seeding Supabase...");

  const horses = [];
  for (let i = 1; i <= 20; i++) {
    const id = `H${String(i).padStart(4, '0')}`;
    horses.push({ horse_id: id, horse_name: `CloudHorse_${id}` });
  }

  // Insert Horses
  const { error: horseError } = await supabase.from('horse').upsert(horses);
  if (horseError) console.error("Horse seed error:", horseError);

  const venues = ["東京", "中山"];
  const baseDate = new Date();

  for (let d = 0; d < 2; d++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    for (const venue of venues) {
      for (let rNum = 1; rNum <= 12; rNum++) {
        const raceId = `${dateStr.replace(/-/g, '')}${venue === "東京" ? "T" : "N"}${String(rNum).padStart(2, '0')}`;
        
        await supabase.from('race').upsert({
          race_id: raceId,
          date: dateStr,
          venue: venue,
          race_number: rNum,
          race_name: `${venue} 第${rNum}レース (Cloud)`,
          distance: 1600,
          track_type: "芝",
          weather: "晴",
          track_condition: "良"
        });

        const selectedHorses = [...horses].sort(() => 0.5 - Math.random()).slice(0, 8);
        
        const runners = selectedHorses.map((h, idx) => ({
          race_id: raceId,
          horse_id: h.horse_id,
          bracket_number: Math.floor(idx / 2) + 1,
          horse_number: idx + 1,
          jockey_name: `Jockey_${idx + 1}`,
          trainer_name: `Trainer_${idx + 1}`
        }));

        await supabase.from('runner').upsert(runners);

        const odds = runners.map(r => ({
          race_id: raceId,
          horse_number: r.horse_number,
          win_odds: (Math.random() * 10 + 2).toFixed(1),
          popularity: r.horse_number
        }));

        await supabase.from('odds_snapshot').insert(odds);
      }
    }
  }

  console.log("Supabase seeding complete.");
}

seedSupabase().catch(console.error);
