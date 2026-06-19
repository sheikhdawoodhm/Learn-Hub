import { createSlice} from "@reduxjs/toolkit";

type ProgressDetail = {
  progress: number;
  currentTime: number;
};

type ProgressState = {
  progress: Record<string, ProgressDetail>;
  userId: string | null;
};

const loadProgress = (userId: string): Record<string, ProgressDetail> => {
  return JSON.parse(
    localStorage.getItem(`progress_${userId}`) || "{}"
  ) as Record<string, ProgressDetail>;
};

const initialState: ProgressState = {
  progress: {},
  userId: null,
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    hydrateProgress: (state, action) => {
      const userId = action.payload;

      state.userId = userId;
      state.progress = loadProgress(userId);
    },

    updateProgress: (state, action) => {
      const { videoId, progress, currentTime } = action.payload;

      if (state.progress[videoId]?.progress === 100) return;
      if (!state.userId) return;

      state.progress[videoId] = {
        progress,
        currentTime,
      };

      localStorage.setItem(
        `progress_${state.userId}`,
        JSON.stringify(state.progress)
      );
    },

    resetProgress: (state) => {
      state.progress = {};
      state.userId = null;
    },
  },
});

export const {
  updateProgress,
  hydrateProgress,
  resetProgress,
} = progressSlice.actions;

export default progressSlice.reducer;