import { firestore } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";
import { Utils } from "../config/utils.js";

const BATCH_LIMIT = 500;

export const getSavedPosts = async (options = {}) => {
  let query = firestore.collection("posts");

  if (options.filters && Array.isArray(options.filters)) {
    // filters: [{ field: "status", op: "==", value: "pending" }, ...]
    options.filters.forEach(({ field, op = "==", value }) => {
      query = query.where(field, op, value);
    });
  }

  if (options.orderBy && Array.isArray(options.orderBy)) {
    // orderBy: [{ field: "scrapedAt", direction: "desc" }, ...]
    options.orderBy.forEach(({ field, direction = "asc" }) => {
      query = query.orderBy(field, direction);
    });
  } else {
    query = query.orderBy("scrapedAt", "desc");
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const snapshot = await query.get();

  if (snapshot.empty) return [];

  const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return result;
};

export const getPostAnalysesRef = (options = {}) => {
  let query = firestore.collection("postAnalyses");

  if (options.filters && Array.isArray(options.filters)) {
    // filters: [{ field: "status", op: "==", value: "pending" }, ...]
    options.filters.forEach(({ field, op = "==", value }) => {
      query = query.where(field, op, value);
    });
  }

  if (options.orderBy && Array.isArray(options.orderBy)) {
    // orderBy: [{ field: "scrapedAt", direction: "desc" }, ...]
    options.orderBy.forEach(({ field, direction = "asc" }) => {
      query = query.orderBy(field, direction);
    });
  } else {
    query = query.orderBy("analyzedAt", "desc");
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return query;
};

export const saveNewPosts = async (posts) => {
  const batch = firestore.batch();

  const postsRef = firestore.collection("posts");

  posts.forEach((post) => {
    const ref = postsRef.doc();

    batch.set(ref, {
      analysisRef: null,
      author: post.author,
      category: post.category,
      content: post.content,
      createdAt: Timestamp.fromDate(Utils.parseLocalDate(post.createdAt)),
      hasAttachments: post.hasAttachments,
      imageUrls: post.images,
      scrapedAt: Timestamp.fromDate(post.scrapedAt),
      sourceUrl: post.sourceUrl,
      status: "pending",
      title: post.title,
    });
  });

  await batch.commit();
};

export const deleteSavedPosts = async (posts) => {
  if (!Array.isArray(posts) || posts.length === 0) return;

  const postsRef = firestore.collection("posts");

  for (let i = 0; i < posts.length; i += BATCH_LIMIT) {
    const slice = posts.slice(i, i + BATCH_LIMIT);
    const batch = firestore.batch();

    slice.forEach((post) => {
      const ref = postsRef.doc(post.id);
      batch.delete(ref);
    });

    await batch.commit();
  }
};

export const saveAnalyzedPost = async (postRef, analyzedPost) => {
  const postAnalysesRef = firestore.collection("postAnalyses").doc();

  await postAnalysesRef.set({
    content: analyzedPost.content,
    analyzedAt: Timestamp.fromDate(new Date()),
    author: analyzedPost.author,
    dispatchedAt: null,
    link: analyzedPost.link,
    matchedKeywords: analyzedPost.matchedKeywords,
    postRef: postRef,
    status: "pending",
    title: analyzedPost.title,
  });

  return postAnalysesRef;
};

export const updateDocFields = async (ref, fields = {}) => {
  await ref.update(fields);
};

export const getAllKeywords = async (limit = 1000) => {
  const all = [];

  let lastDoc = null;
  let query = firestore.collection("keywords").orderBy("__name__").limit(limit);

  while (true) {
    const snap = await query.get();
    if (snap.empty) break;

    snap.forEach((doc) => {
      const data = doc.data();
      all.push({
        keyword: doc.id,
        e_subscribers: data.e_subscribers || [],
        t_subscribers: data.t_subscribers || [],
      });
    });

    lastDoc = snap.docs[snap.docs.length - 1];

    query = firestore
      .collection("keywords")
      .orderBy("__name__")
      .startAfter(lastDoc)
      .limit(limit);

    if (snap.size < limit) break;
  }

  return all;
};
