// src/components/Login.jsx
import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Anda bisa menggunakan gambar atau ilustrasi dari undraw.co, freepik.com, dll.
// Simpan di folder assets Anda.
import loginIllustration from "../assets/undraw_login_weas.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setError("");
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-4">
      <div className="relative flex w-full max-w-4xl overflow-hidden bg-white/10 backdrop-blur-md rounded-2xl shadow-lg ring-1 ring-white/20">
        {/* Kolom Ilustrasi (Hilang di layar kecil) */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-8 bg-gradient-to-br from-blue-500 to-purple-600">
          <img
            src={loginIllustration}
            alt="Notebook Illustration"
            className="w-4/5"
          />
          <h2 className="mt-6 text-2xl font-bold text-white text-center">
            Your Ideas, Organized.
          </h2>
          <p className="mt-2 text-sm text-purple-200 text-center">
            Access your notes anywhere, anytime.
          </p>
        </div>

        {/* Kolom Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {isRegister ? "Sign up to start noting." : "Sign in to continue."}
          </p>

          <form onSubmit={handleAuth}>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 font-medium text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#4285F4"
                d="M24 9.5c3.9 0 6.8 1.6 8.4 3.1l6.3-6.3C34.9 2.5 30.1 0 24 0 14.9 0 7.4 5.4 4.1 13l7.9 6.2C13.6 13.1 18.4 9.5 24 9.5z"
              ></path>
              <path
                fill="#34A853"
                d="M46.2 25.4c0-1.7-.2-3.4-.5-5H24v9.5h12.5c-.5 3.1-2.1 5.7-4.5 7.5l7.3 5.7c4.3-4 6.9-10 6.9-17.7z"
              ></path>
              <path
                fill="#FBBC05"
                d="M12 28.2c-.6-1.8-.9-3.7-.9-5.7s.3-3.9.9-5.7L4.1 11C1.5 16.2 0 21.9 0 28.2s1.5 12 4.1 17.2l7.9-6.2z"
              ></path>
              <path
                fill="#EA4335"
                d="M24 48c6.1 0 11.2-2 14.9-5.4l-7.3-5.7c-2 1.4-4.6 2.2-7.6 2.2-5.6 0-10.4-3.6-12.2-8.5l-7.9 6.2C7.4 42.6 14.9 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign in with Google
          </button>

          <p className="mt-8 text-sm text-center text-gray-600 dark:text-gray-300">
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="font-semibold text-purple-500 hover:underline"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
