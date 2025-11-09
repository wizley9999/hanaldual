import { onDocumentDeleted } from "firebase-functions/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../config/firebase.js";

export const deleteKeyword = onDocumentDeleted(
  "users/{docId}",
  async (event) => {
    const before = event.data && event.data.data();
    if (!before) return;

    const userId = event.params.docId;
    const keywords = before.keywords || [];
    if (keywords.length === 0) return;

    const keywordCol = db.collection("keywords");
    const refs = keywords.map((k) => keywordCol.doc(k));
    const snaps = await db.getAll(...refs);

    const batch = db.batch();

    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      const snap = snaps[i];
      if (!snap.exists) continue;

      batch.update(ref, {
        subscribers: FieldValue.arrayRemove(userId),
      });
    }

    await batch.commit();

    const emptySnaps = await db.getAll(...refs);

    const deletions = [];
    for (let i = 0; i < emptySnaps.length; i++) {
      const snap = emptySnaps[i];
      if (!snap.exists) continue;

      const data = snap.data();
      if (!data) continue;

      const subs = data.subscribers || [];
      if (subs.length === 0) {
        deletions.push(snap.ref.delete());
      }
    }

    if (deletions.length > 0) {
      await Promise.all(deletions);
    }
  }
);
