import { onSchedule } from "firebase-functions/scheduler";
import { getSavedPosts, saveNewPosts } from "../services/firestore.js";
import { getPostDetail, getPostList } from "../services/scrap.js";
import { Utils } from "../config/utils.js";

export const scrapeAndSaveNewPosts = onSchedule("*/10 * * * *", async () => {
  const savedPosts = await getSavedPosts({ limit: 30 });
  const savedUrls = savedPosts.map((post) => post.sourceUrl);
  const latestSavedDate = savedPosts[0].createdAt.toDate();

  const newPosts = [];
  let page = 1;
  let stop = false;

  while (!stop) {
    const posts = await getPostList(page);
    if (!posts.length) break;

    let filteredPosts;

    if (savedPosts.length === 0) {
      newPosts.push(...posts);
      stop = true;

      continue;
    }

    filteredPosts = posts.filter((post) => {
      const postDate = Utils.parseLocalDate(post.date);

      if (postDate < latestSavedDate) return false;

      return !savedUrls.includes(post.link);
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
    const postDetail = await getPostDetail(newPost.link);
    newPostDetails.push(postDetail);
  }

  await saveNewPosts(newPostDetails);
});
