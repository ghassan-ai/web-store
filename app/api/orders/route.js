import { getSupabaseAdmin } from '@/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  if (!body.customerName?.trim()) {
    return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 });
  }
  if (!body.customerPhone?.trim()) {
    return NextResponse.json({ error: 'رقم الهاتف مطلوب' }, { status: 400 });
  }
  if (!body.city?.trim()) {
    return NextResponse.json({ error: 'المدينة مطلوبة' }, { status: 400 });
  }
  if (!body.items?.length) {
    return NextResponse.json({ error: 'السلة فارغة' }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const orderNumber = "ORD-" + Math.floor(Date.now() / 1000);

  const { error } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: body.customerName.trim(),
      customer_phone: body.customerPhone.trim(),
      city: body.city.trim(),
      status: 'pending',
      items: body.items.map((item) => ({
        name: String(item.name || ''),
        imageUrl: item.imageUrl || '',
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        ...(item.selections ? { selections: item.selections } : {}),
      })),
      total: Number(body.total) || 0,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orderNumber });
}
