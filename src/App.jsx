// src/App.jsx
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import "./styles/scrollbar.css";
import "./styles/buttonTextResponsive.css";

import Notebook from "./components/Notebook";
import Login from "./components/Login";

import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      // Perbarui ClassName
      className="absolute top-5 right-5 p-2 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-lg shadow-lg z-10 text-white"
    >
      {darkMode ? (
        <SunIcon className="w-6 h-6" />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}
    </button>
  );
};

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 to-purple-700 dark:from-gray-900 dark:to-black transition-colors duration-300">
      <ThemeToggle />
      {user && (
        <button
          onClick={handleLogout}
          // Perbarui ClassName
          className="absolute top-5 left-5 px-4 py-2 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-lg shadow-lg text-sm font-semibold text-white z-10"
        >
          Logout
        </button>
      )}
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-purple-700 dark:from-slate-900 dark:to-black transition-colors duration-300">
        {user ? <Notebook /> : <Login />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
