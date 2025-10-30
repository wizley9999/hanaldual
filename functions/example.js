import { onRequest } from "firebase-functions/https";
import { firestore } from "./config/firebase.js";
import {
  getAllKeywords,
  saveAnalyzedPost,
  updateDocFields,
} from "./services/firestore.js";
import { analyzePost } from "./services/openai.js";

export const makeFakeKeywords = onRequest(async (req, res) => {
  const keywordsRef = firestore.collection("keywords");

  const ke = [
    "비교과포인트",
    "장학금",
    "인턴",
    "개강",
    "수강신청",
    "기말고사",
    "중간고사",
    "교수님 바보",
  ];

  for (const k of ke) {
    await keywordsRef.doc(k).set({
      e_subscribers: [],
      t_subscribers: [],
    });
  }

  res.status(200).send();
});

export const analyzeFakePost = onRequest(async (req, res) => {
  // func3({ method: "POST", body: { postId: "1zkrvbKtHVxtjE7q93Qp" } });
  const postId = req.body.postId;

  const postRef = firestore.collection("posts").doc(postId);
  const postData = (await postRef.get()).data();

  const rawKeywords = await getAllKeywords();
  const keywords = rawKeywords.map((item) => item.keyword);

  const response = await analyzePost(postData, keywords);

  if (!response) {
    await updateDocFields(postRef, { status: "error" });
    return res.status(501).send();
  }

  const analysisRef = await saveAnalyzedPost(postRef, {
    analysisContent: response.summary,
    matchedKeywords: response.related_keywords,
    title: postData.title,
  });

  await updateDocFields(postRef, {
    analysisRef: analysisRef,
    status: "analyzed",
  });

  res.status(200).send();
});
