import { supabase } from '@/lib/db/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: race } = await supabase
    .from('race')
    .select('*')
    .eq('race_id', id)
    .single();

  const { data: runners } = await supabase
    .from('runner')
    .select('*, odds_snapshot(*)')
    .eq('race_id', id)
    .order('horse_number', { ascending: true });

  return Response.json({ race, runners });
}
