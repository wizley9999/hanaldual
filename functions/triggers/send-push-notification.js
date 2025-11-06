import { onDocumentCreated } from "firebase-functions/firestore";
import { firestore, messaging } from "../config/firebase.js";

export const sendPushNotification = onDocumentCreated(
  "postAnalyses/{docId}",
  async (event) => {
    const postData = event.data.data();
    const matchedKeywords = postData.matchedKeywords || [];

    if (matchedKeywords.length === 0) return;

    const keywordRefs = matchedKeywords.map((k) =>
      firestore.collection("keywords").doc(k)
    );

    const keywordSnaps = await firestore.getAll(...keywordRefs);

    const userKeywordMap = new Map();

    for (let i = 0; i < keywordSnaps.length; i++) {
      const snap = keywordSnaps[i];
      const keyword = matchedKeywords[i];
      if (!snap.exists) continue;

      const subs = snap.data().t_subscribers || [];
      for (const uid of subs) {
        if (!userKeywordMap.has(uid)) userKeywordMap.set(uid, new Set());
        userKeywordMap.get(uid).add(keyword);
      }
    }

    if (userKeywordMap.size === 0) return;

    const userRefs = [...userKeywordMap.keys()].map((uid) =>
      firestore.collection("users").doc(uid)
    );

    const userSnaps = await firestore.getAll(...userRefs);

    for (const snap of userSnaps) {
      const data = snap.data();
      const token = data.token;
      const uid = snap.id;

      if (!token) continue;

      const keywords = [...(userKeywordMap.get(uid) || [])];
      const keywordStr = keywords.join(", ");

      const response = await messaging.send({
        token: token,
        notification: {
          title: `${keywordStr}와(과) 관련된 공지사항이 도착했어요!`,
          body: postData.title,
        },
        data: {
          link: postData.link,
        },
      });

      const invalidErrors = [
        "messaging/invalid-registration-token",
        "messaging/registration-token-not-registered",
      ];

      response.responses.forEach(async (r) => {
        if (!r.success && invalidErrors.includes(r.error.code)) {
          await firestore.collection("users").doc(uid).update({ token: null });
        }
      });
    }
  }
);
