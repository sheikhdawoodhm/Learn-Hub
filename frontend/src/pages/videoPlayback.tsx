import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { unlockNextLesson } from "../redux/slices/progressSlice";
import { useModal } from "../context/ModalContext";
import API from "../api/axiosAPI";


const getEmbedUrl = (url: string) => {
  if (!url) return { url: "", isEmbeddable: false };
  
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return { url: `https://www.youtube.com/embed/${videoId}`, isEmbeddable: true };
  }
  
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return { url: `https://www.youtube.com/embed/${videoId}`, isEmbeddable: true };
  }
  
  if (url.includes("youtube.com/embed/")) {
    return { url, isEmbeddable: true };
  }

  // Determine if it's an external link (like a youtube channel) that shouldn't be iframed
  const isEmbeddable = url.endsWith(".mp4") || url.endsWith(".webm") || url.includes("vimeo.com/video/");
  return { url, isEmbeddable };
};

const VideoPlaybackPage = () => {
  const { courseId, moduleId, videoId } = useParams<{ courseId: string; moduleId: string; videoId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { confirm } = useModal();


  const course = useSelector((state: any) =>
    state.courses?.courses?.find((c: any) => String(c.id) === String(courseId))
  );


  const completedLectures = useSelector((state: any) => state.userProgress?.completedLectures || []);

  if (!course) return <div className="p-6 text-center text-slate-500">Course info not found inside memory store.</div>;


  const currentModuleIdx = course.modules?.findIndex((m: any) => String(m.id) === String(moduleId));
  const currentModule = course.modules?.[currentModuleIdx];
  
  const currentVideoIdx = currentModule?.videos?.findIndex((v: any) => String(v.id) === String(videoId));
  const currentVideo = currentModule?.videos?.[currentVideoIdx];


  if (!currentVideo) {
    return (
      <div className="p-12 text-center text-slate-500 max-w-md mx-auto space-y-4">
        <p className="font-semibold text-rose-500">Video Content Disconnected</p>
        <p className="text-sm text-slate-400">
          Target track identifier <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">{videoId}</code> could not be successfully loaded.
        </p>
        <button 
          onClick={() => navigate(`/courses/${courseId}`)} 
          className="text-sm text-indigo-600 font-bold hover:underline cursor-pointer block mx-auto"
        >
          ← Return to Syllabus Dashboard
        </button>
      </div>
    );
  }


  const trackingKey = `${courseId}-${moduleId}-${videoId}`;
  const isLecturePassed = completedLectures.includes(trackingKey);
  const hasQuiz = currentVideo?.questions && currentVideo.questions.length > 0;
  
  const isNextLessonUnlocked = !hasQuiz || isLecturePassed;


  const hasNextVideoInModule = currentVideoIdx + 1 < (currentModule?.videos?.length || 0);
  const hasNextModule = currentModuleIdx + 1 < (course.modules?.length || 0);

  const handleNext = () => {
    if (hasNextVideoInModule) {
      const nextVideo = currentModule.videos[currentVideoIdx + 1];
      navigate(`/courses/${courseId}/module/${moduleId}/video/${nextVideo.id}`);
    } else if (hasNextModule) {
      const nextModule = course.modules[currentModuleIdx + 1];
      const firstVideo = nextModule.videos?.[0];
      if (firstVideo) {
        navigate(`/courses/${courseId}/module/${nextModule.id}/video/${firstVideo.id}`);
      } else {
        navigate(`/courses/${courseId}`);
      }
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  const handleMarkAsCompleted = async () => {
    const confirmed = await confirm({
      title: "Mark Lesson as Completed",
      message: "Are you sure you want to mark this lesson as completed? You will unlock the next lesson.",
    });

    if (confirmed) {
      try {
        dispatch(unlockNextLesson(trackingKey));
        await API.post("/progress/sync", {
          courseId,
          moduleId,
          videoId,
          lectureKey: trackingKey,
          completed: true
        });
      } catch (err) {
        console.error("Database progress sync failed:", err);
      }
    }
  };

  const { url: finalEmbedUrl, isEmbeddable } = getEmbedUrl(currentVideo.videoUrl);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <button
        onClick={() => navigate(`/courses/${courseId}`)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-all cursor-pointer mb-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Syllabus
      </button>

      {/* Video Canvas Aspect Player Layout Frame */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center">
        {isEmbeddable ? (
          <iframe 
            className="w-full h-full" 
            src={finalEmbedUrl} 
            title={currentVideo.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="text-center p-8 space-y-4">
            <div className="w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">External Lesson Material</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              This lesson is hosted on an external platform and cannot be embedded directly in the player.
            </p>
            <a 
              href={finalEmbedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm mt-2"
            >
              Open External Resource →
            </a>
          </div>
        )}
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
          {!hasQuiz && (
            <button
              onClick={handleMarkAsCompleted}
              disabled={isLecturePassed}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isLecturePassed
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-400"
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
              }`}
            >
              {isLecturePassed ? "Completed ✓" : "Mark as Completed"}
            </button>
          )}

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

          {(hasNextVideoInModule || hasNextModule) ? (
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
          ) : (
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm cursor-pointer"
            >
              Finish Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlaybackPage;