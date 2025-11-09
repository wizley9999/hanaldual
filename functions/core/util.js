export const Util = {
  parseLocalDate: (dateString) => {
    const parts = dateString.split(/[-./]/).map(Number);
    const [year, month, day] = parts;
    return new Date(year, month - 1, day, 0, 0, 0);
  },
};
