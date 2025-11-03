import { onDocumentUpdated } from "firebase-functions/firestore";
import { FieldValue } from "firebase-admin/firestore";

export const updateKeywords = onDocumentUpdated(
  "users/{docId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    const userId = event.params.docId;

    const beforeE = before.e_keywords || [];
    const afterE = after.e_keywords || [];
    const beforeT = before.t_keywords || [];
    const afterT = after.t_keywords || [];

    const eAdded = afterE.filter((k) => !beforeE.includes(k));
    const eRemoved = beforeE.filter((k) => !afterE.includes(k));
    const tAdded = afterT.filter((k) => !beforeT.includes(k));
    const tRemoved = beforeT.filter((k) => !afterT.includes(k));

    if (
      eAdded.length === 0 &&
      eRemoved.length === 0 &&
      tAdded.length === 0 &&
      tRemoved.length === 0
    ) {
      return;
    }

    const batch = db.batch();

    for (const keyword of eAdded) {
      const ref = db.collection("keywords").doc(keyword);
      batch.update(ref, {
        e_subscribers: FieldValue.arrayUnion(userId),
      });
    }

    for (const keyword of eRemoved) {
      const ref = db.collection("keywords").doc(keyword);
      batch.update(ref, {
        e_subscribers: FieldValue.arrayRemove(userId),
      });
    }

    for (const keyword of tAdded) {
      const ref = db.collection("keywords").doc(keyword);
      batch.update(ref, {
        t_subscribers: FieldValue.arrayUnion(userId),
      });
    }

    for (const keyword of tRemoved) {
      const ref = db.collection("keywords").doc(keyword);
      batch.update(ref, {
        t_subscribers: FieldValue.arrayRemove(userId),
      });
    }

    await batch.commit();
  }
);
