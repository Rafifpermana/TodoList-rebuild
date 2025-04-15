import { ThemeProvider, useTheme } from "./context/ThemeContext";
import "./styles/scrollbar.css";
import "./styles/buttonTextResponsive.css";
import Notebook from "./components/Notebook";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg"
    >
      {darkMode ? (
        <SunIcon className="w-6 h-6 text-yellow-400" />
      ) : (
        <MoonIcon className="w-6 h-6 text-gray-700" />
      )}
    </button>
  );
};

const AppContent = () => {
  const { darkMode } = useTheme();
  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark" : ""
      } scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent`}
    >
      <ThemeToggle />
      <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <Notebook />
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
