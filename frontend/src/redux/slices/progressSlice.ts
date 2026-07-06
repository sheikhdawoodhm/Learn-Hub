import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProgressState {
  completedLectures: string[];
}

const initialState: ProgressState = {

  completedLectures: JSON.parse(localStorage.getItem("lms_completed_lectures") || "[]"),
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    unlockNextLesson: (state, action: PayloadAction<string>) => {
      const lectureKey = action.payload;
      if (!state.completedLectures.includes(lectureKey)) {
        state.completedLectures.push(lectureKey);
        localStorage.setItem("lms_completed_lectures", JSON.stringify(state.completedLectures));
      }
    },
    resetProgress: (state) => {
      state.completedLectures = [];
      localStorage.removeItem("lms_completed_lectures");
    },
  },
});

export const { unlockNextLesson, resetProgress } = progressSlice.actions;
export default progressSlice.reducer;