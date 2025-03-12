import React from "react";

const SentinelVerification = () => {
  return (
    <div className="min-h-screen green-bg text-white flex flex-col items-center">
      <div className="w-full bg-purple-700 py-4 flex justify-center">
        <h1 className="text-3xl font-bold">Sentinel Verification</h1>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-xl">Verification Code Sent to:</h2>
        <p className="text-lg bg-purple-800 px-4 py-2 rounded-md mt-2">example@email.com</p>
      </div>
      <div className="mt-6 flex flex-col items-center">
        <label htmlFor="field" className="text-lg">Enter Verification Code</label>
        <input
          type="text"
          id="field"
          className="mt-2 p-2 text-black text-lg rounded-md w-64 border border-purple-500"
          placeholder="Check Your Email"
        />
      </div>
    </div>
  );
};

export default SentinelVerification;
