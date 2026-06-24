import { getSupabaseAdmin } from '@/supabase/admin';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  const token = request.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const token = request.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
