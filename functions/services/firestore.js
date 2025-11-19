import { db } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

const Collections = {
  POSTS: "posts",
  USERS: "users",
  ANALYSES: "postAnalyses",
};

export const FirestoreService = {
  async query(collection, { filters = [], orderBy = [], limit } = {}) {
    let ref = db.collection(collection);

    filters.forEach(({ field, op = "==", value }) => {
      ref = ref.where(field, op, value);
    });

    orderBy.forEach(({ field, direction = "asc" }) => {
      ref = ref.orderBy(field, direction);
    });

    if (limit) ref = ref.limit(limit);

    const snapshot = await ref.get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async savePosts(posts) {
    const batch = db.batch();

    const ref = db.collection(Collections.POSTS);

    posts.forEach((p) => {
      const doc = ref.doc();

      batch.set(doc, {
        ...p,
        createdAt: Timestamp.fromDate(p.createdAt),
        scrapedAt: Timestamp.fromDate(p.scrapedAt),
        status: "pending",
      });
    });

    await batch.commit();
  },

  async saveAnalysis(analysis, post, postRef) {
    const ref = db.collection(Collections.ANALYSES).doc();

    await ref.set({
      content: analysis.summary,
      analyzedAt: Timestamp.fromDate(analysis.analyzedAt),
      dispatchedAt: null,
      title: post.title,
      link: `${post.sourceUrl}?layout=unknown`,
      postRef: postRef,
      status: "pending",
    });
  },

  async update(ref, data) {
    return ref.update(data);
  },

  async deleteBatch(collection, ids) {
    const batch = db.batch();

    ids.forEach((id) => batch.delete(db.collection(collection).doc(id)));

    await batch.commit();
  },
};
