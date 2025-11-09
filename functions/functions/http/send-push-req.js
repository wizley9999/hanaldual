import { onRequest } from "firebase-functions/https";
import { fcm } from "../../config/firebase.js";

export const sendPushReq = onRequest(async (req, res) => {
  try {
    await fcm.send(req.body);
  } catch (e) {
    return res.status(400).send(e);
  }

  return res.status(200).send();
});
