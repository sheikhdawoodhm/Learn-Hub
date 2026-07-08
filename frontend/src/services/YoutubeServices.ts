const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const buildQuery = (query: string) => {
  const q = query.toLowerCase().trim();

  if (q.includes("ai") || q.includes("artificial intelligence")) {
    return "artificial intelligence tutorial";
  }

  if (q.includes("react")) {
    return "react js tutorial";
  }

  if (q.includes("node")) {
    return "node js tutorial";
  }

  return `${query} course`;
};

const normalizeCourse = (item: any) => {
  return {
    id: item?.id?.videoId || "",
    title: item?.snippet?.title || "Untitled",
    instructor: item?.snippet?.channelTitle || "Unknown",
    thumbnail: item?.snippet?.thumbnails?.high?.url || "",
    description: item?.snippet?.description || "",
    publishedAt: item?.snippet?.publishedAt || "",
  };
};

export const searchCourses = async (query: string) => {
  const finalQuery = buildQuery(query);

  const cacheKey = `courses_${finalQuery}`;
  const cachedData = sessionStorage.getItem(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        finalQuery
      )}&type=video&videoDuration=long&maxResults=12&key=${API_KEY}`
    );

    const data = await response.json();

    if (!response.ok || !data?.items) {
      return [];
    }
    const mapped = data.items.map(normalizeCourse);

    sessionStorage.setItem(cacheKey, JSON.stringify(mapped));

    return mapped;
  } catch {
    return [];
  }
};

export const getVideoDetails = async (videoIds: string[]) => {
  if (!videoIds?.length) return [];

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds.join(
        ","
      )}&key=${API_KEY}`
    );

    const data = await response.json();

    if (!response.ok || !data?.items) {
      return [];
    }

    return data.items;
  } catch {
    return [];
  }
};
