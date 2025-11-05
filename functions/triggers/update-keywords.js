import { onDocumentUpdated } from "firebase-functions/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "../config/firebase.js";

export const updateKeywords = onDocumentUpdated(
  "users/{docId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    const uniqueId = event.params.docId;

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

    const batch = firestore.batch();

    const allAdded = [...new Set([...eAdded, ...tAdded])];

    if (allAdded.length > 0) {
      const addedRefs = allAdded.map((k) =>
        firestore.collection("keywords").doc(k)
      );

      const addedSnaps = await firestore.getAll(...addedRefs);

      for (let i = 0; i < addedRefs.length; i++) {
        const ref = addedRefs[i];
        const snap = addedSnaps[i];

        if (!snap.exists) {
          batch.set(
            ref,
            {
              e_subscribers: [],
              t_subscribers: [],
            },
            { merge: true }
          );
        }
      }
    }

    for (const keyword of eAdded) {
      const ref = firestore.collection("keywords").doc(keyword);
      batch.set(
        ref,
        { e_subscribers: FieldValue.arrayUnion(uniqueId) },
        { merge: true }
      );
    }

    for (const keyword of eRemoved) {
      const ref = firestore.collection("keywords").doc(keyword);
      batch.set(
        ref,
        { e_subscribers: FieldValue.arrayRemove(uniqueId) },
        { merge: true }
      );
    }

    for (const keyword of tAdded) {
      const ref = firestore.collection("keywords").doc(keyword);
      batch.set(
        ref,
        { t_subscribers: FieldValue.arrayUnion(uniqueId) },
        { merge: true }
      );
    }

    for (const keyword of tRemoved) {
      const ref = firestore.collection("keywords").doc(keyword);
      batch.set(
        ref,
        { t_subscribers: FieldValue.arrayRemove(uniqueId) },
        { merge: true }
      );
    }

    await batch.commit();

    const possiblyEmptyKeywords = [...new Set([...eRemoved, ...tRemoved])];
    if (possiblyEmptyKeywords.length > 0) {
      const snaps = await firestore.getAll(
        ...possiblyEmptyKeywords.map((k) =>
          firestore.collection("keywords").doc(k)
        )
      );

      const deletions = snaps
        .filter((snap) => {
          const data = snap.data();

          if (!data) return false;

          const eSubs = data.e_subscribers || [];
          const tSubs = data.t_subscribers || [];

          return eSubs.length === 0 && tSubs.length === 0;
        })
        .map((snap) => snap.ref.delete());

      if (deletions.length > 0) await Promise.all(deletions);
    }
  }
);
