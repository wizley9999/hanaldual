import { onDocumentCreated } from "firebase-functions/firestore";
import { analyzePost } from "../services/openai.js";
import {
  getAllKeywords,
  saveAnalyzedPost,
  updateDocFields,
} from "../services/firestore.js";

export const analyzeNewSavedPost = onDocumentCreated(
  {
    document: "posts/{docId}",
    memory: "1GiB",
  },
  async (event) => {
    const postRef = event.data.ref;
    const postData = event.data.data();

    const rawKeywords = await getAllKeywords();
    const keywords = rawKeywords.map((item) => item.keyword);

    const response = await analyzePost(postData, keywords);

    if (!response) {
      await updateDocFields(postRef, { status: "error" });
      return;
    }

    const analysisRef = await saveAnalyzedPost(postRef, {
      content: response.summary,
      author: postData.author,
      matchedKeywords: response.related_keywords,
      title: postData.title,
      link: postData.sourceUrl,
    });

    await updateDocFields(postRef, {
      analysisRef: analysisRef,
      status: "analyzed",
    });
  }
);
