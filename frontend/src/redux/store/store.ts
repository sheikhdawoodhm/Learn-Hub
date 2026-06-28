import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";

import coursesReducer from "../slices/coursesSlice";
import favoritesReducer from "../slices/favoritesSlice";
import progressReducer from "../slices/progressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    favorites: favoritesReducer,
    userProgress: progressReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;