import { onRequest } from "firebase-functions/https";
import { messaging } from "../config/firebase.js";

export const sendPushRequest = onRequest(
  { timeoutSeconds: 1200 },
  async (req, res) => {
    const response = await messaging.send(req.body);

    const invalidErrors = [
      "messaging/invalid-registration-token",
      "messaging/registration-token-not-registered",
    ];

    response.responses.forEach(async (r) => {
      if (!r.success && invalidErrors.includes(r.error.code)) {
        res.status(401).send();
      }
    });

    res.status(200).send();
  }
);
