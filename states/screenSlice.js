import { createSlice } from "@reduxjs/toolkit";

const screenSlice = createSlice({
  name: "screen",
  initialState: {
    isLandscape: false,
  },
  reducers: {
    setIsLandscape: (state, action) => {
      state.isLandscape = action.payload;
    },
  },
});

export const { setIsLandscape } = screenSlice.actions;
export default screenSlice.reducer;
