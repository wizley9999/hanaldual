import { onSchedule } from "firebase-functions/scheduler";
import { getPostAnalyses } from "../services/firestore.js";
import { firestore } from "../config/firebase.js";
import { sendGrid } from "../services/sendgrid.js";

export const sendEmail = onSchedule("* */12 * * *", async () => {
  const posts = await getPostAnalyses({
    filters: [
      {
        field: "status",
        value: "pending",
      },
    ],
  });

  if (posts.length === 0) {
    return;
  }

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

  const userKeywordMap = new Map();

  for (let i = 0; i < keywordSnaps.length; i++) {
    const snap = keywordSnaps[i];
    const keyword = [...keywordToPosts.keys()][i];

    if (!snap.exists) continue;

    const subs = snap.data()?.e_subscribers || [];

    for (const uid of subs) {
      if (!userKeywordMap.has(uid)) userKeywordMap.set(uid, new Set());

      userKeywordMap.get(uid).add(keyword);
    }
  }

  if (userKeywordMap.size === 0) {
    return;
  }

  const userRefs = [...userKeywordMap.keys()].map((uid) =>
    firestore.collection("users").doc(uid)
  );

  const userSnaps = await firestore.getAll(...userRefs);

  for (const snap of userSnaps) {
    const data = snap.data();
    if (!data?.email) continue;

    const uid = snap.id;
    const keywords = [...(userKeywordMap.get(uid) || [])];

    const relatedPosts = keywords.flatMap((k) => keywordToPosts.get(k) || []);

    const uniquePosts = Array.from(
      new Map(relatedPosts.map((p) => [p.id, p])).values()
    );

    await sendGrid(data.email, keywords, uniquePosts);

    // status, dispatched update
  }
});
