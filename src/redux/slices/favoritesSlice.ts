import { createSlice } from "@reduxjs/toolkit";

const loadFavorites = (userId: string) => {
  return JSON.parse(
    localStorage.getItem(`favorites_${userId}`) || "[]"
  );
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: [],
    userId: null,
  },
  reducers: {
    hydrateFavorites: (state, action) => {
      const userId = action.payload;

      state.userId = userId;
      state.favorites = loadFavorites(userId);
    },

    addFavorite: (state, action) => {
      const exists = state.favorites.find(
        (c: any) => c.id === action.payload.id
      );

      if (!exists && state.userId) {
        state.favorites.push(action.payload);

        localStorage.setItem(
          `favorites_${state.userId}`,
          JSON.stringify(state.favorites)
        );
      }
    },

    removeFavorite: (state, action) => {
      if (!state.userId) return;

      state.favorites = state.favorites.filter(
        (c: any) => c.id !== action.payload
      );

      localStorage.setItem(
        `favorites_${state.userId}`,
        JSON.stringify(state.favorites)
      );
    },

    resetFavorites: (state) => {
      state.favorites = [];
      state.userId = null;
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  resetFavorites,
  hydrateFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;