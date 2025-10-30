import { analyzeFakePost, makeFakeKeywords } from "./example.js";
import { scrapeAndSaveNewPosts } from "./schedulers/scape-and-save-new-posts.js";

export const func1 = makeFakeKeywords;
export const func2 = scrapeAndSaveNewPosts;
export const func3 = analyzeFakePost;
