import React from 'react';

const LoginBtn = ({ openLogin }) => {
  return (
    <button
      type="button"
      className="text-purple-800 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 hover:bg-gradient-to-br font-medium rounded-lg text-xl sm:text-2xl lg:text-3xl px-6 py-3 sm:px-8 sm:py-4"
      onClick={openLogin} // Call the openPopup function passed from Navbar
    >
      Login
    </button>
  );
};

export default LoginBtn;
