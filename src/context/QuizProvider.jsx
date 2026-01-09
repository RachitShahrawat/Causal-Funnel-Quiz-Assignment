import React, { useState } from "react";
import { QuizContext } from "./QuizContext";

export const QuizProvider = ({ children }) => {
  const [gameState, setGameState] = useState("start");
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Simple error state
  const [timer, setTimer] = useState(1800);

  // Helper to fix weird characters like &quot;
  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("https://opentdb.com/api.php?amount=15&type=multiple");
      
      // 1. Check for 429 (Too Many Requests) or 500 errors
      if (!res.ok) {
        throw new Error("Failed to fetch questions. Please try again.");
      }

      const data = await res.json();
      
      // 2. Check if API returned empty results
      if (!data.results || data.results.length === 0) {
        throw new Error("No questions found.");
      }
      
      const formatted = data.results.map((q) => {
        const correct = decodeHTML(q.correct_answer);
        return {
          question: decodeHTML(q.question),
          correctAnswer: correct,
          options: [...q.incorrect_answers.map(decodeHTML), correct].sort(() => Math.random() - 0.5),
          userAnswer: null,
          visited: false,
        };
      });
      
      setQuestions(formatted);
      setGameState("quiz");

    } catch (err) {
      console.error(err);
      setError(err.message); // Show this to user instead of crashing
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (userEmail) => {
    setEmail(userEmail);
    fetchQuestions();
  };

  const submitQuiz = () => {
    setGameState("result");
  };

  return (
    <QuizContext.Provider
      value={{ 
        gameState, 
        setGameState, 
        email, 
        questions, 
        setQuestions, 
        loading, 
        error,
        startQuiz, 
        submitQuiz, 
        timer, 
        setTimer 
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};