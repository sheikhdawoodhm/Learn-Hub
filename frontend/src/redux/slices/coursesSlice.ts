import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Question = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D" | "";
};

type Video = {
  id: string; // Ensure this is present matching your updated schema
  videoTitle: string;
  videoUrl: string;
  questions: Question[];
};

type Module = {
  id: string;
  moduleName: string;
  videos: Video[];
};

type Course = {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  thumbnail: string;
  modules: Module[];
};

type CourseState = {
  courses: Course[];
};

// ================= LOCALSTORAGE HELPERS =================
const LOCAL_STORAGE_KEY = "lms_saved_courses";

// Safely load initial data if it exists in the user's browser memory
const loadInitialCourses = (): Course[] => {
  try {
    const serializedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedData === null) return [];
    return JSON.parse(serializedData);
  } catch (err) {
    console.error("Could not load courses from localStorage:", err);
    return [];
  }
};

// Helper utility to update localStorage cleanly inside reducers
const saveToLocalStorage = (courses: Course[]) => {
  try {
    const serializedData = JSON.stringify(courses);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedData);
  } catch (err) {
    console.error("Could not save courses to localStorage:", err);
  }
};

const initialState: CourseState = {
  courses: loadInitialCourses(), // 👈 Automatically pull local data on app boot!
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses(state, action: PayloadAction<Course[]>) {
      state.courses = action.payload;
      saveToLocalStorage(state.courses); // 💾 Save progress
    },

    addCourse(state, action: PayloadAction<Course>) {
      state.courses.push(action.payload);
      saveToLocalStorage(state.courses); // 💾 Save progress
    },

    updateCourseModules(
      state,
      action: PayloadAction<{
        courseId: string;
        modules: Module[];
      }>
    ) {
      const { courseId, modules } = action.payload;
      const course = state.courses.find((c) => c.id === courseId);

      if (course) {
        course.modules = modules;
        saveToLocalStorage(state.courses); // 💾 Save progress
      }
    },
    
    deleteCourse(state, action: PayloadAction<string>) {
      state.courses = state.courses.filter(c => c.id !== action.payload);
      saveToLocalStorage(state.courses); // 💾 Save progress
    },

    addModule(
      state,
      action: PayloadAction<{
        courseId: string;
        module: Module;
      }>
    ) {
      const { courseId, module } = action.payload;
      const course = state.courses.find((c) => c.id === courseId);

      if (course) {
        course.modules.push(module);
        saveToLocalStorage(state.courses); // 💾 Save progress
      }
    },

    addVideo(
      state,
      action: PayloadAction<{
        courseId: string;
        moduleId: string;
        video: Video;
      }>
    ) {
      const { courseId, moduleId, video } = action.payload;
      const course = state.courses.find((c) => c.id === courseId);
      
      if (course) {
        const module = course.modules.find((m) => m.id === moduleId);
        if (module) {
          module.videos.push(video);
          saveToLocalStorage(state.courses); // 💾 Save progress
        }
      }
    },

    addQuestion(
      state,
      action: PayloadAction<{
        courseId: string;
        moduleId: string;
        videoId: string;
        question: Question;
      }>
    ) {
      const { courseId, moduleId, videoId, question } = action.payload;
      const course = state.courses.find((c) => c.id === courseId);
      
      if (course) {
        const module = course.modules.find((m) => m.id === moduleId);
        if (module) {
          // Look up via video ID safely
          const video = module.videos.find((v) => v.id === videoId || v.videoTitle === videoId);
          if (video) {
            video.questions.push(question);
            saveToLocalStorage(state.courses); // 💾 Save progress
          }
        }
      }
    },
  },
});

export const {
  setCourses,
  addCourse,
  updateCourseModules,
  addModule,
  addVideo,
  addQuestion,
  deleteCourse, // Added missing export from original slice reducers list
} = coursesSlice.actions;

export default coursesSlice.reducer;