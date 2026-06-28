import { useForm } from "@tanstack/react-form";
import { useSelector } from "@tanstack/react-store";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {useLocation} from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  Video as VideoIcon, 
  BookOpen, 
  HelpCircle, 
  Check, 
  Sparkles,
  ArrowRight,
  PlusCircle
} from "lucide-react";

// Import your custom action from your Redux slice
import { updateCourseModules } from "../../redux/slices/coursesSlice";
import { useEffect, useRef } from "react";

type Question = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D" | "";
};

type Video = {
  id :String
  videoTitle: string;
  videoUrl: string;
  questions: Question[];
};

type Module = {
  id: string;
  moduleName: string;
  videos: Video[];
};

type FormValues = {
  modules: Module[];
};



const AddModule = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const courseId = location.state?.courseId as string | undefined;

  const navigate = useNavigate();

  const isPublished = useRef(false);

useEffect(() => {
  return () => {
    if (!isPublished.current) {
      dispatch(deleteCourse(courseId));
    }
  };
}, [courseId]);
  // ================= TANSTACK FORM SETUP =================
  const form = useForm({
    defaultValues: {
      modules: [],
    } as FormValues,

    
    onSubmit: async ({ value }) => {
      dispatch(
        updateCourseModules({
          courseId: courseId!,
          modules: value.modules,
        })
      );
      isPublished.current = true;
      console.log(`SUBMITTING MODULES FOR COURSE ID (${courseId}):`, value.modules);
      navigate(`/courses`);
    },
  });

  const modules = useSelector(form.store, (state) => state.values.modules) ?? [];

  const checkFormInvalid = () => {
    if (modules.length === 0) return true; 
    if (modules[0]?.videos.length === 0) return true;
    
    return modules.some((module) => {
      if (!module.moduleName.trim()) return true; 
      
      return (module.videos ?? []).some((video) => {
        if (!video.videoTitle.trim() || !video.videoUrl.trim()) return true; 
        
        return (video.questions ?? []).some((q) => {
          return (
            !q.question.trim() ||
            !q.optionA.trim() ||
            !q.optionB.trim() ||
            !q.optionC.trim() ||
            !q.optionD.trim() ||
            !q.correctAnswer
          );
        });
      });
    });
  };

  const isFormInvalid = checkFormInvalid();

  const inputStyles =
    "w-full rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm";

  // ================= LOCAL EVENT HANDLERS (No Redux Shadowing) =================
  const handleAddModule = () => {
    const current = form.state.values.modules ?? [];
    form.setFieldValue("modules", [
      ...current,
      {
        id: crypto.randomUUID(),
        moduleName: "",
        videos: [],
      },
    ]);
  };

  const handleRemoveModule = (i: number) => {
    const current = form.state.values.modules ?? [];
    form.setFieldValue(
      "modules",
      current.filter((_, idx) => idx !== i)
    );
  };

  const updateModuleName = (i: number, value: string) => {
    const current = form.state.values.modules ?? [];
    const updated = [...current];
    updated[i] = {
      ...updated[i],
      moduleName: value,
    };
    form.setFieldValue("modules", updated);
  };

  const addVideo = (mIndex: number) => {
    const current = form.state.values.modules ?? [];
    const updated = [...current];
    updated[mIndex] = {
      ...updated[mIndex],
      videos: [
        ...(updated[mIndex].videos ?? []),
        {
          id : crypto.randomUUID(),
          videoTitle: "",
          videoUrl: "",
          questions: [],
        },
      ],
    };
    form.setFieldValue("modules", updated);
  };

  const removeVideo = (mIndex: number, vIndex: number) => {
    const current = form.state.values.modules ?? [];
    const updated = [...current];
    updated[mIndex] = {
      ...updated[mIndex],
      videos: (updated[mIndex].videos ?? []).filter((_, idx) => idx !== vIndex),
    };
    form.setFieldValue("modules", updated);
  };

  const updateVideo = (
    mIndex: number,
    vIndex: number,
    field: "videoTitle" | "videoUrl",
    value: string
  ) => {
    const current = form.state.values.modules ?? [];
    const updated = [...current];
    const videos = [...(updated[mIndex].videos ?? [])];
    videos[vIndex] = {
      ...videos[vIndex],
      [field]: value,
    };
    updated[mIndex] = {
      ...updated[mIndex],
      videos,
    };
    form.setFieldValue("modules", updated);
  };

  const addQuestion = (mIndex: number, vIndex: number) => {
    const current = form.state.values.modules ?? [];
    const updated = [...current];
    const videos = [...(updated[mIndex].videos ?? [])];
    const questions = [...(videos[vIndex].questions ?? [])];
    questions.push({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    });
    videos[vIndex] = {
      ...videos[vIndex],
      questions,
    };
    updated[mIndex] = {
      ...updated[mIndex],
      videos,
    };
    form.setFieldValue("modules", updated);
  };

  const removeQuestion = (mIndex: number, vIndex: number, qIndex: number) => {
    const current = form.state.values.modules ?? [];
    const updated = [...current];
    const videos = [...(updated[mIndex].videos ?? [])];
    videos[vIndex] = {
      ...videos[vIndex],
      questions: (videos[vIndex].questions ?? []).filter((_, idx) => idx !== qIndex),
    };
    updated[mIndex] = {
      ...updated[mIndex],
      videos,
    };
    form.setFieldValue("modules", updated);
  };

  const updateQuestion = (
    mIndex: number,
    vIndex: number,
    qIndex: number,
    field: keyof Question,
    value: string
  ) => {
    const current = form.state.values.modules ?? [];
    const updated = [...current];
    const videos = [...(updated[mIndex].videos ?? [])];
    const questions = [...(videos[vIndex].questions ?? [])];
    questions[qIndex] = {
      ...questions[qIndex],
      [field]: value as any,
    };
    videos[vIndex] = {
      ...videos[vIndex],
      questions,
    };
    updated[mIndex] = {
      ...updated[mIndex],
      videos,
    };
    form.setFieldValue("modules", updated);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Course Modules</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Adding modules to Course: <span className="font-bold text-indigo-600 dark:text-indigo-400">{courseId}</span>
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-950 dark:text-slate-500 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
            <Sparkles className="w-3 h-3 text-yellow-500" /> Step 2 of 2
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(); 
          }}
          className="space-y-8"
        >
          {modules.length === 0 && (
            <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Modules Added</h3>
              <p className="text-slate-400 dark:text-slate-500 max-w-sm mx-auto text-sm mt-1">Get started by creating your first course learning module.</p>
              <button
                type="button"
                onClick={handleAddModule}
                className="mt-5 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add First Module
              </button>
            </div>
          )}

          {modules.map((module, mIndex) => (
            <div 
              key={module.id || mIndex} 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 relative overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 border-l-indigo-500"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    {mIndex + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 font-mono">Module</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveModule(mIndex)}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-xl transition-colors duration-150 cursor-pointer"
                  title="Remove Module"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Module Name *</label>
                <input
                  required
                  className={inputStyles}
                  placeholder="e.g. Introduction to React 19"
                  value={module.moduleName}
                  onChange={(e) => updateModuleName(mIndex, e.target.value)}
                />
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Videos ({module.videos?.length ?? 0})</h4>
                </div>

                {module.videos?.map((video, vIndex) => (
                  <div 
                    key={vIndex} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 relative border-l-3 border-l-violet-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <VideoIcon className="w-4 h-4 text-violet-500" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Video {mIndex + 1}.{vIndex + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(mIndex, vIndex)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
                        title="Remove Video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Video Title *</label>
                        <input
                          required
                          className={inputStyles}
                          placeholder="e.g. Setting up the environment"
                          value={video.videoTitle}
                          onChange={(e) => updateVideo(mIndex, vIndex, "videoTitle", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Video URL *</label>
                        <input
                          required
                          type="url"
                          className={inputStyles}
                          placeholder="e.g. https://www.youtube.com/watch?v=..."
                          value={video.videoUrl}
                          onChange={(e) => updateVideo(mIndex, vIndex, "videoUrl", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Quiz Block Sections */}
                    <div className="space-y-4 mt-5 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-emerald-500" /> Quizzes ({video.questions?.length ?? 0})
                        </h5>
                      </div>

                      {video.questions?.map((q, qIndex) => (
                        <div 
                          key={qIndex} 
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 relative shadow-sm border-l-2 border-l-emerald-500"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                              Question {qIndex + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeQuestion(mIndex, vIndex, qIndex)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
                              title="Remove Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <input
                            required
                            className={inputStyles}
                            placeholder="Type the quiz question here..."
                            value={q.question}
                            onChange={(e) => updateQuestion(mIndex, vIndex, qIndex, "question", e.target.value)}
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
                            {[
                              { label: "Option A", key: "optionA" as const },
                              { label: "Option B", key: "optionB" as const },
                              { label: "Option C", key: "optionC" as const },
                              { label: "Option D", key: "optionD" as const },
                            ].map((opt) => (
                              <div key={opt.key} className="relative flex items-center">
                                <span className="absolute left-3.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-5 h-5 rounded-md flex items-center justify-center">
                                  {opt.label.slice(-1)}
                                </span>
                                <input
                                  required
                                  className={`${inputStyles} pl-11`}
                                  placeholder={opt.label}
                                  value={q[opt.key]}
                                  onChange={(e) => updateQuestion(mIndex, vIndex, qIndex, opt.key, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>

                          {/* Interactive Correct Answer Choices */}
                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              Select Correct Answer:
                            </span>
                            <div className="flex gap-2">
                              {(["A", "B", "C", "D"] as const).map((letter) => {
                                const isSelected = q.correctAnswer === letter;
                                return (
                                  <button
                                    key={letter}
                                    type="button"
                                    onClick={() => updateQuestion(mIndex, vIndex, qIndex, "correctAnswer", letter)}
                                    className={`w-10 h-9 rounded-lg font-bold text-xs transition-all flex items-center justify-center border cursor-pointer ${
                                      isSelected
                                        ? "bg-emerald-500 border-emerald-500 text-white shadow-sm ring-2 ring-emerald-300 dark:ring-emerald-950"
                                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    }`}
                                  >
                                    {letter}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addQuestion(mIndex, vIndex)}
                        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs py-2 px-3 rounded-lg transition-colors border border-slate-200/50 dark:border-slate-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-500" /> Add Question
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addVideo(mIndex)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-violet-500" /> Add Video to Module
                </button>
              </div>
            </div>
          ))}

          {modules.length > 0 && (
            <button
              type="button"
              onClick={handleAddModule}
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/10 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-indigo-500" /> Add Learning Module
            </button>
          )}

          {modules.length > 0 && (
            <div className="flex items-center justify-end gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
              <button
                type="submit"
                disabled={isFormInvalid}
                className={`
                  font-bold 
                  py-2.5 
                  px-6 
                  rounded-xl 
                  shadow-md 
                  transition-all 
                  duration-150 
                  flex 
                  items-center 
                  gap-2 
                  text-sm 
                  ${isFormInvalid
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-100 dark:shadow-none hover:shadow-lg cursor-pointer"
                  }
                `}
              >
                Create Course <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddModule;

function deleteCourse(courseId: string | undefined): any {
  if (!courseId) return;
  console.log(`User left the page early. Course ${courseId} would be deleted here.`);
}
