export const handleAsync =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      throw new Error(`Operation failed: ${err.message}`);
    }
  };
