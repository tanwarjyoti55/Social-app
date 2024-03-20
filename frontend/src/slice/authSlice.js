import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "login",
};
export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    switchToSignUp: (state) => {
      state.value = "signUp";
    },
    switchToLogin: (state) => {
      state.value = "login";
    },
  },
});

export const { switchToSignUp, switchToLogin } = authSlice.actions;
export default authSlice.reducer;
