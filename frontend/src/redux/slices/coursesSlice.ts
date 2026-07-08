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
  id: string;
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
  category: string;
  description: string;
  thumbnail: string;
  modules: Module[];
};

type CourseState = {
  courses: Course[];
};

const LOCAL_STORAGE_KEY = "lms_saved_courses";

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

const saveToLocalStorage = (courses: Course[]) => {
  try {
    const serializedData = JSON.stringify(courses);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedData);
  } catch (err) {
    console.error("Could not save courses to localStorage:", err);
  }
};

const initialState: CourseState = {
  courses: loadInitialCourses(),
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses(state, action: PayloadAction<any>) {
      const incomingData = action.payload;
      let rawCourses: Course[] = [];

      if (Array.isArray(incomingData)) {
        rawCourses = incomingData;
      } else if (incomingData && typeof incomingData === "object" && Array.isArray((incomingData as any).courses)) {
        rawCourses = (incomingData as any).courses;
      }


      state.courses = rawCourses.map((incomingCourse) => {
        const existingCourse = state.courses.find((c) => String(c.id) === String(incomingCourse.id));
        return {
          ...incomingCourse,

          modules: existingCourse?.modules && existingCourse.modules.length > 0 
            ? existingCourse.modules 
            : (incomingCourse.modules || [])
        };
      });

      saveToLocalStorage(state.courses);
    },
    addCourse(state, action: PayloadAction<Course>) {
      state.courses.push(action.payload);
      saveToLocalStorage(state.courses);
    },
    updateCourse(state, action: PayloadAction<Partial<Course> & { id: string | number }>) {
      const index = state.courses.findIndex((course) => String(course.id) === String(action.payload.id));
      if (index !== -1) {
        state.courses[index] = {
          ...state.courses[index],
          ...action.payload,
        };
        saveToLocalStorage(state.courses);
      }
    },
    updateCourseModules(state, action: PayloadAction<{ courseId: string; modules: Module[] }>) {
      const { courseId, modules } = action.payload;
      const course = state.courses.find((c) => String(c.id) === String(courseId));

      if (course) {
        course.modules = modules;
        saveToLocalStorage(state.courses);
      }
    },
    updateSyllabusForCourse(state, action: PayloadAction<{ courseId: string; modules: any[] }>) {
      const { courseId, modules } = action.payload;
      const targetCourse = state.courses.find((c) => String(c.id) === String(courseId));
      if (targetCourse) {
        targetCourse.modules = modules; 
        saveToLocalStorage(state.courses); // 💡 Sync changes back to local storage
      }
    },
    deleteCourse(state, action: PayloadAction<string>) {
      state.courses = state.courses.filter(c => String(c.id) !== String(action.payload));
      saveToLocalStorage(state.courses);
    },
    addModule(state, action: PayloadAction<{ courseId: string; module: Module }>) {
      const { courseId, module } = action.payload;
      const course = state.courses.find((c) => String(c.id) === String(courseId));

      if (course) {
        course.modules.push(module);
        saveToLocalStorage(state.courses);
      }
    },
    addVideo(state, action: PayloadAction<{ courseId: string; moduleId: string; video: Video }>) {
      const { courseId, moduleId, video } = action.payload;
      const course = state.courses.find((c) => String(c.id) === String(courseId));

      if (course) {
        const module = course.modules.find((m) => String(m.id) === String(moduleId));
        if (module) {
          module.videos.push(video);
          saveToLocalStorage(state.courses);
        }
      }
    },
    addQuestion(state, action: PayloadAction<{ courseId: string; moduleId: string; videoId: string; question: Question }>) {
      const { courseId, moduleId, videoId, question } = action.payload;
      const course = state.courses.find((c) => String(c.id) === String(courseId));

      if (course) {
        const module = course.modules.find((m) => String(m.id) === String(moduleId));
        if (module) {
          const video = module.videos.find((v) => String(v.id) === String(videoId) || v.videoTitle === videoId);
          if (video) {
            video.questions.push(question);
            saveToLocalStorage(state.courses);
          }
        }
      }
    },
  },
});


export const {
  setCourses,
  addCourse,
  updateCourse,
  updateCourseModules,
  updateSyllabusForCourse,
  addModule,
  addVideo,
  addQuestion,
  deleteCourse,
} = coursesSlice.actions;

export default coursesSlice.reducer;
