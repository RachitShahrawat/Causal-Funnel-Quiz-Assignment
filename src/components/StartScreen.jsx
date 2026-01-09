import React, { useState } from "react";
import { useQuiz } from "../hooks/useQuiz";

const StartScreen = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const { startQuiz, loading, error: apiError } = useQuiz(); 

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(""); 

    if (!inputEmail.trim()) {
      setValidationError("Please enter your email address.");
      return;
    }

    if (!validateEmail(inputEmail)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

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
                if (validationError) setValidationError("");
              }}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 transition-colors ${
                validationError || apiError
                  ? "border-red-500 focus:ring-red-200 bg-red-50" 
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            
            {/* Display Local Validation Errors (Empty email, bad format) */}
            {validationError && (
              <p className="mt-2 text-sm text-red-600 font-medium animate-pulse">
                {validationError}
              </p>
            )}

            {/* Display API Errors (Server down, no internet) */}
            {apiError && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded border border-red-200">
                <strong>Server Error:</strong> {apiError}
              </div>
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
            {loading ? "Starting..." : "Start Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartScreen;