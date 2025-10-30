import OpenAI from "openai";
import axios from "axios";
import { ENV } from "../config/env.js";
import { error } from "firebase-functions/logger";

const client = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export const analyzePost = async (post, keywords) => {
  const imageInputs = await Promise.all(
    post.imageUrls.map(async (url) => {
      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
          timeout: 10000,
          validateStatus: (status) => status >= 200 && status < 400,
        });

        const base64 = Buffer.from(response.data).toString("base64");

        const contentType = response.headers["content-type"] || "";
        const mimeType = contentType.startsWith("image/")
          ? contentType.split(";")[0].trim()
          : "image/jpeg";

        return {
          type: "input_image",
          image_url: `data:${mimeType};base64,${base64}`,
        };
      } catch (_) {
        return null;
      }
    })
  );

  const validImages = imageInputs.filter((input) => input !== null);

  try {
    const response = await client.responses.create({
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
      input: [
        {
          role: "system",
          content:
            "글과 이미지, 카테고리를 기반으로 경어체를 사용하여 요약하고 주어진 키워드 중 의미적으로 관련 있는 것만 선택 후 JSON으로 출력하세요.",
        },
        {
          role: "user",
          content: [
            { type: "input_text", text: `제목: ${post.title}` },
            { type: "input_text", text: `본문: ${post.content}` },
            { type: "input_text", text: `카테고리: ${post.category}` },
            ...validImages,
            {
              type: "input_text",
              text: `선택 가능한 키워드: ${keywords.join(", ")}`,
            },
          ],
        },
      ],
    });

    return JSON.parse(response.output_text);
  } catch (err) {
    error(err);
    return null;
  }
};
