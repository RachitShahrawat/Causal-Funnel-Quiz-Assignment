import React, { useState} from "react";
import { QuizContext } from "./QuizContextObj";

export const QuizProvider = ({ children }) => {
  const [gameState, setGameState] = useState("start");
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(1800);

  // --- ROBUST BACKUP DATA ---
  const BACKUP_QUESTIONS = [
    {
      question: "Which computer hardware device provides an interface for all other connected devices to communicate?",
      correct_answer: "Motherboard",
      incorrect_answers: ["Central Processing Unit", "Hard Disk Drive", "Random Access Memory"]
    },
    {
      question: "What does CPU stand for?",
      correct_answer: "Central Processing Unit",
      incorrect_answers: ["Central Process Unit", "Computer Personal Unit", "Central Processor Unit"]
    },
    {
      question: "In web design, what does CSS stand for?",
      correct_answer: "Cascading Style Sheets",
      incorrect_answers: ["Counter Strike Source", "Corrective Style Sheet", "Computer Style Sheet"]
    },
    {
      question: "Which language is used for styling web pages?",
      correct_answer: "CSS",
      incorrect_answers: ["HTML", "JQuery", "XML"]
    },
    {
      question: "Which is not a JavaScript Framework?",
      correct_answer: "Python Script",
      incorrect_answers: ["JQuery", "Django", "NodeJS"]
    }
  ];

  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const loadBackupData = () => {
    console.log("Loading Backup Data...");
    // Create 15 questions from the backup list
    const backup = Array(15).fill(null).map((_, i) => {
      const raw = BACKUP_QUESTIONS[i % BACKUP_QUESTIONS.length];
      return {
        question: raw.question + (i >= 5 ? ` (Variation ${i+1})` : ""),
        correctAnswer: raw.correct_answer,
        options: [...raw.incorrect_answers, raw.correct_answer].sort(() => Math.random() - 0.5),
        userAnswer: null,
        visited: false,
      };
    });
    setQuestions(backup);
    setGameState("quiz");
    setLoading(false);
  };

  const fetchQuestions = async () => {
    setLoading(true);

    // 1. TIMEOUT LOGIC: If API takes > 4 seconds, kill it and load backup
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 4000)
    );

    try {
      // 2. Race the API against the Timeout
      const res = await Promise.race([
        fetch("https://opentdb.com/api.php?amount=15&type=multiple"),
        timeoutPromise
      ]);

      if (!res.ok) throw new Error("API Server Error");
      
      const data = await res.json();
      if (!data.results || data.results.length === 0) throw new Error("Empty Data");

      const formatted = data.results.map((q) => {
        const incorrect = q.incorrect_answers.map(ans => decodeHTML(ans));
        const correct = decodeHTML(q.correct_answer);
        return {
          question: decodeHTML(q.question),
          correctAnswer: correct,
          options: [...incorrect, correct].sort(() => Math.random() - 0.5),
          userAnswer: null,
          visited: false,
        };
      });
      
      setQuestions(formatted);
      setGameState("quiz");
      setLoading(false);

    } catch (error) {
      console.warn("API Failed or Timed Out. Switching to Backup Mode.", error);
      loadBackupData(); // <--- INSTANT FALLBACK
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
      value={{ gameState, setGameState, email, questions, setQuestions, loading, startQuiz, submitQuiz, timer, setTimer }}
    >
      {children}
    </QuizContext.Provider>
  );
};