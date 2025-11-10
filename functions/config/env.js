import "dotenv/config";

export const Env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  REGION: process.env.REGION ?? "asia-northeast3",
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT) || 30000,
};
