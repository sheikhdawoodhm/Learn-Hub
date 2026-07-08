import React from "react";
import { useForm } from "@tanstack/react-form";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Plus, Trash2, Video, HelpCircle, Save, Sparkles, Layers } from "lucide-react";
import API from "../../api/axiosAPI";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { saveModulesSchema } from "../../validationRules/createCourseRules";
import { useModal } from "../../context/ModalContext";

type BackendValidationError = {
  success: boolean;
  errors: Array<{ field: string; message: string }>;
};

const AddModule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { confirm } = useModal();
  
  // Robustly extract courseId from state or URL query params
  const courseId = location.state?.courseId || new URLSearchParams(location.search).get("courseId");

  const form = useForm({
    // @ts-ignore: version mismatch between react-form and zod-form-adapter
    validatorAdapter: zodValidator(),
    defaultValues: {
      modules: [
        {
          moduleName: "",
          videos: [
            {
              videoTitle: "",
              videoUrl: "",
              questions: [
                {
                  question: "",
                  optionA: "",
                  optionB: "",
                  optionC: "",
                  optionD: "",
                  correctAnswer: "A",
                },
              ],
            },
          ],
        },
      ],
    },
    validators: {
      onChange: saveModulesSchema,
    },
    onSubmit: async ({ value }) => {
      if (!courseId) {
        alert("Missing course information. Please create the course settings first.");
        return;
      }
      const result = saveModulesSchema.safeParse(value);
      if (!result.success) {
        const validationMessages = result.error.issues
          .map((issue) => `• ${issue.path.join(".") || "field"}: ${issue.message}`)
          .join("\n");
        alert(`Validation Error:\n\n${validationMessages}`);
        return;
      }

      try {
        await API.post(`/courses/${courseId}/modules`, value);
        alert("Your course curriculum has been successfully saved!");
        navigate("/courses");
      } catch (err) {
        const error = err as AxiosError<BackendValidationError>;
        console.error("Failed to save modules:", error);

        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          const stringifyError = (msg: any): string => {
            if (typeof msg === 'string') return msg;
            if (typeof msg === 'object' && msg !== null) return msg.message || JSON.stringify(msg);
            return String(msg);
          };

          const errorMessages = error.response.data.errors
            .map(e => `• ${stringifyError(e.field)}: ${stringifyError(e.message)}`)
            .join("\n");

          alert(`Validation Error:\n\n${errorMessages}`);
        } else {
          alert("Could not save your chapters. Please check your fields.");
        }
      }
    },
  });

  const inputStyles =
    "w-full rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all";

  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-slate-500">
        <p className="font-semibold">No active course found. Please go back and create a course outline first.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 min-h-screen flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md p-6 sm:p-8">

        <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Add Course Content</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Divide your course into chapters, add video lessons, and create quick quiz questions.</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
            <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" /> Step 2 of 2
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          <form.Field
            name="modules"
            children={(modulesField) => (
              <div className="space-y-8">
                {modulesField.state.value.map((module, mIndex: number) => (
                  <div key={mIndex} className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">Chapter {mIndex + 1}</h3>
                      {modulesField.state.value.length > 1 && (
                        <button
                          type="button"
                          onClick={async () => {
                            const isConfirmed = await confirm({
                              title: "Delete Chapter",
                              message: "Are you sure you want to delete this entire chapter? All videos and quizzes inside will be lost."
                            });
                            if (isConfirmed) {
                              const nextModules = [...modulesField.state.value];
                              nextModules.splice(mIndex, 1);
                              modulesField.setValue(nextModules);
                            }
                          }}
                          className="text-rose-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" /> 
                          <span className="hidden sm:inline">Remove Chapter</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Chapter Name *</label>
                      <form.Field
                        name={`modules[${mIndex}].moduleName`}
                        validators={{ onChange: z.string().trim().min(1, "Module name cannot be left blank") }}
                        children={(subField) => (
                          <>
                            <input
                              type="text"
                              placeholder="e.g. Introduction to React Basics"
                              value={subField.state.value}
                              onChange={(e) => subField.setValue(e.target.value)}
                              onBlur={subField.handleBlur}
                              className={inputStyles}
                            />
                            {subField.state.meta.isTouched && subField.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 font-semibold mt-0.5 animate-fadeIn">
                                {subField.state.meta.errors.map((err: any) => err?.message || String(err)).join(", ")}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>

                    <div className="pl-4 border-l-2 border-indigo-100 dark:border-indigo-950 space-y-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5 tracking-wider">
                        <Video className="w-3.5 h-3.5 text-indigo-500" /> Video Lessons
                      </h4>

                      {module.videos.map((video, vIndex: number) => (
                        <div key={vIndex} className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-2">
                            <span className="text-xs font-bold text-slate-400">Lesson {vIndex + 1}</span>
                            {module.videos.length > 1 && (
                              <button
                                type="button"
                                onClick={async () => {
                                  const isConfirmed = await confirm({
                                    title: "Delete Video Lesson",
                                    message: "Are you sure you want to delete this video lesson and its quizzes?"
                                  });
                                  if (isConfirmed) {
                                    const nextModules = [...modulesField.state.value];
                                    nextModules[mIndex].videos.splice(vIndex, 1);
                                    modulesField.setValue(nextModules);
                                  }
                                }}
                                className="text-rose-500 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all text-xs font-medium flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Video Title *</label>
                              <form.Field
                                name={`modules[${mIndex}].videos[${vIndex}].videoTitle`}
                                validators={{ onChange: z.string().trim().min(1, "Video title is required") }}
                                children={(subField) => (
                                  <>
                                    <input
                                      type="text"
                                      placeholder="e.g. Setting up your project workspace"
                                      value={subField.state.value}
                                      onChange={(e) => subField.setValue(e.target.value)}
                                      onBlur={subField.handleBlur}
                                      className={inputStyles}
                                    />
                                    {subField.state.meta.isTouched && subField.state.meta.errors.length > 0 && (
                                      <p className="text-xs text-red-500 font-semibold mt-1 animate-fadeIn">
                                        {subField.state.meta.errors.map((err: any) => err?.message || String(err)).join(", ")}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Video Link *</label>
                              <form.Field
                                name={`modules[${mIndex}].videos[${vIndex}].videoUrl`}
                                validators={{ onChange: z.string().trim().url("Must be a valid URL (include http:// or https://)") }}
                                children={(subField) => (
                                  <>
                                    <input
                                      type="url"
                                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                                      value={subField.state.value}
                                      onChange={(e) => subField.setValue(e.target.value)}
                                      onBlur={subField.handleBlur}
                                      className={inputStyles}
                                    />
                                    {subField.state.meta.isTouched && subField.state.meta.errors.length > 0 && (
                                      <p className="text-xs text-red-500 font-semibold mt-1 animate-fadeIn">
                                        {subField.state.meta.errors.map((err: any) => err?.message || String(err)).join(", ")}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>

                          <div className="pt-2 space-y-4">
                            <h5 className="text-[10px] font-bold text-slate-400 tracking-widest flex items-center gap-1 uppercase">
                              <HelpCircle className="w-3 h-3 text-emerald-500" /> Lesson Quiz Questions
                            </h5>

                            {video.questions.map((_, qIndex: number) => (
                              <div key={qIndex} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-bold text-slate-400 uppercase">Question {qIndex + 1}</span>
                                  {video.questions.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const isConfirmed = await confirm({
                                          title: "Delete Question",
                                          message: "Are you sure you want to delete this quiz question?"
                                        });
                                        if (isConfirmed) {
                                          const nextModules = [...modulesField.state.value];
                                          nextModules[mIndex].videos[vIndex].questions.splice(qIndex, 1);
                                          modulesField.setValue(nextModules);
                                        }
                                      }}
                                      className="text-rose-500 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all flex items-center gap-1 cursor-pointer"
                                      title="Delete Question"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                <div>
                                  <form.Field
                                    name={`modules[${mIndex}].videos[${vIndex}].questions[${qIndex}].question`}
                                    validators={{ onChange: z.string().trim().min(1, "Question text cannot be empty") }}
                                    children={(subField) => (
                                      <>
                                        <input
                                          type="text"
                                          placeholder="Type your question here"
                                          value={subField.state.value}
                                          onChange={(e) => subField.setValue(e.target.value)}
                                          onBlur={subField.handleBlur}
                                          className={inputStyles}
                                        />
                                        {subField.state.meta.isTouched && subField.state.meta.errors.length > 0 && (
                                          <p className="text-xs text-red-500 font-semibold mt-1 animate-fadeIn">
                                            {subField.state.meta.errors.map((err: any) => err?.message || String(err)).join(", ")}
                                          </p>
                                        )}
                                      </>
                                    )}
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  {(["A", "B", "C", "D"] as const).map((opt) => (
                                    <div key={opt} className="flex flex-col gap-0.5">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-slate-400">{opt}:</span>
                                        <form.Field
                                          name={`modules[${mIndex}].videos[${vIndex}].questions[${qIndex}].option${opt}`}
                                          validators={{ onChange: z.string().trim().min(1, `Option ${opt} configuration required`) }}
                                          children={(subField) => (
                                            <div className="w-full">
                                              <input
                                                type="text"
                                                placeholder={`Option ${opt}`}
                                                value={subField.state.value}
                                                onChange={(e) => subField.setValue(e.target.value)}
                                                onBlur={subField.handleBlur}
                                                className={inputStyles}
                                              />
                                              {subField.state.meta.isTouched && subField.state.meta.errors.length > 0 && (
                                                <p className="text-[10px] text-red-500 font-semibold mt-0.5 animate-fadeIn">
                                                  {subField.state.meta.errors.map((err: any) => err?.message || String(err)).join(", ")}
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                  <span className="text-[11px] font-bold text-slate-400 uppercase">Correct Answer:</span>
                                  <form.Field
                                    name={`modules[${mIndex}].videos[${vIndex}].questions[${qIndex}].correctAnswer`}
                                    children={(subField) => (
                                      <select
                                        value={subField.state.value}
                                        onChange={(e) => subField.setValue(e.target.value as "A" | "B" | "C" | "D")}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                                      >
                                        <option value="A">Option A</option>
                                        <option value="B">Option B</option>
                                        <option value="C">Option C</option>
                                        <option value="D">Option D</option>
                                      </select>
                                    )}
                                  />
                                </div>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const nextModules = [...modulesField.state.value];
                                nextModules[mIndex].videos[vIndex].questions.push({
                                  question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A"
                                });
                                modulesField.setValue(nextModules);
                              }}
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Add a Quiz Question
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const nextModules = [...modulesField.state.value];
                          nextModules[mIndex].videos.push({
                            videoTitle: "",
                            videoUrl: "",
                            questions: [{ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" }]
                          });
                          modulesField.setValue(nextModules);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Another Video Lesson
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    modulesField.setValue([
                      ...modulesField.state.value,
                      {
                        moduleName: "",
                        videos: [{ videoTitle: "", videoUrl: "", questions: [{ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" }] }]
                      }
                    ]);
                  }}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-500 hover:text-indigo-600 font-bold text-sm flex items-center justify-center gap-2 transition bg-white dark:bg-slate-950 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Another Chapter
                </button>
              </div>
            )}
          />

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="font-bold py-2.5 px-6 rounded-xl shadow-md bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 text-sm cursor-pointer transition"
            >
              Save & Complete Course <Save className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModule;
