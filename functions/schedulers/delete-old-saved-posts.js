import { onSchedule } from "firebase-functions/scheduler";
import { deleteSavedPosts, getSavedPosts } from "../services/firestore.js";

export const deleteOldSavedPosts = onSchedule("0 0 * * *", async () => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const toBeDeleted = await getSavedPosts({
    filters: [
      {
        field: "createdAt",
        op: "<",
        value: Timestamp.fromDate(cutoff),
      },
    ],
  });

  await deleteSavedPosts(toBeDeleted);
});
