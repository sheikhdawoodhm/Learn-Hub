import {useLocation,useParams,} from "react-router-dom";
import YouTube from "react-youtube";

import { useAppSelector } from "../hooks/useAppSelector";
import { useEffect, useRef } from "react";

function CourseDetails() {
  
  const { videoId } = useParams<{ videoId: string }>();

  const location = useLocation();

  const course = location.state as any;
  
  const intervalRef = useRef<number | null>(null);

  const progress = useAppSelector((state : any)=>{
    return state.userProgress?.progress || {};
  }
  )
  const handleReady = (e : any)=>{
    if (!videoId) return;

    console.log("YouTube Ready");
    const player = e.target;
    const savedTime = progress?.[videoId]?.currentTime;
    const duration = progress?.[videoId]?.getDuration;


    if (
      savedTime > 0 &&
      duration > 0 &&
      savedTime < duration
    ) {
      player.seekTo(savedTime, true);
    }

      intervalRef.current = window.setInterval(() => {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      const percentage =Math.round(  (currentTime / duration) * 100);


      console.log("Dispatching:", {
    videoId,
    progress: percentage,
    currentTime,
  });
      
    },5000)
  }

  useEffect(() => {
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      console.log("Interval cleared");
    }
  };
}, []);

  if (!videoId) {
    return (
      <div>
        Course not found
      </div>
    );
  }

  if (!course) {
  return (
    <div className="p-6">
      Course data not available.
      Please go back to Courses and select a course again.
    </div>
  );
}


  return (
    <div className="max-w-6xl mx-auto p-6">
      <YouTube
      key={videoId}
      videoId={videoId}
      onReady={handleReady}
      opts={{
        width: "100%",
        height: "600",
  }}
/>

      {course && (
        <div className="mt-6">

          <h1 className="text-3xl font-bold">
            {course.title}
          </h1>

          <p className="text-gray-500 mt-2">
            {course.instructor}
          </p>

          <p className="mt-4">
            {course.description}
          </p>

          <div className="flex gap-6 mt-4">
            <span>
              Views: {course.views}
            </span>

            <span>
              Duration: {course.duration}
            </span>
          </div>

        </div>
      )}

      <a
        href={`https:`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-6 px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Watch on YouTube
      </a>

    </div>
  );
}
        

export default CourseDetails;
