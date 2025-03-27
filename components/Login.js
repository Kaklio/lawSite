import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import icons
import { useDispatch, useSelector } from "react-redux";
import { updateUserField, resetUser } from "@/states/userSlice";
import { signIn } from "next-auth/react";


const Login = ({ onClose }) => {
  const dispatch = useDispatch();
  
  // Redux email state (if stored previously)
  const emailFromRedux = useSelector((state) => state.user.email);
  const [showPassword, setShowPassword] = useState(false);


  // Local state for user input
  const [email, setEmail] = useState(emailFromRedux || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent full page reload
    });
  
    if (result?.error) {
      setError(result.error);
    } else {
      alert("Logged in successfully!");
      onClose(); // Close modal
    }
  };
  
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/75 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
        <button className="absolute top-2 right-3 text-2xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4">Log in</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

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

          <button type="submit" className="w-full bg-purple-700 p-3 rounded-lg">
            Log in
          </button>
        </form>

        <p className="text-center text-blue-400 my-4"> OR </p>

        {/* Social login buttons (if needed) */}
        <div className="mt-4 flex flex-col gap-2">
          {/* Social buttons here */}
        </div>
      </div>
    </div>
  );
};

export default Login;
