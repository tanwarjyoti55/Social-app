import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice.js";
import userReducer from "../slice/userSlice.js";
export const store = configureStore({
  reducer: {
    authSlice: authReducer,
    userSlice: userReducer,
  },
});
