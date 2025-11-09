import fs from "fs";
import path from "path";
import "dotenv/config";

const srcPath = path.resolve("scripts/firebase-messaging-sw.template.js");
const outPath = path.resolve("public/firebase-messaging-sw.js");

let swCode = fs.readFileSync(srcPath, "utf8");

swCode = swCode.replace(
  "__FIREBASE_CONFIG__",
  JSON.stringify({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
  })
);

swCode = swCode.replace(
  "__CLOUD_FUNCTIONS_URL__",
  process.env.VITE_CLOUD_FUNCTIONS_URL
);

fs.writeFileSync(outPath, swCode);
