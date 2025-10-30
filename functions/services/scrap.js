import axios from "axios";
import * as cheerio from "cheerio";
import { URLS } from "../config/urls.js";

export const getPostList = async (page) => {
  const baseUrl = URLS.base;
  const pageUrl = URLS.page;

  const { data: html } = await axios.post(
    pageUrl,
    { page: page },
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const $ = cheerio.load(html);

  const results = [];

  $("table.board-table.horizon1 > tbody > tr").each((_, tr) => {
    const $tr = $(tr);

    // class="notice || blind"
    if ($tr.hasClass("notice") || $tr.hasClass("blind")) return;

    // td.td-write
    const author = $tr.find("td.td-write").text().trim();

    // td.td-date
    const date = $tr.find("td.td-date").text().trim();

    // td.td-subject > a
    const aTag = $tr.find("td.td-subject > a");
    const href = aTag.attr("href");

    results.push({
      author: author,
      date: date,
      link: `${baseUrl}${href}`,
    });
  });

  return results;
};

export const getPostDetail = async (url) => {
  const { data: html } = await axios.get(url);

  const $ = cheerio.load(html);

  const $boardInfo = $("div.board-view-info");

  const title = $boardInfo.find("div.view-info > h2.view-title").text().trim();

  const $detailInfo = $boardInfo.find("div.view-detail > div.view-util");

  const category = $detailInfo.find("dl.cate > dd").text().trim();
  const createdAt = $detailInfo.find("dl.write > dd").text().trim();
  const author = $detailInfo.find("dl.writer > dd").text().trim();

  const $content = $("div.view-con");

  const content = $content.text().trim();

  const images = [];
  $content.find("img").each((_, img) => {
    const src = $(img).attr("src");
    images.push(src);
  });

  const $insert = $("div.view-file > dl.row > dd.insert");

  let hasAttachments = false;

  if ($insert.find("ul").length > 0) {
    hasAttachments = true;
  }

  if ($insert.find("span.no-file").length > 0) {
    hasAttachments = false;
  }

  const sourceUrl = url;
  const scrapedAt = new Date();

  return {
    title,
    category,
    createdAt,
    author,
    content,
    images,
    hasAttachments,
    sourceUrl,
    scrapedAt,
  };
};
