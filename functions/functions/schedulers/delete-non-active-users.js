import { onSchedule } from "firebase-functions/scheduler";
import { Timestamp } from "firebase-admin/firestore";
import { FirestoreService } from "../../services/firestore.js";

export const deleteNonActiveUsers = onSchedule("0 0 * * *", async () => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const toBeDeleted = await FirestoreService.query("users", {
    filters: [
      {
        field: "lastActiveAt",
        op: "<",
        value: Timestamp.fromDate(cutoff),
      },
    ],
  });

  await FirestoreService.deleteBatch(
    "users",
    toBeDeleted.map((data) => data.id)
  );
});
