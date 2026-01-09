import React from "react";
import { useQuiz } from "../hooks/useQuiz";
import Confetti from "react-confetti";

const ResultScreen = () => {
  const { questions, email } = useQuiz();
  const score = questions.filter(q => q.userAnswer === q.correctAnswer).length;
  
  // Calculate percentage to show different messages
  const percentage = (score / 15) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Show Confetti only if they actually finished (which they did to get here) */}
      <Confetti recycle={false} numberOfPieces={500} gravity={0.15} />

      <div className="max-w-4xl mx-auto">
        {/* Score Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center mb-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h1>
            <p className="text-gray-500 mb-6">Report for: <span className="font-semibold text-blue-600">{email}</span></p>
            
            <div className="relative inline-block">
                <div className="text-6xl font-black text-blue-600 mb-2">{score} <span className="text-2xl text-gray-400 font-medium">/ 15</span></div>
            </div>
            
            <p className={`text-lg font-medium mt-2 ${percentage >= 60 ? 'text-green-600' : 'text-orange-500'}`}>
                {percentage >= 60 ? "Great Job! You passed." : "Good effort! Keep practicing."}
            </p>
        </div>

        {/* Detailed Report */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-700 ml-2">Detailed Analysis</h2>
            {questions.map((q, i) => {
                const isCorrect = q.userAnswer === q.correctAnswer;
                return (
                    <div key={i} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 transition hover:shadow-md ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question {i+1}</span>
                                <p className="text-lg font-medium text-gray-800 mt-1 mb-4">{q.question}</p>
                            </div>
                            {isCorrect ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">CORRECT</span>
                            ) : (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">WRONG</span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                            <div className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <p className="text-xs font-bold uppercase mb-1 opacity-70">Your Answer</p>
                                <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                    {q.userAnswer || "Skipped"}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-xs font-bold uppercase mb-1 text-blue-500">Correct Answer</p>
                                <p className="font-semibold text-blue-800">{q.correctAnswer}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;