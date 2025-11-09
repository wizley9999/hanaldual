import { sendPushReq } from "./functions/http/send-push-req.js";
import { updateLastActive } from "./functions/http/update-last-active.js";

import { deleteOldPosts } from "./functions/schedulers/delete-old-posts.js";
import { scrapAndSave } from "./functions/schedulers/scrap-and-save.js";

import { analyzePost } from "./functions/triggers/analyze-post.js";
import { deleteKeyword } from "./functions/triggers/delete-keyword.js";
import { sendPush } from "./functions/triggers/send-push.js";
import { updateUser } from "./functions/triggers/update-user.js";

export const sendPushReq_request = sendPushReq;
export const updateLastActive_request = updateLastActive;

export const deleteOldPosts_scheduler = deleteOldPosts;
export const scrapAndSave_scheduler = scrapAndSave;

export const analyzePost_trigger = analyzePost;
export const deleteKeyword_trigger = deleteKeyword;
export const sendPush_trigger = sendPush;
export const updateUser_trigger = updateUser;
