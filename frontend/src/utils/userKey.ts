export const getKey = (base: string, userId: string) => {
  return `${base}_${userId}`;
};