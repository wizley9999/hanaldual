import OpenAI from "openai";
import axios from "axios";
import { Env } from "../config/env.js";
import { Logger } from "../core/logger.js";

const client = new OpenAI({ apiKey: Env.OPENAI_API_KEY });

export const OpenAIService = {
  async analyzePost(post, keywords) {
    const images = await this._prepareImages(post.imageUrls);

    const prompt = [
      {
        role: "system",
        content: [
          { type: "input_text", text: "당신은 게시글 분석 전문가입니다." },
          {
            type: "input_text",
            text: "글과 이미지, 카테고리를 기반으로 경어체를 사용하여 요약하고, 반드시 주어진 키워드만 사용하여 게시글과 관련성이 있는 키워드만 선택하세요.",
          },
          {
            type: "input_text",
            text: `주어진 키워드: [${keywords.join(", ")}]`,
          },
          {
            type: "input_text",
            text: "summary에는 요약한 내용을 입력하세요.",
          },
          {
            type: "input_text",
            text: "주어진 키워드 전부 게시글과 관련이 없다고 판단되면, related_keywords를 빈 배열로 반환할 수 있습니다.",
          },
          {
            type: "input_text",
            text: "출력은 JSON으로만 하며, related_keywords는 주어진 키워드 목록에서만 선택하세요.",
          },
        ],
      },
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
          timeout: Env.DEFAULT_TIMEOUT,
          validateStatus: (status) => status >= 200 && status < 400,
        });

        const mime = res.headers["content-type"] || "image/jpeg";
        const base64 = Buffer.from(res.data).toString("base64");
        return {
          type: "input_image",
          image_url: `data:${mime};base64,${base64}`,
        };
      } catch {
        return null;
      }
    });

    return (await Promise.all(tasks)).filter(Boolean);
  },
};
