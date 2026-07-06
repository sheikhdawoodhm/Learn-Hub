import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user") || "null");

const initialState = {
  user: storedUser,
  isLoggedIn: !!storedUser,
  isCheckingAuth: true, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isCheckingAuth = false; // Check complete
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isCheckingAuth = false; 
      localStorage.removeItem("user");
    },
    finishAuthCheck: (state) => {
      state.isCheckingAuth = false; 
    }
  },
});

export const { login, logout, finishAuthCheck } = authSlice.actions;
export default authSlice.reducer;