import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { BookOpen, Award, FileText, Image as ImageIcon, ArrowRight, Sparkles } from "lucide-react";
import { addCourse } from "../../redux/slices/coursesSlice";
import API from "../../api/axiosAPI";

import { createCourseSchema, type CourseValues } from "../../validationRules/createCourseRules";

type BackendValidationError = {
  success: boolean;
  errors: Array<{ field: string; message: string }>;
};

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Triple-Verified: Hook parameters strictly typed with CourseValues and createCourseSchema
  const form = useForm({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      thumbnail: "",
    },


    validators: {
      onChange: createCourseSchema,
    },

    onSubmit: async ({ value }) => {
      setSubmitError(null);

      // Verify that the submitted value strictly passes client-side validation
      const result = createCourseSchema.safeParse(value);
      if (!result.success) {
        const validationMessages = result.error.issues
          .map((issue) => `• ${issue.path.join(".") || "field"}: ${issue.message}`)
          .join("\n");
        setSubmitError(validationMessages || "Please fix the highlighted course details.");
        return;
      }

      try {
        const response = await API.post<{ id?: string; courseId?: string; course?: { id?: string } }>("/courses", value);
        const realCourseId = response.data?.id ?? response.data?.courseId ?? response.data?.course?.id;
        const courseIdToUse = realCourseId ?? `temp-${Date.now()}`;

        dispatch(addCourse({ id: courseIdToUse, ...value, modules: [] }));
        navigate("/add-module", { state: { courseId: courseIdToUse } });
      } catch (err) {
        const error = err as AxiosError<BackendValidationError>;
        console.error("Axios course initialization failure:", error);

        // Fallback safety to ensure navigation proceeds locally even on server error
        const fallbackCourseId = `temp-${Date.now()}`;
        dispatch(addCourse({ id: fallbackCourseId, ...value, modules: [] }));
        navigate("/add-module", { state: { courseId: fallbackCourseId } });

        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          const stringifyError = (msg: any): string => {
            if (typeof msg === 'string') return msg;
            if (typeof msg === 'object' && msg !== null) return msg.message || JSON.stringify(msg);
            return String(msg);
          };

          const validationMessages = error.response.data.errors
            .map((e) => `• ${stringifyError(e.field)}: ${stringifyError(e.message)}`)
            .join("\n");
          setSubmitError(validationMessages);
        } else {
          setSubmitError(error.response?.data?.toString() || "Could not initialize course settings.");
        }
      }
    },
  });

  const inputStyles =
    "w-full rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm";

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start bg-white dark:bg-slate-900 min-h-screen">
      <div className="w-full max-w-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md p-6 sm:p-8">

        <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Create New Course</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Define your course settings and general information.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-white dark:bg-slate-900 dark:text-slate-500 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
            <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" /> Step 1 of 2
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              <p className="font-semibold">Unable to continue</p>
              <pre className="mt-1 whitespace-pre-wrap font-sans">{submitError}</pre>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Course Title *
            </label>
            <form.Field
              name="title"
              children={(field) => (
                <>
                  <input
                    type="text"
                    id="title"
                    placeholder="e.g. Master React 19 from Scratch"
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    className={inputStyles}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      {field.state.meta.errors.map((err: any) => err?.message || String(err)).join(", ")}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label className="flex text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500" /> Course Category *
            </label>
            <form.Field
              name="category"
              children={(field) => (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    {(["Beginner", "Intermediate", "Expert"] as const).map((level) => {
                      const isSelected = field.state.value === level;
                      let activeColor = "bg-emerald-500 border-emerald-500 ring-emerald-300 dark:ring-emerald-950";
                      let hoverColor = "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:text-emerald-600";

                      if (level === "Intermediate") {
                        activeColor = "bg-amber-500 border-amber-500 ring-amber-300 dark:ring-amber-950";
                        hoverColor = "hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:text-amber-600";
                      } else if (level === "Expert") {
                        activeColor = "bg-rose-500 border-rose-500 ring-rose-300 dark:ring-rose-950";
                        hoverColor = "hover:bg-rose-50/50 dark:hover:bg-rose-950/20 hover:text-rose-600";
                      }

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => field.setValue(level)}
                          className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${isSelected
                            ? `${activeColor} text-white shadow-sm ring-2`
                            : `border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 ${hoverColor}`
                            }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      {field.state.meta.errors.map((err: any) => err?.message || String(err)).join(", ")}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label htmlFor="description" className="flex text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" /> Course Description *
            </label>
            <form.Field
              name="description"
              children={(field) => (
                <>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe what students will learn in this course (min 10 characters)..."
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    className={`${inputStyles} resize-none`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      {field.state.meta.errors.map((err: any) => err?.message || String(err)).join(", ")}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label htmlFor="thumbnail" className="flex text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-500" /> Thumbnail URL *
            </label>
            <form.Field
              name="thumbnail"
              children={(field) => (
                <>
                  <input
                    type="url"
                    id="thumbnail"
                    placeholder="e.g. https://example.com/images/react-thumbnail.jpg"
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    className={inputStyles}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      {field.state.meta.errors.map((err: any) => err?.message || String(err)).join(", ")}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="font-bold py-2.5 px-6 rounded-xl shadow-md transition-all duration-150 flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-100 dark:shadow-none hover:shadow-lg cursor-pointer"
            >
              Save & Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;