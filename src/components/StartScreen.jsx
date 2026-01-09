import React, { useState } from "react";
import { useQuiz } from "../hooks/useQuiz";

const StartScreen = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [error, setError] = useState(""); // State to store error messages
  const { startQuiz, loading } = useQuiz();

  // Regex for checking email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // 1. Check if empty
    if (!inputEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }

    // 2. Check if valid format
    if (!validateEmail(inputEmail)) {
      setError("Please enter a valid email address (e.g., user@example.com).");
      return;
    }

    // If valid, start the quiz
    startQuiz(inputEmail);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">React Quiz Assignment</h1>
        <p className="mb-4 text-gray-600">Enter your email to start the 30-minute assessment.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={inputEmail}
              onChange={(e) => {
                setInputEmail(e.target.value);
                if (error) setError(""); // Clear error as user types
              }}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 transition-colors ${
                error 
                  ? "border-red-500 focus:ring-red-200 bg-red-50" 
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {/* Error Message Display */}
            {error && (
              <p className="mt-2 text-sm text-red-600 font-medium animate-pulse">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded font-semibold transition ${
              loading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting...
              </span>
            ) : (
              "Start Quiz"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartScreen;