import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toggleSignUpBox } from "@/states/signUpSlice";
import { resetUser } from "@/states/userSlice";



const SignupBtn = ()  => {
  const dispatch = useDispatch();
  
  
  const openLSignupPopup =  () => {
    
    dispatch(resetUser()); // ✅ Update Redux state on input change   
    dispatch(toggleSignUpBox()) // ✅ Dispatch action to toggle Signup visibility

    console.log('Signup button clicked');


  };
  return (
    
    <button
    type="button"
    className="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 hover:bg-gradient-to-br font-medium rounded-lg text-xl xl:text-2xl 2xl:text-3xl px-4 py-1 xl:px-6 xl:py-2 2xl:px-8 2xl:py-4"
    onClick={openLSignupPopup} // Call the openPopup function passed from Navbar
  >
    Signup
  </button>
  )
}

export default SignupBtn
