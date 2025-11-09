import axios from "axios";
import * as cheerio from "cheerio";
import { Url } from "../config/url.js";
import { Env } from "../config/env.js";
import { Logger } from "../core/logger.js";
import { Util } from "../core/util.js";

const http = axios.create({
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  timeout: Env.DEFAULT_TIMEOUT,
});

export const ScrapService = {
  async getPostList(page = 1) {
    try {
      const { data } = await http.post(Url.list, { page });

      const $ = cheerio.load(data);

      return $("table.board-table.horizon1 > tbody > tr")
        .map((_, tr) => {
          const $tr = $(tr);

          if ($tr.hasClass("notice") || $tr.hasClass("blind")) return null;

          return {
            author: $tr.find("td.td-write").text().trim(),
            date: $tr.find("td.td-date").text().trim(),
            link: `${Url.base}${$tr.find("td.td-subject > a").attr("href")}`,
          };
        })
        .get()
        .filter(Boolean);
    } catch (e) {
      Logger.error("Scraping post list failed", e);
      return [];
    }
  },

  async getPostDetail(url) {
    try {
      const { data } = await http.get(url);
      const $ = cheerio.load(data);

      const title = $("h2.view-title").text().trim();
      const category = $("dl.cate > dd").text().trim();
      const createdAt = $("dl.write > dd").text().trim();
      const author = $("dl.writer > dd").text().trim();
      const content = $("div.view-con").text().trim();
      const images = $("div.view-con img")
        .map((_, img) => $(img).attr("src"))
        .get();

      const hasAttachments = $("div.view-file span.no-file").length === 0;

      return {
        title,
        category,
        createdAt: Util.parseLocalDate(createdAt),
        author,
        content,
        images,
        hasAttachments,
        sourceUrl: url,
        scrapedAt: new Date(),
      };
    } catch (e) {
      Logger.error("Scraping post detail failed", e);
      return null;
    }
  },
};
