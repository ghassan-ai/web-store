export async function uploadProductImage(file) {
  let token = '';
  try {
    const data = localStorage.getItem("fakeUser");
    if (data) token = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';
  } catch {}

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'x-admin-token': token },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'فشل رفع الصورة');
  }

  const { url } = await res.json();
  return url;
}
