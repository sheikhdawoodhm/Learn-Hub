import {
  searchCourses,
  getVideoDetails,
} from "./YoutubeServices";

const getId = (item: any): string =>
  item?.id?.videoId || item?.id;

const formatViews = (views: string) => {
  const num = Number(views);

  if (num >= 1000000)
    return `${(num / 1000000).toFixed(1)}M`;

  if (num >= 1000)
    return `${(num / 1000).toFixed(1)}K`;

  return num.toString();
};

const formatDuration = (duration: string) => {
  const match = duration.match(
    /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  );

  const hours = match?.[1] || "0";
  const minutes = match?.[2] || "0";
  const seconds = match?.[3] || "0";

  return hours !== "0"
    ? `${hours}h ${minutes}m`
    : `${minutes}m ${seconds}s`;
};

export const fetchCourses = async (
  query: string,
  progress: any = {}
) => {
  console.log("Fetching courses for query:", query);
  const data = await searchCourses(query);

  if (!data?.length) return [];

  const videoIDs = data.map(getId).filter(Boolean);

  const videoDetails = await getVideoDetails(videoIDs);

  const videoMap = new Map<string, any>();

  videoDetails?.forEach((video: any) => {
    videoMap.set(video.id, video);
  });

  return data.map((course: any, index: number) => {
    const id = getId(course);
    const video = videoMap.get(id);

    return {
      id,

      title: course.title || "Untitled",
      instructor: course.instructor || "",

      thumbnail:
        course.thumbnail ||
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,

      description: course.description || "",

      updatedAt: course.publishedAt || "",

      views: formatViews(
        video?.statistics?.viewCount || "0"
      ),

      duration: formatDuration(
        video?.contentDetails?.duration || ""
      ),

      progress: progress?.[id]?.progress || 0,

      instructorImage: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,

      rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
      reviews: `${Math.floor(Math.random() * 50) + 1}k`,
      lessons: Math.floor(Math.random() * 80) + 20,
      level: "Beginner",
    };
  });
};