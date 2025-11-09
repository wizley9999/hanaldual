import { onDocumentUpdated } from "firebase-functions/firestore";
import { db, fcm } from "../../config/firebase.js";
import { FieldValue } from "firebase-admin/firestore";

export const updateUser = onDocumentUpdated("users/{docId}", async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();
  if (!before || !after) return;

  // 키워드
  const handleKeywords = async () => {
    const userId = event.params.docId;

    const beforeKeywords = before.keywords || [];
    const afterKeywords = after.keywords || [];

    const added = afterKeywords.filter((k) => !beforeKeywords.includes(k));
    const removed = beforeKeywords.filter((k) => !afterKeywords.includes(k));

    if (added.length === 0 && removed.length === 0) return;

    const batch = db.batch();
    const keywordCol = db.collection("keywords");
    const allChanged = [...new Set([...added, ...removed])];

    const refs = allChanged.map((k) => keywordCol.doc(k));
    const snaps = await db.getAll(...refs);

    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      const snap = snaps[i];
      const key = allChanged[i];

      let currentSubs = snap.exists ? snap.data().subscribers || [] : [];

      if (!snap.exists) batch.set(ref, { subscribers: [] }, { merge: true });

      if (added.includes(key)) {
        batch.update(ref, { subscribers: FieldValue.arrayUnion(userId) });
        currentSubs.push(userId);
      }

      if (removed.includes(key)) {
        batch.update(ref, { subscribers: FieldValue.arrayRemove(userId) });
        currentSubs = currentSubs.filter((id) => id !== userId);
      }

      batch.update(ref, { count: currentSubs.length });
    }

    await batch.commit();

    if (removed.length > 0) {
      const removedRefs = removed.map((k) => keywordCol.doc(k));
      const removedSnaps = await db.getAll(...removedRefs);
      const deleteOps = removedSnaps
        .filter((snap) => (snap.data().subscribers || []).length === 0)
        .map((snap) => snap.ref.delete());

      if (deleteOps.length > 0) await Promise.all(deleteOps);
    }
  };

  // 토큰
  const handleToken = async () => {
    const beforeToken = before.token;
    const afterToken = after.token;

    if (afterToken && beforeToken !== afterToken) {
      await fcm.send({
        token: afterToken,
        data: {
          title: "[한알두알] 만나서 반가워요!",
          body: "토큰이 정상적으로 등록됐어요.",
        },
      });
    }
  };

  await Promise.all([handleKeywords(), handleToken()]);
});
