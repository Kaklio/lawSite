"use client"

import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { resetUser, updateUserField } from "@/states/userSlice";


const SentinelVerification = () => {
  const [code, setcode] = useState('')
  const [fieldFilled, setfieldFilled] = useState(false)
  
  // const email = useSelector((state) => state.email.value)
  // const emailVerified = useSelector((state) => state.emailVerified.value)
  
  const email = useSelector((state) => state.user.email); // Get email from Redux


  const router = useRouter(); // Move useRouter here
  const dispatch = useDispatch()


  const sendCode = async () => {
  
    const response =  await fetch('/api/sendCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {email, code} ),
    })

    const data = await response.json();

    if(response.ok)
    {
      console.log('Code Confirmed');
      dispatch(updateUserField({field: "isVerified", value: true}));  // ✅ Update Redux state on input change   
      router.push("/"); //Go back to main page on code verification      
    }
    else{
      alert('ERROR: Incorrect Code')
    }
  
  }

  return (
    <>
    <div className="min-h-screen green-bg text-white flex flex-col items-center">
      <div className="w-full bg-purple-900 py-4 flex justify-center">
        <h1 className="text-8xl font-bold">Sentinel Verification</h1>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-4xl">Verification Code Sent to:</h2>
        <p className="text-3xl bg-purple-800 px-4 py-2 rounded-md mt-2">{email}</p>
      </div>
      <div className="mt-6 flex flex-col items-center">
        <label htmlFor="field" className="text-2xl">Enter Verification Code</label>
        <input
  id="field"
  type="text"
  inputMode="numeric"
  value={code}
  onChange={(e) => {
    const newValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (newValue.length <= 4) {
      setcode(newValue); // Only update state if length is 4 or less
    }
    if(newValue.length == 4){
      setfieldFilled(true)
    }
    else if(newValue.length < 4){
      setfieldFilled(false)
    }
  }}
  onKeyDown={(e) => {
    if (
      !/^\d$/.test(e.key) && // Blocks non-numbers
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
      
    ) {
      e.preventDefault();
    }

  }}
  className="mt-2 p-2 text-gray-900 bg-amber-50 text-5xl rounded-md w-[20vw] border border-purple-500"
  placeholder="4-Digit Code"
/>

        <button type="submit" className={`my-10 p-6 text-4xl rounded-lg ${fieldFilled?"bg-green-600":"bg-gray-600"}`}
        onClick={sendCode}
        >Verify</button>
      </div>

    </div>
    </>
  );
};

export default SentinelVerification;
