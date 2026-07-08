import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProgressState {
  completedLectures: string[];
}

const initialState: ProgressState = {
  completedLectures: [],
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setCompletedLectures: (state, action: PayloadAction<string[]>) => {
      state.completedLectures = action.payload;
    },
    unlockNextLesson: (state, action: PayloadAction<string>) => {
      const lectureKey = action.payload;
      if (!state.completedLectures.includes(lectureKey)) {
        state.completedLectures.push(lectureKey);
      }
    },
    resetProgress: (state) => {
      state.completedLectures = [];
    },
  },
});

export const { unlockNextLesson, resetProgress, setCompletedLectures } = progressSlice.actions;
export default progressSlice.reducer;