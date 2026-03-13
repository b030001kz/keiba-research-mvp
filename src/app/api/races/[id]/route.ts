import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const race = db.prepare('SELECT * FROM race WHERE race_id = ?').get(params.id);
  const runners = db.prepare(`
    SELECT r.*, o.win_odds, o.popularity
    FROM runner r
    LEFT JOIN odds_snapshot o ON r.race_id = o.race_id AND r.horse_number = o.horse_number
    WHERE r.race_id = ?
    ORDER BY r.horse_number
  `).all(params.id);

  return Response.json({ race, runners });
}
