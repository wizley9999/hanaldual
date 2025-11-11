import "dotenv/config";

export const Env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  REGION: process.env.REGION ?? "asia-northeast3",
  AXIOS_TIMEOUT: Number(process.env.AXIOS_TIMEOUT) || 12000,
  HTTP_PASS: process.env.HTTP_PASS ?? "",
};
