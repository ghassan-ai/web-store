import { db } from "./config";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

const BANNERS_COLLECTION = "banners";

export function subscribeToBanners(callback) {
  return onSnapshot(collection(db, BANNERS_COLLECTION), (snapshot) => {
    const banners = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    banners.sort((a, b) => a.slotNumber - b.slotNumber);
    callback(banners);
  }, (error) => {
    console.error("Banners subscription error:", error);
    callback([]);
  });
}

export async function saveBanner(slotNumber, data) {
  const docRef = doc(db, BANNERS_COLLECTION, `slot-${slotNumber}`);
  await setDoc(docRef, {
    slotNumber,
    imageBase64: data.imageBase64,
    productId: data.productId,
    productName: data.productName,
  });
}
