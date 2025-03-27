import React, { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import icons
import validator from 'validator';
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleSignUpBox } from "@/states/signUpSlice";
import { resetUser, updateUserField } from "@/states/userSlice";
import { signIn } from "next-auth/react"; // Import signIn from NextAuth


const SignUp = ({ onClose }) => {

  const [email_Error, setemail_Error] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
  


  const toggleSignUpPopUp = () => {
    dispatch(toggleSignUpBox()) // ✅ Dispatch action to toggle Signup visibility
    dispatch(resetUser())
  }


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
      } else {
        alert("Logged in successfully!");
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
          <button className="absolute top-2 right-3 text-2xl" onClick={toggleSignUpPopUp}>
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

          </div>

        </div>
      </div>
    </>
  );
};

export default SignUp;
