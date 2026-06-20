import { getSupabaseAdmin } from '@/supabase/admin';
import { NextResponse } from 'next/server';

function validateAdmin(request) {
  const token = request.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_SECRET) {
    return false;
  }
  return true;
}

export async function POST(request) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      name: body.name || '',
      price: Number(body.price) || 0,
      image_url: body.imageUrl || '',
      category: body.category || 'other',
      stock: Number(body.stock) || 0,
      is_active: body.isActive !== false,
      colors: body.colors || [],
      specs: body.specs || '',
      custom_options: body.customOptions || [],
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}

export async function PUT(request) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
  }

  const mapped = {};
  if (updateData.name !== undefined) mapped.name = updateData.name;
  if (updateData.price !== undefined) mapped.price = Number(updateData.price);
  if (updateData.imageUrl !== undefined) mapped.image_url = updateData.imageUrl;
  if (updateData.category !== undefined) mapped.category = updateData.category;
  if (updateData.stock !== undefined) mapped.stock = Number(updateData.stock);
  if (updateData.isActive !== undefined) mapped.is_active = updateData.isActive;
  if (updateData.colors !== undefined) mapped.colors = updateData.colors;
  if (updateData.specs !== undefined) mapped.specs = updateData.specs;
  if (updateData.customOptions !== undefined) mapped.custom_options = updateData.customOptions;

  const { error } = await supabaseAdmin
    .from('products')
    .update(mapped)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
