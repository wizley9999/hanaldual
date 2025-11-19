import { sendPushReq } from "./functions/http/send-push-req.js";

import { deleteNonActiveUsers } from "./functions/schedulers/delete-non-active-users.js";
import { deleteOldPosts } from "./functions/schedulers/delete-old-posts.js";
import { scrapAndSave } from "./functions/schedulers/scrap-and-save.js";

import { analyzePost } from "./functions/triggers/analyze-post.js";
import { sendPush } from "./functions/triggers/send-push.js";

export const sendPushReq_request = sendPushReq;

export const deleteNonActiveUsers_scheduler = deleteNonActiveUsers;
export const deleteOldPosts_scheduler = deleteOldPosts;
export const scrapAndSave_scheduler = scrapAndSave;

export const analyzePost_trigger = analyzePost;
export const sendPush_trigger = sendPush;
