import { onRequest } from "firebase-functions/https";
import { fcm } from "../../config/firebase.js";
import { Env } from "../../config/env.js";

export const sendPushReq = onRequest(async (req, res) => {
  const { password, ...body } = req.body || {};

  if (password !== Env.HTTP_PASS) {
    return res.status(401).send();
  }

  try {
    await fcm.send(body);
  } catch (e) {
    return res.status(400).send(e);
  }

  return res.status(200).send();
});
