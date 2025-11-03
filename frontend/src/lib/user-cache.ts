import { getUserData } from "./firestore";

const userCache = new Map<
  string,
  {
    data: Record<string, any>;
    timestamp: number;
  }
>();
const CACHE_TTL = 1000 * 60 * 5;

export const getCachedUserData = async (
  uniqueId: string,
  field: string | string[]
) => {
  const cached = userCache.get(uniqueId);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return filterFields(cached.data, field);
  }

  if (!cached) {
    const freshData = await getUserData(uniqueId, [
      "email",
      "e_keywords",
      "token",
      "t_keywords",
      "lastActiveAt",
    ]);
    userCache.set(uniqueId, { data: freshData, timestamp: now });

    if (typeof field === "string") {
      return { [field]: freshData[field] };
    }

    const result: Record<string, any> = {};

    field.forEach((key) => {
      if (key in freshData) result[key] = freshData[key];
    });

    return result;
  }

  const freshData = await getUserData(uniqueId, field);

  if (typeof field === "string") {
    cached.data[field] = freshData[field];
  } else {
    for (const f of field) {
      if (f in freshData) cached.data[f] = freshData[f];
    }
  }

  cached.timestamp = now;
  userCache.set(uniqueId, cached);
  return filterFields(cached.data, field);
};

function filterFields(data: Record<string, any>, field: string | string[]) {
  if (typeof field === "string") return { [field]: data[field] };

  const result: Record<string, any> = {};
  for (const f of field) if (f in data) result[f] = data[f];
  return result;
}

export const invalidateUserCache = (uniqueId: string) => {
  userCache.delete(uniqueId);
};
