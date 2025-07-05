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
    console.log("SignUp box toggled"); 
    },
      closeSignUpBox: (state) => {
    state.value = false
    console.log("SignUp box closed"); 
  },
  },
})

// Action creators are generated for each case reducer function
export const { toggleSignUpBox, closeSignUpBox } = signupSlice.actions

export default signupSlice.reducer