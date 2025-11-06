import { onSchedule } from "firebase-functions/scheduler";
import { getPostAnalysesRef, updateDocFields } from "../services/firestore.js";
import { firestore } from "../config/firebase.js";
import { sendGrid } from "../services/sendgrid.js";
import { Timestamp } from "firebase-admin/firestore";

export const sendEmail = onSchedule("* */12 * * *", async () => {
  const postQueryRef = getPostAnalysesRef({
    filters: [
      {
        field: "status",
        value: "pending",
      },
    ],
  });

  const snapshot = await postQueryRef.get();
  if (!snapshot || snapshot.empty) return;

  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const keywordToPosts = new Map();
  for (const post of posts) {
    const keywords = post.matchedKeywords || [];
    for (const k of keywords) {
      if (!keywordToPosts.has(k)) keywordToPosts.set(k, []);
      keywordToPosts.get(k).push({
        id: post.postId,
        title: post.title,
        link: post.link,
        content: post.analysisContent,
      });
    }
  }

  if (keywordToPosts.size === 0) return;

  const keywordsArray = [...keywordToPosts.keys()];

  const chunkSize = 50;
  const userKeywordMap = new Map();

  for (let i = 0; i < keywordsArray.length; i += chunkSize) {
    const chunk = keywordsArray.slice(i, i + chunkSize);
    const keywordRefs = chunk.map((k) =>
      firestore.collection("keywords").doc(k)
    );
    const keywordSnaps = await firestore.getAll(...keywordRefs);

    for (let j = 0; j < keywordSnaps.length; j++) {
      const snap = keywordSnaps[j];
      const keyword = chunk[j];
      if (!snap.exists) continue;

      const subs = snap.data().e_subscribers || [];
      for (const uid of subs) {
        if (!userKeywordMap.has(uid)) userKeywordMap.set(uid, new Set());
        userKeywordMap.get(uid).add(keyword);
      }
    }
  }

  if (userKeywordMap.size === 0) return;

  const userIds = [...userKeywordMap.keys()];
  const userDetails = [];

  for (let i = 0; i < userIds.length; i += chunkSize) {
    const chunk = userIds.slice(i, i + chunkSize);
    const userRefs = chunk.map((uid) => firestore.collection("users").doc(uid));
    const userSnaps = await firestore.getAll(...userRefs);

    userSnaps.forEach((snap) => {
      const data = snap.data();
      if (!data || !data.email) return;
      userDetails.push({ uid: snap.id, email: data.email });
    });
  }

  if (userDetails.length === 0) return;

  await Promise.all(
    userDetails.map(async ({ uid, email }) => {
      const keywords = [...(userKeywordMap.get(uid) || [])];
      const relatedPosts = keywords.flatMap((k) => keywordToPosts.get(k) || []);

      const uniquePosts = Array.from(
        new Map(relatedPosts.map((p) => [p.id, p])).values()
      );

      if (uniquePosts.length === 0) return;

      try {
        await sendGrid(email, keywords, uniquePosts);
      } catch (_) {
        console.error(`[sendEmail] Failed to send email to ${email}:`, err);
      }
    })
  );

  await Promise.all(
    snapshot.docs.map((doc) =>
      updateDocFields(doc.ref, {
        status: "dispatched",
        dispatchedAt: Timestamp.fromDate(new Date()),
      })
    )
  );
});
