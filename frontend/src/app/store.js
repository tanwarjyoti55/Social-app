import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice.js";
import userReducer from "../slice/userSlice.js";
import postReducer from "../slice/postSlice.js";
export const store = configureStore({
  reducer: {
    authSlice: authReducer,
    userSlice: userReducer,
    postSlice : postReducer,
  },
});


console.log(store.getState());