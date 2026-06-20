import { db } from "./config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

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

const PRODUCTS_COLLECTION = 'products';

export function subscribeToProducts(callback) {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('isActive', '==', true)
  );
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(products);
  }, (error) => {
    console.error("Products subscription error:", error);
    callback([]);
  });
}

export function subscribeToAllProducts(callback) {
  return onSnapshot(collection(db, PRODUCTS_COLLECTION), (snapshot) => {
    const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(products);
  }, (error) => {
    console.error("All products subscription error:", error);
    callback([]);
  });
}

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      name: productData.name || "",
      price: Number(productData.price) || 0,
      imageUrl: productData.imageUrl || "",
      category: productData.category || "other",
      stock: Number(productData.stock) || 0,
      isActive: productData.isActive !== false,
      colors: productData.colors || [],
      specs: productData.specs || "",
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error("Add product error:", err);
    throw err;
  }
};

export const updateProduct = async (id, updateData) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, updateData);
    return { success: true };
  } catch (err) {
    console.error("Update product error:", err);
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    return { success: true };
  } catch (err) {
    console.error("Delete product error:", err);
    throw err;
  }
};

export const toggleActive = async (id, currentIsActive) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, { isActive: !currentIsActive });
    return { success: true };
  } catch (err) {
    console.error("Toggle active error:", err);
    throw err;
  }
};
