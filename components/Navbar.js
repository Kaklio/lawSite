"use client"

import React, { useState } from "react";
import Link from "next/link";
import SignUp from "./SignUp";
import Login from "./Login";
import LoginBtn from "./LoginBtn";
import SignupBtn from "./SignupBtn";


const Navbar = () => {
  const [isSignupOpen, setSignupOpen] = useState(false); // State to control Signup visibility
  const [isLoginOpen, setLoginOpen] = useState(false); // State to control Signup visibility

  return (
    <>
      <nav className="flex flex-col md:flex-row purple-bg text-white md:justify-between items-center font-['Inter'] border-b-2 border-b-amber-50">
        <div className="flex md:text-5xl text-4xl m-5 font-bold">
          <span>Sentinel</span>
          <span className="text-purple-400">Assosiates</span>
        </div>
        <ul className="flex gap-8 text-2xl md:text-3xl my-7 mx-7 ">
          <Link href={"/"} className="hover:text-purple-600 transition-all duration-400 ease-in-out">
            <li>Home</li>
          </Link>
          <Link href={"/"} className="hover:text-purple-600 transition-all duration-400 ease-in-out">
            <li>About</li>
          </Link>
          <Link href={"/"} className="hover:text-purple-600 transition-all duration-400 ease-in-out">
            <li>Contact</li>
          </Link>
        </ul>

        <div className="hidden md:flex gap-8 mx-8">
          {/* Pass the setSignupOpen function to LoginBtn */}
           <SignupBtn openSignup={() => setSignupOpen(true)} />
          <LoginBtn openLogin={() => setLoginOpen(true)} />
        </div>
      </nav>

      {/* Render Signup if isSignupOpen is true */}
      {isSignupOpen && <SignUp onClose={() => setSignupOpen(false)} />}
      {isLoginOpen && <Login onClose={() => setLoginOpen(false)} />}
    </>
  );
};

export default Navbar;
