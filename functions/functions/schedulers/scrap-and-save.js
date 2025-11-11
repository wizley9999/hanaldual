import { onSchedule } from "firebase-functions/scheduler";
import { FirestoreService } from "../../services/firestore.js";
import { ScrapService } from "../../services/scrap.js";
import { Util } from "../../core/util.js";

export const scrapAndSave = onSchedule("*/10 * * * *", async () => {
  const savedPosts = await FirestoreService.query("posts", {
    orderBy: [
      {
        field: "scrapedAt",
        direction: "desc",
      },
    ],
    limit: 30,
  });

  const latestDate =
    savedPosts.length > 0 ? savedPosts[0].createdAt.toDate() : null;

  const sourceUrls = savedPosts.map((post) => post.sourceUrl);

  const newPosts = [];
  let page = 1;
  let stop = false;

  while (!stop) {
    const posts = await ScrapService.getPostList(page);

    if (!posts.length) break;

    if (!latestDate) {
      newPosts.push(...posts.slice(0, 10));
      stop = true;

      continue;
    }

    const filteredPosts = posts.filter((post) => {
      const postDate = Util.parseLocalDate(post.date);

      if (postDate < latestDate) return false;

      return !sourceUrls.includes(post.link);
    });

    if (filteredPosts.length > 0) {
      newPosts.push(...filteredPosts);
      page += 1;

      continue;
    }

    stop = true;
  }

  newPosts.reverse();

  const newPostDetails = [];

  for (const newPost of newPosts) {
    const detail = await ScrapService.getPostDetail(newPost.link);
    newPostDetails.push(detail);
  }

  await FirestoreService.savePosts(newPostDetails);
});
