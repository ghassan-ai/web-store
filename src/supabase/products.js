import { supabase } from './client';

export const PRODUCT_CATEGORIES = [
  { value: 'phone', label: 'Phone', labelAr: 'هواتف' },
  { value: 'case', label: 'Cases', labelAr: 'كفرات' },
  { value: 'accessory', label: 'Accessories', labelAr: 'إكسسوارات' },
  { value: 'speaker', label: 'Speakers', labelAr: 'سماعات' },
  { value: 'power-bank', label: 'Essential Power', labelAr: 'باور بانك' },
  { value: 'apple-accessory', label: 'Apple Accessories', labelAr: 'إكسسوارات أبل' },
  { value: 'electronics', label: 'Electronics', labelAr: 'إلكترونيات' },
  { value: 'tablet', label: 'Tablets', labelAr: 'تابلت' },
  { value: 'other', label: 'Other', labelAr: 'أخرى' },
];

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    imageUrl: row.image_url,
    category: row.category,
    stock: row.stock,
    isActive: row.is_active,
    colors: row.colors || [],
    specs: row.specs || '',
    customOptions: row.custom_options || [],
    createdAt: row.created_at,
  };
}

function getAdminToken() {
  try {
    const data = localStorage.getItem("fakeUser");
    if (data) return process.env.NEXT_PUBLIC_ADMIN_SECRET || '';
    return '';
  } catch {
    return '';
  }
}

export function subscribeToProducts(callback) {
  supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .then(({ data, error }) => {
      if (error) {
        console.error("Products fetch error:", error);
        callback([]);
      } else {
        callback((data || []).map(mapRow));
      }
    });

  const channel = supabase
    .channel('products-active')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .then(({ data, error }) => {
            if (!error) callback((data || []).map(mapRow));
          });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToAllProducts(callback) {
  supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error("All products fetch error:", error);
        callback([]);
      } else {
        callback((data || []).map(mapRow));
      }
    });

  const channel = supabase
    .channel('products-all')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (!error) callback((data || []).map(mapRow));
          });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export const addProduct = async (productData) => {
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': getAdminToken(),
    },
    body: JSON.stringify({
      name: productData.name || "",
      price: Number(productData.price) || 0,
      imageUrl: productData.imageUrl || "",
      category: productData.category || "other",
      stock: Number(productData.stock) || 0,
      isActive: productData.isActive !== false,
      colors: productData.colors || [],
      specs: productData.specs || "",
      customOptions: productData.customOptions || [],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add product');
  }

  return await res.json();
};

export const updateProduct = async (id, updateData) => {
  const res = await fetch('/api/admin/products', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': getAdminToken(),
    },
    body: JSON.stringify({ id, ...updateData }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update product');
  }

  return await res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch('/api/admin/products', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': getAdminToken(),
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete product');
  }

  return await res.json();
};

export const toggleActive = async (id, currentIsActive) => {
  return updateProduct(id, { isActive: !currentIsActive });
};
