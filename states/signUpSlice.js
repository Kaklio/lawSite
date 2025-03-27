import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const signupSlice = createSlice({
  name: 'signUpBox',
  initialState,
  reducers: {
    toggleSignUpBox: (state) => {
      state.value = !state.value
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleSignUpBox } = signupSlice.actions

export default signupSlice.reducer