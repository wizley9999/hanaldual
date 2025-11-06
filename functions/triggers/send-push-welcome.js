import { onDocumentUpdated } from "firebase-functions/firestore";
import { messaging } from "../config/firebase.js";

export const sendPushWelcome = onDocumentUpdated(
  "users/{docId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    const beforeToken = before.token;
    const afterToken = after.token;

    if (!afterToken || beforeToken === afterToken) return;

    await messaging.send({
      token: afterToken,
      notification: {
        title: "[환영!]와(과) 관련된 인사가 도착했어요!",
        body: "토큰이 정상적으로 등록됐어요!",
      },
      data: {
        link: "https://hanaldual.wizley.io/redirect?to=https://hanaldual.wizley.io",
      },
    });
  }
);
