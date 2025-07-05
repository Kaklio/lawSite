import React, { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import icons
import validator from 'validator';
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleSignUpBox, closeSignUpBox } from "@/states/signUpSlice";
import { resetUser, updateUserField } from "@/states/userSlice";
import { signIn } from "next-auth/react"; // Import signIn from NextAuth


const SignUp = ({ onClose }) => {

  const [email_Error, setemail_Error] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const verifyBtn = useRef(null);

  const dispatch = useDispatch();


  const email = useSelector((state) => state.user.email); // Get email from Redux
  const username = useSelector((state) => state.user.name); // Get username from Redux
  const password = useSelector((state) => state.user.password); // Get password from Redux
  const emailVerified = useSelector((state) => state.user.isVerified)



  const handleEmailChange = (e) => {
    dispatch(updateUserField({ field: "email", value: e.target.value })); // ✅ Update Redux state on input change
  };
  const handleUsernamelChange = (e) => {
    dispatch(updateUserField({ field: "name", value: e.target.value })); // ✅ Update Redux state on input change
  };
  const handlePasswordChange = (e) => {
    dispatch(updateUserField({ field: "password", value: e.target.value })); // ✅ Update Redux state on input change
  };
  
const handleGoogleSignIn = async () => {
  setIsGoogleLoading(true);
  try {
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: "/" // Back to home page
    });
    
    if (result?.error) {
      console.log("Closing popup")
          onClose(); // ⚠️ MUST BE CALLED
      alert("Google sign-in failed: " + result.error);
    } else {
        console.log("Google sign-in successful:", result);
      console.log("Closing popup")
        onClose();
        router.push("/");
      // router.refresh(); // Ensure client state updates
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
    alert("An error occurred during Google sign-in");
  }
  finally {
    setIsGoogleLoading(false);
  }
};


  const toggleSignUpPopUp = () => {
    dispatch(toggleSignUpBox()) // ✅ Dispatch action to toggle Signup visibility
    dispatch(resetUser())
  }

    const closeSignUpPopUp = () => {
    dispatch(closeSignUpBox());
    dispatch(resetUser())
  };

const accountSubmit = async (e) => {
  e.preventDefault();
  let incorrectFields = false;

  if (emailRef.current.value === "" || email_Error) {
    emailRef.current.style = "border: 1px solid red";
    incorrectFields = true;
  }
  if (usernameRef.current.value.length <= 2) {
    usernameRef.current.style = "border: 1px solid red";
    usernameRef.current.placeholder = "Username - min 3 characters";
    setTimeout(() => {
      usernameRef.current.placeholder = "Username";
    }, 800);
    incorrectFields = true;
  }
  if (passwordRef.current.value.length <= 7) {
    passwordRef.current.style = "border: 1px solid red";
    passwordRef.current.placeholder = "Password - min 8 characters";
    setTimeout(() => {
      passwordRef.current.placeholder = "Password";
    }, 800);
    incorrectFields = true;
  }
  if (incorrectFields) return;

  if (!emailVerified) {
    verifyBtn.current.style.backgroundColor = "red";
    setTimeout(() => {
      verifyBtn.current.style.backgroundColor = "";
    }, 400);
    return;
  }

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailRef.current.value,
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account created successfully!");

      // Automatically log in the user
      const result = await signIn("credentials", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
        redirect: false, // Prevent full page reload
      });

      if (result?.error) {
        alert("Login failed: " + result.error);
        console.log("Closing popup")
        onClose(); // Close modal after login
      } else {
      console.log("Closing popup")
        onClose(); // Close modal after login
      }
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Signup error:", error);
  }
};

  const router = useRouter(); // Move useRouter here

  const validateEmail = (e) => {
    const value = e.target.value;
    handleEmailChange(e)

    // // Regex for a valid email
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (validator.isEmail(value)) {
      setemail_Error(false);
    } else {
      setemail_Error(true);
    }
  }

  const verifyEmail = async () => {


    if (!email_Error) {
      const code = Math.floor(1000 + Math.random() * 9000).toString(); // Store code in a variable


      // for expressbackend http://localhost:3000/
      const response = await fetch('/api/sendCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json();

      if (response.ok) {
        console.log('Code Sending Sucessfull');
        router.push("/verification");

      }
      else {
        alert('ERROR: Code not sent')
      }

    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/75 z-50">
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
          <button className="absolute top-2 right-3 text-2xl" onClick={closeSignUpPopUp}>
            &times;
          </button>
          <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
          <form>
            <div>
              <input
                type="email"
                placeholder="Email"
                className={`w-full p-3 ${email === "" ? "mb-10" : "mb-1"} bg-gray-800 rounded-lg text-white`}
                value={email}
                onChange={validateEmail}
                ref={emailRef}
                required
                disabled={emailVerified} // ✅ Disables input if email is verified
              />
            </div>

            <div>

{!emailVerified && (
  <button
    type="button"
    className={`
      text-sm text-white px-2 transition-all duration-200
      ${email_Error ? "bg-gray-700 hover:bg-gray-600 active:bg-gray-500" : "bg-green-500 hover:bg-green-600 active:bg-green-700"}
      ${email === "" ? "hidden" : "mb-[13px]"}
      rounded-md shadow-md hover:shadow-lg active:scale-95
    `}
    onClick={verifyEmail}
    ref={verifyBtn}
  >
    Verify Email
  </button>
)}
              {emailVerified && <button
                type="button"  // 🔥 Ensures it's not a form submit button
                className={`text-sm text-white px-2 mb-[13px]`}
              >
                Email Verified✅
              </button>}
            </div>
            
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernamelChange}
              ref={usernameRef}
              className="w-full p-3 mb-3 bg-gray-800 rounded-lg text-white"
              required
              // disabled={!emailVerified} // ✅ Disables input if email is not verified
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                ref={passwordRef}
                className="w-full p-3 mb-3 bg-gray-800 rounded-lg text-white pr-12"
                required
              // disabled={!emailVerified} // ✅ Disables input if email is not verified
              />
              <button
                type="button"
                className="absolute top-3.5 right-3 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 p-3 rounded-lg"
              onClick={accountSubmit}
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-blue-400 my-4"> OR </p>
          {/* Social login buttons */}
          <div className="mt-4 flex flex-col gap-2">

            {/* </div> */}

            {/* <div className="flex flex-col gap-2 min-h-screen bg-gray-100 p-10"> */}

            {/* {BUTTONS WILL GO HERE} */}

<button
onClick={handleGoogleSignIn}
disabled={isGoogleLoading}
    className={`flex ${isGoogleLoading ? 'opacity-70' : ''} text-white border  border-gray-300 rounded-lg shadow-md px-[21%] py-2 md:text-lg text-xs font-medium w-full p-3 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}>
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
      {isGoogleLoading ? (
    <span>Signing in...</span>
  ) : (
      <span>Continue with Google</span>
  )}
</button>

          </div>

        </div>
      </div>
    </>
  );
};

export default SignUp;
