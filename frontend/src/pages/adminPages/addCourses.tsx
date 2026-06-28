import { useForm } from "@tanstack/react-form";
import { useSelector } from "@tanstack/react-store";
import { useTheme } from "../../context/themeContext";
import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";

import { 
  BookOpen, 
  Award, 
  FileText, 
  Image as ImageIcon, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { addCourse, setCourses } from "../../redux/slices/coursesSlice";


type CourseValues = {
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Expert" | "";
  description: string;
  thumbnail: string;
};

type Course = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  thumbnail: string;
  modules: Module[];
};

type Module = {
  id: string;
  moduleName: string;
  videos: Video[];
};

type Video = {
  id: string;
  videoTitle: string;
  videoUrl: string;
  questions: Question[];
};

type Question = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
};

const AddCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      title: "",
      difficulty: "",
      description: "",
      thumbnail: "",
    } as CourseValues,

    onSubmit: async ({ value }) => {

      const course = {
        id : crypto.randomUUID(),
        ...value,
        modules: [],
      }
      dispatch(addCourse(course));
      console.log("COURSE PAYLOAD:", value);
      
      const courseId = course.id; 
      console.log("Navigating to add module for course ID:", courseId);
      navigate("/add-module", { state: { courseId: courseId } });
    },
  });

  const values = useSelector(form.store, (state) => state.values);

  const isFormInvalid = 
    !values.title.trim() || 
    !values.difficulty || 
    !values.description.trim() || 
    !values.thumbnail.trim();

  const inputStyles =
    "w-full rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm";

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start bg-white dark:bg-slate-900 min-h-screen">
      <div className="w-full max-w-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md p-6 sm:p-8">
        
        {/* Header */}
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
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
            >
              Course Title *
            </label>
            <input
              type="text"
              id="title"
              required
              placeholder="e.g. Master React 19 from Scratch"
              value={values.title}
              onChange={(e) => form.setFieldValue("title", e.target.value)}
              className={inputStyles}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500" /> Difficulty Level *
            </label>

            <div className="grid grid-cols-3 gap-3">
              {[
                { 
                  name: "Beginner" as const, 
                  activeClass: "bg-emerald-500 border-emerald-500 text-white shadow-sm ring-2 ring-emerald-300 dark:ring-emerald-950",
                  inactiveClass: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:text-emerald-600"
                },
                { 
                  name: "Intermediate" as const, 
                  activeClass: "bg-amber-500 border-amber-500 text-white shadow-sm ring-2 ring-amber-300 dark:ring-amber-950",
                  inactiveClass: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:text-amber-600"
                },
                { 
                  name: "Expert" as const, 
                  activeClass: "bg-rose-500 border-rose-500 text-white shadow-sm ring-2 ring-rose-300 dark:ring-rose-950",
                  inactiveClass: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 hover:text-rose-600"
                }
              ].map((tier) => {
                const isSelected = values.difficulty === tier.name;
                return (
                  <button
                    key={tier.name}
                    type="button"
                    onClick={() => form.setFieldValue("difficulty", tier.name)}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected ? tier.activeClass : tier.inactiveClass
                    }`}
                  >
                    {tier.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-indigo-500" /> Course Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              placeholder="Describe what students will learn in this course..."
              value={values.description}
              onChange={(e) => form.setFieldValue("description", e.target.value)}
              className={`${inputStyles} resize-none`}
            />
          </div>

          <div>
            <label
              htmlFor="thumbnail"
              className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"
            >
              <ImageIcon className="w-4 h-4 text-indigo-500" /> Thumbnail URL *
            </label>
            <input
              type="url"
              id="thumbnail"
              required
              placeholder="e.g. https://example.com/images/react-thumbnail.jpg"
              value={values.thumbnail}
              onChange={(e) => form.setFieldValue("thumbnail", e.target.value)}
              className={inputStyles}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
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
              Save & Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;