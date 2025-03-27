"use client"

import React, { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import LoginBtn from "./LoginBtn";
import SignupBtn from "./SignupBtn";
import { useSelector,useDispatch } from "react-redux";
import { toggleSignUpBox } from "@/states/signUpSlice";
import { useSession } from "next-auth/react";

const Hero = () => {

const { data: session } = useSession(); // Get session data

  // const [isSignupOpen, toggleSignUpPopUp] = useState(false); // State to control Signup visibility
  const [isLoginOpen, setLoginOpen] = useState(false); // State to control Signup visibility

  const isSignupOpen = useSelector((state) => state.signUpBox.value)
  const dispatch = useDispatch() // ✅ Dispatch function

  const toggleSignUpPopUp = () => {
    dispatch(toggleSignUpBox()) // ✅ Dispatch action to toggle Signup visibility
  }

  
  return (

    <section
      className="relative h-screen flex flex-col justify-center sm:items-start itmes-center bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage: "url('/assets/images/background.jpg')" }}
    >
      {/* <div className="text-5xl text-white z-10">{count}{count2}</div> */}
      {/* <button className="bg-amber-50 text-3xl hover:bg-amber-300 z-10" onClick={ ()=>dispatch(increment())}>+</button> */}
      {/* <button className="bg-amber-50 text-3xl hover:bg-amber-300 z-10" onClick={ ()=>dispatch(decrement())}>-</button> */}


      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Hero Content */}
      <div className="text-white z-10 text-center sm:text-left  ">
        <span className="bg-purple-400 rounded-2xl text-lg xl:text-lg 2xl:text-xl px-3 py-1 inline-block">
          @LawBySentinel
        </span>
        <h1 className="text-5xl xl:text-5xl 2xl:text-7xl font-bold mt-4">
          Your Personal <br /> Law Assistant
        </h1>
        <p className="text-lg xl:text-xl 2xl:text-2xl mt-4 ">
          Get all the insights of law and legal minds at one place without much hassle.
        </p>
        <button
          type="button"
          className="mt-6 sm:mt-8 font-bold text-lg xl:text-xl 2xl:text-3xl text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br px-2 py-1 rounded-xl xl:rounded-2xl 2xl:rounded-3xl xl:px-4 xl:py-2 2xl:px-6 2xl:py-3"
        >
          Get Started
        </button>
      </div>

      {/* Buttons */}
      {!session && <div className="z-10 md:hidden flex flex-col sm:flex-row sm:gap-74 gap-6 sm:mt-74 sm:mr-28 p-10">
          {/* Pass the setSignupOpen function to LoginBtn */}
          <SignupBtn />
          <LoginBtn openLogin={() => setLoginOpen(true)} />
      </div>}


      {/* Render Signup if isSignupOpen is true */}
      {isSignupOpen && <SignUp onClose={() => toggleSignUpPopUp} />}
      {isLoginOpen && <Login onClose={() => setLoginOpen(false)} />}


    </section>
  );
};

export default Hero;
