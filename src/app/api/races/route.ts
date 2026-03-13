import { db } from '@/lib/db';

export async function GET() {
  const races = db.prepare('SELECT * FROM race ORDER BY date DESC, venue, race_number').all();
  return Response.json(races);
}
