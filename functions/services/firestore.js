import { db } from "../config/firebase.js";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const Collections = {
  POSTS: "posts",
  USERS: "users",
  KEYWORDS: "keywords",
  ANALYSES: "postAnalyses",
};

const BATCH_LIMIT = 500;

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
      matchedKeywords: analysis.related_keywords,
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

  async getKeywords() {
    const result = [];

    let lastDoc = null;

    do {
      const query = lastDoc
        ? db
            .collection(Collections.KEYWORDS)
            .orderBy("__name__")
            .startAfter(lastDoc)
            .limit(BATCH_LIMIT)
        : db
            .collection(Collections.KEYWORDS)
            .orderBy("__name__")
            .limit(BATCH_LIMIT);

      const snap = await query.get();

      if (snap.empty) break;

      snap.forEach((doc) =>
        result.push({
          keyword: doc.id,
          subscribers: doc.data().subscribers || [],
          count: doc.data().count || 0,
        })
      );

      lastDoc = snap.docs[snap.docs.length - 1];
    } while (lastDoc);

    return result;
  },

  async appendUserReceived(uid, data) {
    const ref = db.collection(Collections.USERS).doc(uid);

    const docSnap = await ref.get();
    const userData = docSnap.data() || {};
    const currentReceived = userData.received || [];

    const newItem = {
      ...data,
      createdAt: Timestamp.now(),
    };
    const updatedArray = [...currentReceived, newItem];

    updatedArray.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

    const limitedArray = updatedArray.slice(0, 10);

    await ref.update({
      received: limitedArray,
    });
  },
};
