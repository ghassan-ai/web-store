import { supabase } from './client';

function getAdminToken() {
  try {
    const data = localStorage.getItem("fakeUser");
    if (data) return process.env.NEXT_PUBLIC_ADMIN_SECRET || '';
    return '';
  } catch {
    return '';
  }
}

function mapOrder(row) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    city: row.city,
    status: row.status,
    items: row.items || [],
    total: Number(row.total),
    createdAt: row.created_at,
  };
}

export async function createOrder(orderData) {
  if (!orderData.customerName?.trim()) throw new Error("الاسم مطلوب");
  if (!orderData.customerPhone?.trim()) throw new Error("رقم الهاتف مطلوب");
  if (!orderData.city?.trim()) throw new Error("المدينة مطلوبة");
  if (!orderData.items?.length) throw new Error("السلة فارغة");

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: orderData.customerName.trim(),
      customerPhone: orderData.customerPhone.trim(),
      city: orderData.city.trim(),
      items: orderData.items.map((item) => ({
        name: String(item.name || ""),
        imageUrl: item.imageUrl || "",
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        ...(item.selections ? { selections: item.selections } : {}),
      })),
      total: Number(orderData.total) || 0,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create order');
  }

  const { orderNumber } = await res.json();
  return orderNumber;
}

export function subscribeToAllOrders(callback) {
  supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error("Orders fetch error:", error);
        callback([]);
      } else {
        callback((data || []).map(mapOrder));
      }
    });

  const channel = supabase
    .channel('orders-all')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      () => {
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (!error) callback((data || []).map(mapOrder));
          });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToOrderByNumber(orderNumber, callback) {
  supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single()
    .then(({ data, error }) => {
      if (error || !data) {
        callback(null);
      } else {
        callback(mapOrder(data));
      }
    });

  const channel = supabase
    .channel(`order-${orderNumber}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `order_number=eq.${orderNumber}`,
      },
      () => {
        supabase
          .from('orders')
          .select('*')
          .eq('order_number', orderNumber)
          .single()
          .then(({ data, error }) => {
            if (error || !data) {
              callback(null);
            } else {
              callback(mapOrder(data));
            }
          });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function updateOrderStatus(docId, status) {
  const res = await fetch('/api/admin/orders', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': getAdminToken(),
    },
    body: JSON.stringify({ id: docId, status }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update order status');
  }
}

export async function deleteOrder(orderId) {
  const res = await fetch('/api/admin/orders', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': getAdminToken(),
    },
    body: JSON.stringify({ id: orderId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete order');
  }
}
