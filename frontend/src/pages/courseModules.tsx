import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BookOpen, PlayCircle, Lock, CheckCircle2, ArrowLeft, Plus, Trash2, Award, Pencil } from "lucide-react";
import API from "../api/axiosAPI";
import { updateSyllabusForCourse } from "../redux/slices/coursesSlice";
import ReviewSection from "../components/ReviewSection";
import { useNotification } from "../context/NotificationContext";
import { useModal } from "../context/ModalContext";

const CourseModulesPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const { confirm, prompt } = useModal();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const [checkedCourses, setCheckedCourses] = useState<Record<string, boolean>>({});

  const reduxCourse = useSelector((state: any) =>
    state.courses?.courses?.find((c: any) => String(c.id) === String(courseId))
  );
  
  const [localCourse, setLocalCourse] = useState<any>(null);
  const course = reduxCourse || localCourse;

  const completedLectures = useSelector((state: any) =>
    state.progress?.completedLectures || state.userProgress?.completedLectures || []
  );

  const totalLessons = course?.total_lessons || course?.totalLessons ||
    course?.modules?.reduce((acc: number, mod: any) => acc + (mod.videos?.length || 0), 0) || 0;

  const completedForThisCourse = completedLectures.filter((key: string) =>
    key.startsWith(`${courseId}-`)
  ).length;

  const isCourseCompleted = totalLessons > 0 && completedForThisCourse >= totalLessons;

  const { user } = useSelector((state: any) => state.auth);
  const canManageCourses = user?.role === "admin" || user?.role === "instructor";

  const handleDeleteCourse = async () => {
    const confirmed = await confirm({
      title: "Delete Course",
      message: "Are you sure you want to delete this course? This action cannot be undone."
    });
    if (confirmed) {
      try {
        await API.delete(`/courses/${courseId}`);
        showNotification("Course deleted successfully", "success");
        navigate("/courses");
      } catch (err: any) {
        showNotification(err.response?.data?.message || "Failed to delete course", "error");
      }
    }
  };

  useEffect(() => {
    const fetchSyllabusData = async () => {
      if (!courseId) return;

      if (course?.modules && course.modules.length > 0) return;
      if (checkedCourses[courseId]) return;

      try {
        setLoading(true);
        setError(null);
        
        let fetchedCourse = null;
        if (!reduxCourse && !localCourse) {
          const courseRes = await API.get(`/courses/${courseId}`);
          if (courseRes.data.success) {
            fetchedCourse = courseRes.data.course;
            setLocalCourse(courseRes.data.course);
          }
        }

        const response = await API.get(`/modules/${courseId}/syllabus`);
        
        if (!reduxCourse) {
          setLocalCourse((prev: any) => ({ ...(prev || fetchedCourse), modules: response.data.modules || [] }));
        } else {
          dispatch(updateSyllabusForCourse({ courseId, modules: response.data.modules || [] }));
        }
        
        setCheckedCourses(prev => ({ ...prev, [courseId]: true }));
      } catch (err: any) {
        console.error("Failed to load module details:", err);
        setError("Unable to sync course layout details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabusData();
  }, [courseId, reduxCourse, localCourse, course?.modules, dispatch, checkedCourses]);

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
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Course Syllabus
            </h2>
            {canManageCourses && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/add-module`, { state: { courseId } })}
                  className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Module
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={handleDeleteCourse}
                    className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Delete Course
                  </button>
                )}
              </div>
            )}
          </div>

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
                    <h3 className="font-bold text-base mt-0.5 flex items-center gap-2">
                      {mod.moduleName}
                      {canManageCourses && (
                        <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const newName = await prompt({
                                title: "Edit Module",
                                message: "Enter new module name:",
                                defaultValue: mod.moduleName
                              });
                              if (newName && newName !== mod.moduleName) {
                                try {
                                  await API.put(`/modules/${mod.id}`, { title: newName, module_order: mIdx + 1 });
                                  showNotification("Module updated successfully", "success");
                                  window.location.reload();
                                } catch (err: any) {
                                  showNotification(err.response?.data?.message || "Failed to update module", "error");
                                }
                              }
                            }}
                            className="text-slate-400 hover:text-indigo-500"
                            title="Edit Module"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const confirmed = await confirm({
                                title: "Delete Module",
                                message: `Delete module "${mod.moduleName}"? This will delete all its videos.`
                              });
                              if (confirmed) {
                                try {
                                  await API.delete(`/modules/${mod.id}`);
                                  showNotification("Module deleted successfully", "success");
                                  window.location.reload();
                                } catch (err: any) {
                                  showNotification(err.response?.data?.message || "Failed to delete module", "error");
                                }
                              }
                            }}
                            className="text-slate-400 hover:text-red-500"
                            title="Delete Module"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </h3>
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
                    // Disable locking for admins/instructors
                    if (!canManageCourses) {
                      if (vIdx > 0) {
                        const prevVideo = mod.videos[vIdx - 1];
                        const previousLectureKey = `${courseId}-${mod.id}-${prevVideo.id}`;
                        if (!completedLectures.includes(previousLectureKey)) {
                          isLocked = true;
                        }
                      } else if (mIdx > 0) {
                        const prevModule = course.modules[mIdx - 1];
                        if (prevModule.videos && prevModule.videos.length > 0) {
                          const lastVideo = prevModule.videos[prevModule.videos.length - 1];
                          const prevModuleLastKey = `${courseId}-${prevModule.id}-${lastVideo.id}`;
                          if (!completedLectures.includes(prevModuleLastKey)) {
                            isLocked = true;
                          }
                        }
                      }
                    }

                    return (
                      <li key={video.id}>
                        <div
                          className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all group ${isLocked && !canManageCourses
                              ? "bg-slate-50/50 dark:bg-slate-950/20 text-slate-300 dark:text-slate-700"
                              : "hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 text-slate-700 dark:text-slate-300"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <button
                              disabled={isLocked && !canManageCourses}
                              onClick={() => navigate(`/courses/${courseId}/module/${mod.id}/video/${video.id}`)}
                              className="flex items-center gap-3 flex-1 min-w-0 text-left disabled:cursor-not-allowed cursor-pointer focus:outline-none"
                            >
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
                            </button>
                            {canManageCourses && (
                              <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newName = await prompt({
                                      title: "Edit Video",
                                      message: "Enter new video title:",
                                      defaultValue: video.videoTitle
                                    });
                                    if (newName) {
                                      const newUrl = await prompt({
                                        title: "Edit Video URL",
                                        message: "Enter new video URL (e.g. https://www.youtube.com/watch?v=...):",
                                        defaultValue: video.videoUrl
                                      });
                                      if (newUrl) {
                                        try {
                                          await API.put(`/videos/${video.id}`, { title: newName, video_url: newUrl, video_order: vIdx + 1, module_id: mod.id });
                                          showNotification("Video updated successfully", "success");
                                          window.location.reload();
                                        } catch (err: any) {
                                          showNotification(err.response?.data?.message || "Failed to update video", "error");
                                        }
                                      }
                                    }
                                  }}
                                  className="text-slate-400 hover:text-indigo-500"
                                  title="Edit Video"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const confirmed = await confirm({
                                      title: "Delete Video",
                                      message: `Delete video "${video.videoTitle}"?`
                                    });
                                    if (confirmed) {
                                      try {
                                        await API.delete(`/videos/${video.id}`);
                                        showNotification("Video deleted successfully", "success");
                                        window.location.reload();
                                      } catch (err: any) {
                                        showNotification(err.response?.data?.message || "Failed to delete video", "error");
                                      }
                                    }
                                  }}
                                  className="text-slate-400 hover:text-red-500"
                                  title="Delete Video"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-4">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${isLocked ? "border-slate-200 dark:border-slate-800 text-slate-400" :
                                  isLecturePassed ? "border-emerald-200 bg-emerald-50/50 text-emerald-600" :
                                    "border-indigo-100 bg-indigo-50/50 text-indigo-600 dark:border-indigo-950/50 dark:text-indigo-400"
                                }`}>
                                Quiz Included
                              </span>
                
                            {video.questions?.length > 0 && canManageCourses && (
                              <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const q = video.questions[0];
                                    const newQ = await prompt({ title: "Edit Quiz Question", message: "Question text:", defaultValue: q.question });
                                    if (newQ) {
                                      const newA = await prompt({ title: "Option A", message: "Text for Option A:", defaultValue: q.optionA });
                                      const newB = await prompt({ title: "Option B", message: "Text for Option B:", defaultValue: q.optionB });
                                      const newC = await prompt({ title: "Option C", message: "Text for Option C:", defaultValue: q.optionC });
                                      const newD = await prompt({ title: "Option D", message: "Text for Option D:", defaultValue: q.optionD });
                                      const newCorrect = await prompt({ title: "Correct Answer", message: "Enter A, B, C, or D:", defaultValue: "A" });
                                      
                                      if (newA && newB && newC && newD && newCorrect) {
                                        try {
                                          await API.put(`/quizzes/question/${q.id}`, {
                                            question: newQ,
                                            options: [
                                              { letter: 'A', text: newA },
                                              { letter: 'B', text: newB },
                                              { letter: 'C', text: newC },
                                              { letter: 'D', text: newD },
                                            ],
                                            correctAnswer: newCorrect.toUpperCase()
                                          });
                                          showNotification("Quiz updated successfully", "success");
                                          window.location.reload();
                                        } catch (err: any) {
                                          showNotification(err.response?.data?.message || "Failed to update quiz", "error");
                                        }
                                      }
                                    }
                                  }}
                                  className="text-slate-400 hover:text-indigo-500"
                                  title="Edit Quiz"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const confirmed = await confirm({
                                      title: "Delete Quiz",
                                      message: `Delete quiz for this video?`
                                    });
                                    if (confirmed) {
                                      try {
                                        await API.delete(`/quizzes/${video.questions[0].quiz_id || video.questions[0].id}`);
                                        showNotification("Quiz deleted successfully", "success");
                                        window.location.reload();
                                      } catch (err: any) {
                                        showNotification(err.response?.data?.message || "Failed to delete quiz", "error");
                                      }
                                    }
                                  }}
                                  className="text-slate-400 hover:text-red-500"
                                  title="Delete Quiz"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        {isCourseCompleted && (
          <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6 text-center mt-8 shadow-sm">
            <Award className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Congratulations! You've completed the course.</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm max-w-lg mx-auto">
              You have successfully completed all modules and quizzes. You can now claim your certificate of completion!
            </p>
            <button
              onClick={() => navigate(`/courses/${courseId}/certificate`)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm"
            >
              <Award className="w-5 h-5" /> Get My Certificate
            </button>
          </div>
        )}

        <ReviewSection courseId={courseId as string} />
      </div>
    </div>
  );
};

export default CourseModulesPage;
