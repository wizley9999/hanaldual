import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { setGlobalOptions } from "firebase-functions";
import { Env } from "./env.js";

initializeApp();

setGlobalOptions({ region: Env.REGION });

export const db = getFirestore();
export const fcm = getMessaging();
