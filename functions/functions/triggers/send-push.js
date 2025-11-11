import { onDocumentCreated } from "firebase-functions/firestore";
import { db, fcm } from "../../config/firebase.js";
import { FirestoreService } from "../../services/firestore.js";
import { Timestamp } from "firebase-admin/firestore";

export const sendPush = onDocumentCreated(
  {
    document: "postAnalyses/{docId}",
    memory: "1GiB",
  },
  async (event) => {
    const docId = event.params.docId;
    const post = event.data.data();
    const matched = post.matchedKeywords || [];
    if (matched.length === 0) return;

    const keywordSnaps = await Promise.all(
      matched.map((keyword) => db.collection("keywords").doc(keyword).get())
    );

    const userMap = {};

    for (let i = 0; i < keywordSnaps.length; i++) {
      const snap = keywordSnaps[i];
      if (!snap.exists) continue;

      const data = snap.data();
      const subscribers = data.subscribers || [];
      const keyword = matched[i];

      for (let j = 0; j < subscribers.length; j++) {
        const uid = subscribers[j];
        if (!userMap[uid]) {
          userMap[uid] = { keywords: new Set(), token: null };
        }
        userMap[uid].keywords.add(keyword);
      }
    }

    const uids = Object.keys(userMap);
    if (uids.length === 0) return;

    const userSnaps = await Promise.all(
      uids.map((uid) => db.collection("users").doc(uid).get())
    );

    const messages = [];
    const tokenToUid = {};

    for (let i = 0; i < userSnaps.length; i++) {
      const snap = userSnaps[i];

      if (!snap.exists) continue;

      const uid = uids[i];
      const userData = snap.data();

      const token = userData && userData.token;
      if (!token) continue;

      const keywords = Array.from(userMap[uid].keywords);
      const keywordStr = keywords.join(", ");

      userMap[uid].token = token;
      tokenToUid[token] = uid;

      const msgData = {
        title: post.title,
        body: `${post.content.slice(0, 80)} - [${keywordStr}]`,
        link: `/posts/${docId}`,
      };

      messages.push({
        token: token,
        data: msgData,
      });
    }

    if (messages.length === 0) return;

    await Promise.all(
      messages.map((m) =>
        FirestoreService.appendUserReceived(tokenToUid[m.token], m.data)
      )
    );

    const invalidUids = [];

    for (let i = 0; i < messages.length; i += 500) {
      const chunk = messages.slice(i, i + 500);
      const response = await fcm.sendEach(chunk);

      for (let j = 0; j < response.responses.length; j++) {
        const res = response.responses[j];
        if (!res.success) {
          const errorCode = res.error && res.error.code;
          if (
            errorCode === "messaging/invalid-registration-token" ||
            errorCode === "messaging/registration-token-not-registered"
          ) {
            const failedToken = chunk[j].token;
            const uid = tokenToUid[failedToken];
            if (uid) invalidUids.push(uid);
          }
        }
      }
    }

    if (invalidUids.length > 0) {
      const batch = db.batch();
      for (let i = 0; i < invalidUids.length; i++) {
        const ref = db.collection("users").doc(invalidUids[i]);
        batch.update(ref, { token: null });
      }
      await batch.commit();
    }

    await FirestoreService.update(event.data.ref, {
      status: "dispatched",
      dispatchedAt: Timestamp.fromDate(new Date()),
    });
  }
);
