import React from 'react';
import { persistor } from "@/redux/store";


const LoginBtn = ({ openLogin }) => {

  const openLoginPopup = () => {
    persistor.purge();
    openLogin();
  }


  return (
    <button
      type="button"
      className="text-purple-800 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 hover:bg-gradient-to-br font-medium rounded-lg text-xl xl:text-xl 2xl:text-3xl px-4 py-1 xl:px-6 xl:py-2 2xl:px-8 2xl:py-4"
      onClick={openLoginPopup} // Call the openPopup function passed from Navbar
    >
      Login
    </button>
  );
};

export default LoginBtn;
