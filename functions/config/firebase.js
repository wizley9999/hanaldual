import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { setGlobalOptions } from "firebase-functions";

initializeApp();

setGlobalOptions({ region: "asia-northeast3" });

export const firestore = getFirestore();
export const messaging = getMessaging();
