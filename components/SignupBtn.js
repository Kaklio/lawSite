import React from 'react'

const SignupBtn = ({ openSignup })  => {
  return (
    
    <button
    type="button"
    className="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 hover:bg-gradient-to-br font-medium rounded-lg text-xl sm:text-2xl lg:text-3xl px-6 py-3 sm:px-8 sm:py-4"
    onClick={openSignup} // Call the openPopup function passed from Navbar
  >
    Signup
  </button>
  )
}

export default SignupBtn
