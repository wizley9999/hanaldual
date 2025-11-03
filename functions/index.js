import { scrapeAndSaveNewPosts } from "./schedulers/scape-and-save-new-posts.js";
import { deleteOldSavedPosts } from "./schedulers/delete-old-saved-posts.js";
import { analyzeNewSavedPost } from "./triggers/analyze-new-saved-post.js";
import { updateKeywords } from "./triggers/update-keywords.js";

export const deleteOldSavedPosts_scheduler = deleteOldSavedPosts;
export const scrapeAndSaveNewPosts_scheduler = scrapeAndSaveNewPosts;
export const analyzeNewSavedPost_trigger = analyzeNewSavedPost;
export const updateKeywords_trigger = updateKeywords;
