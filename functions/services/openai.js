import OpenAI from "openai";
import axios from "axios";
import { Env } from "../config/env.js";
import { Logger } from "../core/logger.js";
import { system_prompt } from "../config/constant.js";

const client = new OpenAI({ apiKey: Env.OPENAI_API_KEY });

export const OpenAIService = {
  async analyzePost(post, keywords) {
    const images = await this._prepareImages(post.images);

    const prompt = [
      system_prompt(keywords),
      {
        role: "user",
        content: [
          { type: "input_text", text: `제목: ${post.title}` },
          {
            type: "input_text",
            text: `본문: ${post.content.trim().replace(/\s+/g, " ")}`,
          },
          { type: "input_text", text: `카테고리: ${post.category}` },
          ...images,
        ],
      },
    ];

    try {
      const res = await client.responses.create({
        model: "gpt-4o",
        text: {
          format: {
            type: "json_schema",
            name: "post_analysis",
            schema: {
              type: "object",
              properties: {
                summary: { type: "string" },
                related_keywords: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["summary", "related_keywords"],
              additionalProperties: false,
            },
            strict: true,
          },
        },
        input: prompt,
      });

      const parsed = JSON.parse(res.output_text);

      return { ...parsed, analyzedAt: new Date() };
    } catch (e) {
      Logger.error("OpenAI API error", e);
      return null;
    }
  },

  async _prepareImages(urls = []) {
    const tasks = urls.map(async (url) => {
      try {
        const res = await axios.get(url, {
          responseType: "arraybuffer",
          timeout: Env.AXIOS_TIMEOUT,
          validateStatus: (status) => status >= 200 && status < 400,
        });

        const contentType = res.headers["content-type"] || "image/jpeg";
        const mime = contentType.split(";")[0].trim();
        const base64 = Buffer.from(res.data).toString("base64");

        return {
          type: "input_image",
          image_url: `data:${mime};base64,${base64}`,
        };
      } catch (_) {
        return null;
      }
    });

    return (await Promise.all(tasks)).filter(Boolean);
  },
};
