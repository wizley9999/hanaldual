import { onRequest } from "firebase-functions/https";
import { messaging } from "../config/firebase.js";

export const sendPushRequest = onRequest(
  { timeoutSeconds: 1200 },
  async (req, res) => {
    await messaging.send(req.body);
    res.status(200).send();
  }
);
