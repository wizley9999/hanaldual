import { scrapeAndSaveNewPosts } from "./schedulers/scape-and-save-new-posts.js";
import { deleteOldSavedPosts } from "./schedulers/delete-old-saved-posts.js";
import { analyzeNewSavedPost } from "./triggers/analyze-new-saved-post.js";
import { updateKeywords } from "./triggers/update-keywords.js";
import { sendPushRequest } from "./requests/send-push-request.js";
import { sendEmail } from "./schedulers/send-email.js";
import { sendPushNotification } from "./triggers/send-push-notification.js";
import { sendPushWelcome } from "./triggers/send-push-welcome.js";

export const sendPushReqeust_request = sendPushRequest;
export const deleteOldSavedPosts_scheduler = deleteOldSavedPosts;
export const scrapeAndSaveNewPosts_scheduler = scrapeAndSaveNewPosts;
export const snedEmail_scheduler = sendEmail;
export const analyzeNewSavedPost_trigger = analyzeNewSavedPost;
export const sendPushNotification_trigger = sendPushNotification;
export const sendPushWelcome_trigger = sendPushWelcome;
export const updateKeywords_trigger = updateKeywords;
