import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();
    const supabase = getServiceSupabase();

    const { data: settings } = await supabase
      .from('user_settings')
      .select('auto_delete_temp')
      .single();

    if (settings?.auto_delete_temp) {
      await supabase
        .from('documents')
        .update({ raw_text: null }) 
        .eq('id', documentId);
    }

    return NextResponse.json({ success: true, message: "Cleanup complete" });
  } catch (error) {
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
