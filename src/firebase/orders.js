import { db } from "./config";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

function generateOrderNumber() {
  return "ORD-" + Math.floor(Date.now() / 1000);
}

export async function createOrder(orderData) {
  if (!orderData.customerName?.trim()) throw new Error("الاسم مطلوب");
  if (!orderData.customerPhone?.trim()) throw new Error("رقم الهاتف مطلوب");
  if (!orderData.city?.trim()) throw new Error("المدينة مطلوبة");
  if (!orderData.items?.length) throw new Error("السلة فارغة");

  const orderNumber = generateOrderNumber();

  const order = {
    orderNumber,
    customerName: orderData.customerName.trim(),
    customerPhone: orderData.customerPhone.trim(),
    city: orderData.city.trim(),
    status: "pending",
    items: orderData.items.map((item) => ({
      name: String(item.name || ""),
      imageUrl: item.imageUrl || "",
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
    })),
    total: Number(orderData.total) || 0,
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "orders"), order);
  } catch (err) {
    console.error("Create order error:", err);
    throw err;
  }

  return orderNumber;
}

export function subscribeToAllOrders(callback) {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(orders);
  }, (error) => {
    console.error("Orders subscription error:", error);
    callback([]);
  });
}

export function subscribeToOrderByNumber(orderNumber, callback) {
  const q = query(
    collection(db, "orders"),
    where("orderNumber", "==", orderNumber)
  );
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
    } else {
      const doc = snapshot.docs[0];
      callback({ id: doc.id, ...doc.data() });
    }
  }, (error) => {
    console.error("Order tracking error:", error);
    callback(null);
  });
}

export async function updateOrderStatus(docId, status) {
  try {
    const ref = doc(db, "orders", docId);
    await updateDoc(ref, { status });
  } catch (err) {
    console.error("Update order status error:", err);
    throw err;
  }
}
