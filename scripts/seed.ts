import { db, initDb } from '../src/lib/db/index';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  initDb();
  
  const horses = [];
  for (let i = 1; i <= 100; i++) {
    const id = `H${String(i).padStart(4, '0')}`;
    horses.push({ id, name: `DummyHorse_${id}` });
  }

  const insertHorse = db.prepare('INSERT OR IGNORE INTO horse (horse_id, horse_name) VALUES (?, ?)');
  const insertRace = db.prepare('INSERT OR IGNORE INTO race VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertRunner = db.prepare('INSERT OR IGNORE INTO runner VALUES (?, ?, ?, ?, ?, ?)');
  const insertOdds = db.prepare('INSERT OR IGNORE INTO odds_snapshot VALUES (?, ?, ?, ?, ?)');

  const venues = ["東京", "中山", "京都", "阪神"];
  const baseDate = new Date();

  for (let d = 0; d < 3; d++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    for (const venue of venues) {
      for (let rNum = 1; rNum <= 12; rNum++) {
        const raceId = `${dateStr.replace(/-/g, '')}${venue === "東京" ? "T" : venue === "中山" ? "N" : venue === "京都" ? "K" : "H"}${String(rNum).padStart(2, '0')}`;
        
        insertRace.run(
          raceId, dateStr, venue, rNum, `${venue} 第${rNum}レース`,
          [1200, 1600, 2000, 2400][Math.floor(Math.random() * 4)],
          Math.random() > 0.5 ? "芝" : "ダート",
          ["晴", "曇", "雨"][Math.floor(Math.random() * 3)],
          ["良", "稍重", "重"][Math.floor(Math.random() * 3)]
        );

        // Shuffle and pick 12 horses
        const selectedHorses = [...horses].sort(() => 0.5 - Math.random()).slice(0, 12);
        
        selectedHorses.forEach((h, idx) => {
          insertHorse.run(h.id, h.name);
          insertRunner.run(raceId, h.id, Math.floor(idx / 2) + 1, idx + 1, `Jockey_${Math.floor(Math.random() * 20) + 1}`, `Trainer_${Math.floor(Math.random() * 10) + 1}`);
          
          const odds = (Math.random() * 49 + 1.1).toFixed(1);
          insertOdds.run(raceId, idx + 1, parseFloat(odds), Math.floor(Math.random() * 12) + 1, new Date().toISOString());
        });
      }
    }
  }

  console.log("Seeding complete.");
}

seed().catch(console.error);
