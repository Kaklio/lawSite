"use client";

import React, { useState } from "react";
import Link from "next/link";
import SignUp from "./SignUp";
import Login from "./Login";
import LoginBtn from "./LoginBtn";
import SignupBtn from "./SignupBtn";
import { useSelector, useDispatch } from "react-redux";
import { toggleSignUpBox } from "@/states/signUpSlice";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession(); // Get session data
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  const isSignupOpen = useSelector((state) => state.signUpBox.value);
  const dispatch = useDispatch();

  const toggleSignUpPopUp = () => {
    dispatch(toggleSignUpBox());
  };

  return (
    <>
      <nav className={`flex flex-col md:flex-row purple-bg text-white md:justify-between items-center font-['Inter'] border-b-2 border-b-amber-50`}>
        <div className="flex text-3xl xl:text-4xl 2xl:text-5xl m-5 font-bold">
          <span>Sentinel</span>
          <span className="text-purple-400">Associates</span>
        </div>
        <ul className="flex gap-8 text-2xl xl:text-2xl 2xl:text-3xl  xl:my-7 mx-7">
          <Link href="/" className="hover:text-purple-600 transition-all duration-400 ease-in-out">
            <li>Home</li>
          </Link>
          <Link href="/" className="hover:text-purple-600 transition-all duration-400 ease-in-out">
            <li>About</li>
          </Link>
          <Link href="/" className="hover:text-purple-600 transition-all duration-400 ease-in-out">
            <li>Contact</li>
          </Link>
        </ul>

        <div className={`${session?"":"hidden"}  md:flex gap-8 my-4 xl:my-0 mx-8`}>
          {/* Show Login/Signup if NOT logged in */}
          {!session ? (
            <>
              <SignupBtn onClick={toggleSignUpPopUp} />
              <LoginBtn openLogin={() => setLoginOpen(true)} />
            </>
          ) : (
            /* Show Dropdown if logged in */
            <>
              <button
                onClick={() => setShowDropDown(!showDropDown)}
                className="max-w-94 mx-10 text-white overflow-hidden bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm xl:text-xl px-5 py-2.5 text-center inline-flex items-center"
                type="button"
              >
                Welcome<br />{session.user.username}
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className={`z-10 ${showDropDown ? "" : "hidden"} absolute right-32 top-48 xl:top-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut()}
                      className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Render Signup if isSignupOpen is true */}
      {isSignupOpen && <SignUp onClose={() => toggleSignUpPopUp()} />}
      {isLoginOpen && <Login onClose={() => setLoginOpen(false)} />}
    </>
  );
};

export default Navbar;
