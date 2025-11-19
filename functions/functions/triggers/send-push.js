import { onDocumentCreated } from "firebase-functions/firestore";
import { db, fcm } from "../../config/firebase.js";
import { FirestoreService } from "../../services/firestore.js";
import { FieldValue } from "firebase-admin/firestore";

export const sendPush = onDocumentCreated(
  {
    document: "postAnalyses/{docId}",
    memory: "1GiB",
  },
  async (event) => {
    const docId = event.params.docId;
    const post = event.data.data();

    const usersSnapshot = await db.collection("users").get();

    const tokens = usersSnapshot.docs
      .map((doc) => doc.data().token)
      .filter(Boolean);

    const message = (token) => {
      return {
        token,
        data: {
          token,
          title: post.title,
          body: post.content,
          link: `/posts/${docId}`,
        },
      };
    };

    const invalidTokens = [];

    const chunk = (array, size) =>
      Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
        array.slice(i * size, i * size + size)
      );

    const chunks = chunk(tokens, 500);

    for (const c of chunks) {
      const messages = c.map((t) => message(t));

      const res = await fcm.sendEach(messages);

      res.responses.forEach((r, i) => {
        if (!r.success) {
          invalidTokens.push(c[i]);
        }
      });
    }

    if (invalidTokens.length > 0) {
      const batch = db.batch();

      for (const invalidToken of invalidTokens) {
        const snap = await db
          .collection("users")
          .where("token", "==", invalidToken)
          .get();

        for (const doc of snap.docs) {
          batch.delete(doc.ref);
        }
      }

      await batch.commit();
    }

    await FirestoreService.update(event.data.ref, {
      status: "dispatched",
      dispatchedAt: FieldValue.serverTimestamp(),
    });
  }
);
