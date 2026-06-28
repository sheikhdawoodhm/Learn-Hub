import { createSlice,  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ProgressState {
  // Array of strings formatted as: "courseId-moduleId-videoIndex"
  completedLectures: string[],
  completedQuizzes: string[],
}

const initialState: ProgressState = {
  completedLectures: [],
  completedQuizzes: [],
};


const userProgressSlice = createSlice({
  name: "userProgress",
  initialState,
  reducers: {
    unlockNextLesson: (state, action: PayloadAction<string>) => {
      if (!state.completedLectures.includes(action.payload)) {
        state.completedLectures.push(action.payload);
      }
    },
    unlockQuiz: (state, action: PayloadAction<string>) => {
      if (!state.completedQuizzes.includes(action.payload)) {
        state.completedQuizzes.push(action.payload);
      }
    },
    resetProgress: (state) => {
      state.completedLectures = [];
    }
  },
});

export const { unlockNextLesson,unlockQuiz,resetProgress } = userProgressSlice.actions;
export default userProgressSlice.reducer;