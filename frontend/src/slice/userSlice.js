import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: JSON.parse(localStorage.getItem("user-threads")),
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    logout: (state) => {
      state.value = null;
    },
    userData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { logout, userData } = userSlice.actions;
export default userSlice.reducer;
