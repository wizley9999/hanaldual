import { onDocumentCreated } from "firebase-functions/firestore";
import { FirestoreService } from "../../services/firestore.js";
import { OpenAIService } from "../../services/openai.js";

export const analyzePost = onDocumentCreated(
  {
    document: "posts/{docId}",
    memory: "1GiB",
  },
  async (event) => {
    const postRef = event.data.ref;
    const post = event.data.data();

    const analysis = await OpenAIService.analyzePost(post);

    if (!analysis) {
      await FirestoreService.update(postRef, { status: "error" });
      return;
    }

    await FirestoreService.saveAnalysis(analysis, post, postRef);

    await FirestoreService.update(postRef, { status: "analyzed" });
  }
);
