import { onSchedule } from "firebase-functions/scheduler";
import { Timestamp } from "firebase-admin/firestore";
import { FirestoreService } from "../../services/firestore.js";

export const deleteOldPosts = onSchedule("0 0 * * *", async () => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const toBeDeleted = await FirestoreService.query("posts", {
    filters: [
      {
        field: "createdAt",
        op: "<",
        value: Timestamp.fromDate(cutoff),
      },
    ],
  });

  await FirestoreService.deleteBatch(
    "posts",
    toBeDeleted.map((data) => data.id)
  );
});
