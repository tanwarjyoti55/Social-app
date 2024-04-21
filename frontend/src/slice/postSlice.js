// postSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const postSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {
    postData: (state, action) => {
      // Return a new state object with updated posts
      return {
        ...state,
        value: action.payload,
      };
    },
  },
});

export const { postData } = postSlice.actions;
export default postSlice.reducer;
