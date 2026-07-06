import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: JSON.parse(localStorage.getItem("global_favorites") || "[]"),
    userId: null,
  },
  reducers: {
    hydrateFavorites: (state, action) => {
      const userId = action.payload;
      state.userId = userId;

      const userSpecific = localStorage.getItem(`favorites_${userId}`);
      if (userSpecific) {
        state.favorites = JSON.parse(userSpecific);
      }
    },

    addFavorite: (state, action) => {

      const exists = state.favorites.some(
        (c: any) => String(c.id) === String(action.payload.id)
      );

      if (!exists) {
        state.favorites.push(action.payload);


        localStorage.setItem("global_favorites", JSON.stringify(state.favorites));
        if (state.userId) {
          localStorage.setItem(`favorites_${state.userId}`, JSON.stringify(state.favorites));
        }
      }
    },

    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (c: any) => String(c.id) !== String(action.payload)
      );

      localStorage.setItem("global_favorites", JSON.stringify(state.favorites));
      if (state.userId) {
        localStorage.setItem(`favorites_${state.userId}`, JSON.stringify(state.favorites));
      }
    },

    setFavorites: (state, action) => {
      state.favorites = action.payload;

      localStorage.setItem("global_favorites", JSON.stringify(action.payload));
      if (state.userId) {
        localStorage.setItem(`favorites_${state.userId}`, JSON.stringify(action.payload));
      }
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
  setFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;