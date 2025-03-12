"use client"

import React, { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import LoginBtn from "./LoginBtn";
import SignupBtn from "./SignupBtn";


const Hero = () => {

  const [isSignupOpen, setSignupOpen] = useState(false); // State to control Signup visibility
  const [isLoginOpen, setLoginOpen] = useState(false); // State to control Signup visibility


  return (

    <section
      className="relative h-screen flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between px-4 sm:px-8 pt-[150px] sm:pt-[200px] lg:pt-[250px] bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage: "url('/assets/images/background.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Hero Content */}
      <div className="text-white z-10 text-center sm:text-left max-w-3xl">
        <span className="bg-purple-400 rounded-2xl text-lg sm:text-xl px-3 py-1 inline-block">
          @LawBySentinel
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mt-4">
          Your Personal <br /> Law Assistant
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mt-4">
          Get all the insights of law and legal minds at one place without much hassle.
        </p>
        <button
          type="button"
          className="mt-6 sm:mt-8 font-bold text-lg sm:text-2xl lg:text-3xl text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br  rounded-3xl px-6 py-3"
        >
          Get Started
        </button>
      </div>

      {/* Buttons */}
      <div className="z-10 md:hidden flex flex-col sm:flex-row sm:gap-74 gap-6 sm:mt-74 sm:mr-28 p-10">
          {/* Pass the setSignupOpen function to LoginBtn */}
          <SignupBtn openSignup={() => setSignupOpen(true)} />
          <LoginBtn openLogin={() => setLoginOpen(true)} />
      </div>


      {/* Render Signup if isSignupOpen is true */}
      {isSignupOpen && <SignUp onClose={() => setSignupOpen(false)} />}
      {isLoginOpen && <Login onClose={() => setLoginOpen(false)} />}


    </section>
  );
};

export default Hero;
