import { onRequest } from "firebase-functions/https";
import { Timestamp } from "firebase-admin/firestore";
import { FirestoreService } from "../../services/firestore.js";
import { db } from "../../config/firebase.js";

export const updateLastActive = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send({ error: "Method not allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send({ error: "Missing userId in request body" });
  }

  const ref = db.collection("users").doc(userId);

  await FirestoreService.update(ref, {
    lastActiveAt: Timestamp.fromDate(new Date()),
  });

  return res.status(200).send();
});
