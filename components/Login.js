import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserField, resetUser } from "@/states/userSlice";
import { signIn } from "next-auth/react";

const Login = ({ onClose }) => {
  const dispatch = useDispatch();
  const emailFromRedux = useSelector((state) => state.user.email);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(emailFromRedux || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signIn("google", { 
        redirect: false,
        callbackUrl: "/"
      });
      
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/75 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
        <button className="absolute top-2 right-3 text-2xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4">Log in</h2>

        {error && <p className="text-red-500 text-sm mb-3">Something went wrong. Try Again</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-3 bg-gray-800 rounded-lg text-white"
            required
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-3 bg-gray-800 rounded-lg text-white pr-12"
              required
            />
            <button
              type="button"
              className="absolute top-3.5 right-3 flex items-center text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
          </div>

          <button type="submit" className="w-full bg-purple-700 p-3 rounded-lg">
            Log in
          </button>
        </form>

        <p className="text-center text-blue-400 my-4"> OR </p>

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className={`flex items-center justify-center text-white border border-gray-300 rounded-lg shadow-md px-[21%] py-2 md:text-lg text-xs font-medium w-full p-3 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
              isGoogleLoading ? 'opacity-70' : ''
            }`}
          >
    <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="-0.5 0 48 48" version="1.1">

        <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Color-" transform="translate(-401.000000, -860.000000)">
                <g id="Google" transform="translate(401.000000, 860.000000)">
                    <path
                        d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                        id="Fill-1" fill="#FBBC05"> </path>
                    <path
                        d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                        id="Fill-2" fill="#EB4335"> </path>
                    <path
                        d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                        id="Fill-3" fill="#34A853"> </path>
                    <path
                        d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                        id="Fill-4" fill="#4285F4"> </path>
                </g>
            </g>
        </g>
    </svg>
            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;