import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

// ================= YOUTUBE EMBED HELPER =================
// Keeps standard watch links from crashing or being blocked by X-Frame-Options
const getEmbedUrl = (url: string) => {
  if (!url) return "";
  
  // Handle standard watch links: youtube.com/watch?v=ID
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Handle short share links: youtu.be/ID
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url;
};

const VideoPlaybackPage = () => {
  const { courseId, moduleId, videoId } = useParams<{ courseId: string; moduleId: string; videoId: string }>();
  const navigate = useNavigate();

  // 1. Fetch Course Data from Redux
  const course = useSelector((state: any) =>
    state.courses?.courses?.find((c: any) => c.id === courseId)
  );

  // 2. Fetch User Progress (safeguarded against undefined state tree keys)
  const completedLectures = useSelector((state: any) => state.userProgress?.completedLectures || []);

  if (!course) return <div className="p-6 text-center text-slate-500">Course not found</div>;

  const currentModuleIdx = course.modules.findIndex((m: any) => m.id === moduleId);
  const currentModule = course.modules[currentModuleIdx];
  
  // Look up video by matching its unique ID string directly
  const currentVideoIdx = currentModule?.videos?.findIndex((v: any) => v.id === videoId);
  const currentVideo = currentModule?.videos?.[currentVideoIdx];

  if (!currentVideo) return <div className="p-6 text-center text-slate-500">Video not found</div>;

  // 3. PROGRESS LOCK GATE LOGIC
  const trackingKey = `${courseId}-${moduleId}-${videoId}`;
  const isLecturePassed = completedLectures.includes(trackingKey);
  const hasQuiz = currentVideo?.questions && currentVideo.questions.length > 0;
  
  // The student can watch the video instantly, but can ONLY press "Next" if there's no quiz OR if they passed it
  const isNextLessonUnlocked = !hasQuiz || isLecturePassed;

  // 4. SEQUENTIAL NAVIGATION PATH CALCULATIONS
  const hasNextVideoInModule = currentVideoIdx + 1 < currentModule?.videos.length;
  const hasNextModule = currentModuleIdx + 1 < course.modules.length;

  const handleNext = () => {
    if (hasNextVideoInModule) {
      // Advance to next video item inside this identical module shell
      const nextVideo = currentModule.videos[currentVideoIdx + 1];
      navigate(`/courses/${courseId}/module/${moduleId}/video/${nextVideo.id}`);
    } else if (hasNextModule) {
      // Step over module boundary to load video 1 of the next module section
      const nextModule = course.modules[currentModuleIdx + 1];
      const firstVideo = nextModule.videos?.[0];
      if (firstVideo) {
        navigate(`/courses/${courseId}/module/${nextModule.id}/video/${firstVideo.id}`);
      } else {
        navigate(`/courses/${courseId}`);
      }
    } else {
      alert("Congratulations! You completed the entire course! 🎉");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      
      {/* Video Canvas Aspect Player Layout Frame */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
        <iframe 
          className="w-full h-full" 
          src={getEmbedUrl(currentVideo.videoUrl)} 
          title={currentVideo.videoTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{currentVideo.videoTitle}</h1>

      {/* Interactive Ribbon Gating Controls HUD Banner */}
      <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        
        {!isNextLessonUnlocked ? (
          <div className="text-amber-600 dark:text-amber-400 text-sm font-semibold flex items-center gap-1.5">
            ⚠️ You must pass the quiz for this video before moving forward.
          </div>
        ) : (
          <div className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-1.5">
            ✅ Ready for the next lesson!
          </div>
        )}

        <div className="flex gap-3 w-full sm:w-auto justify-end">
          {hasQuiz && (
            <Link
              to={`/courses/${courseId}/module/${moduleId}/video/${videoId}/quiz`}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all text-center ${
                isLecturePassed 
                  ? "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700" 
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-100 dark:shadow-none"
              }`}
            >
              {isLecturePassed ? "Review Quiz" : "Take Required Quiz"}
            </Link>
          )}

          {(hasNextVideoInModule || hasNextModule) && (
            <button
              onClick={handleNext}
              disabled={!isNextLessonUnlocked}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isNextLessonUnlocked
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm cursor-pointer"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              }`}
            >
              Next Lesson →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlaybackPage;