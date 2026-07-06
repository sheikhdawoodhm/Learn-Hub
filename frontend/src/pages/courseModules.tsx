import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BookOpen, PlayCircle, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import API from "../api/axiosAPI";
import { updateSyllabusForCourse } from "../redux/slices/coursesSlice";

const CourseModulesPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const [checkedCourses, setCheckedCourses] = useState<Record<string, boolean>>({});

  const course = useSelector((state: any) =>
    state.courses?.courses?.find((c: any) => String(c.id) === String(courseId))
  );

  const completedLectures = useSelector((state: any) =>
    state.progress?.completedLectures || state.userProgress?.completedLectures || []
  );

  useEffect(() => {
    const fetchSyllabusData = async () => {
      if (!courseId) return;


      if (course?.modules && course.modules.length > 0) return;
      if (checkedCourses[courseId]) return;

      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/modules/${courseId}/syllabus`);

        dispatch(updateSyllabusForCourse({ courseId, modules: response.data.modules || [] }));
        setCheckedCourses(prev => ({ ...prev, [courseId]: true }));
      } catch (err: any) {
        console.error("Failed to load module details:", err);
        setError("Unable to sync course layout details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabusData();
  }, [courseId, course?.modules, dispatch, checkedCourses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <p className="text-slate-500 mb-4">Course details could not be found.</p>
        <button onClick={() => navigate("/")} className="text-indigo-600 font-bold flex items-center gap-1 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        <button
          onClick={() => navigate("/courses")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Courses
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
          <img
            src={course.thumbnail || course.thumbnail_url || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=500"}
            alt={course.title}
            className="w-full sm:w-40 aspect-video sm:aspect-square object-cover rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
          />
          <div className="space-y-2 flex-1">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${course.difficulty === "Beginner" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" :
                course.difficulty === "Intermediate" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600" :
                  "bg-rose-50 dark:bg-rose-950/30 text-rose-600"
              }`}>
              {course.difficulty || "Intermediate"}
            </span>
            <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{course.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 px-1">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Course Syllabus
          </h2>

          {error && <p className="text-sm text-rose-500 px-1">{error}</p>}

          {!course.modules || course.modules.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
              No modules built for this course shell yet.
            </div>
          ) : (
            course.modules.map((mod: any, mIdx: number) => (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="bg-slate-50/70 dark:bg-slate-900/40 px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Module {mIdx + 1}</span>
                    <h3 className="font-bold text-base mt-0.5">{mod.moduleName}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {mod.videos?.length || 0} Lessons
                  </span>
                </div>

                <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {mod.videos?.map((video: any, vIdx: number) => {
                    const lectureKey = `${courseId}-${mod.id}-${video.id}`;
                    const isLecturePassed = completedLectures.includes(lectureKey);

                    let isLocked = false;
                    if (vIdx > 0) {
                      const prevVideo = mod.videos[vIdx - 1];
                      const previousLectureKey = `${courseId}-${mod.id}-${prevVideo.id}`;
                      const hasPrevQuiz = prevVideo.questions?.length > 0;
                      if (hasPrevQuiz && !completedLectures.includes(previousLectureKey)) {
                        isLocked = true;
                      }
                    } else if (mIdx > 0) {
                      const prevModule = course.modules[mIdx - 1];
                      if (prevModule.videos && prevModule.videos.length > 0) {
                        const lastVideo = prevModule.videos[prevModule.videos.length - 1];
                        const prevModuleLastKey = `${courseId}-${prevModule.id}-${lastVideo.id}`;
                        const hasPrevModQuiz = lastVideo.questions?.length > 0;
                        if (hasPrevModQuiz && !completedLectures.includes(prevModuleLastKey)) {
                          isLocked = true;
                        }
                      }
                    }

                    return (
                      <li key={video.id}>
                        <button
                          disabled={isLocked}
                          onClick={() => navigate(`/courses/${courseId}/module/${mod.id}/video/${video.id}`)}
                          className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all group ${isLocked
                              ? "bg-slate-50/50 dark:bg-slate-950/20 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                              : "hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 cursor-pointer text-slate-700 dark:text-slate-300"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isLocked ? (
                              <Lock className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                            ) : isLecturePassed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0 transition-colors" />
                            )}
                            <span className={`text-sm font-medium truncate ${isLocked
                                ? "text-slate-400 dark:text-slate-500"
                                : "group-hover:text-slate-900 dark:group-hover:text-slate-50 text-slate-700 dark:text-slate-300"
                              }`}>
                              {video.videoTitle}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-4">
                            {video.questions?.length > 0 && (
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${isLocked ? "border-slate-200 dark:border-slate-800 text-slate-400" :
                                  isLecturePassed ? "border-emerald-200 bg-emerald-50/50 text-emerald-600" :
                                    "border-indigo-100 bg-indigo-50/50 text-indigo-600 dark:border-indigo-950/50 dark:text-indigo-400"
                                }`}>
                                Quiz Included
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseModulesPage;