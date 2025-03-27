
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: "",
  email: "",
  password: "",
  token: "",
  isVerified: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateUserField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetUser: () => initialState,
  },
});

export const { setUser, updateUserField, resetUser } = userSlice.actions;
export default userSlice.reducer;
