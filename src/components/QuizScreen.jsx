import React, { useState, useEffect } from "react";
import { useQuiz } from "../hooks/useQuiz";
import { Clock, Menu, X } from "lucide-react";
import { motion,AnimatePresence} from "framer-motion"; 

const QuizScreen = () => {
  const { questions, setQuestions, submitQuiz, timer, setTimer } = useQuiz();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false); // For Mobile Toggle

  useEffect(() => {
    if (timer <= 0) {
      submitQuiz();
      return;
    }
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setQuestions(prev => {
        const copy = [...prev];
        if(copy[currentQIndex]) {
            copy[currentQIndex] = { ...copy[currentQIndex], visited: true };
        }
        return copy;
      });
    }
  }, [currentQIndex]);

  const handleAnswer = (opt) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[currentQIndex] = { ...copy[currentQIndex], userAnswer: opt };
      return copy;
    });
  };

  const getStatusClass = (idx) => {
    if (idx === currentQIndex) return "border-2 border-blue-600 bg-blue-50";
    if (questions[idx]?.userAnswer) return "bg-green-100 text-green-700";
    if (questions[idx]?.visited) return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100";
  };

  if (!questions[currentQIndex]) return <div className="p-10 text-center animate-pulse">Loading Question...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Quiz Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg">Question {currentQIndex + 1} <span className="text-gray-400 font-normal">/ 15</span></h2>
            
            <div className="flex items-center gap-4">
              {/* Mobile Sidebar Toggle */}
              <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 bg-gray-100 rounded-full text-gray-600"
              >
                {showSidebar ? <X size={20}/> : <Menu size={20}/>}
              </button>

              <div className={`flex items-center gap-2 font-mono font-bold px-3 py-1 rounded-full ${timer < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                 <Clock size={18} />
                 {Math.floor(timer/60)}:{String(timer%60).padStart(2,'0')}
              </div>
            </div>
          </div>

          {/* Animated Question Card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQIndex}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 min-h-[300px]"
            >
              <p className="text-xl md:text-2xl font-medium text-gray-800 mb-8 leading-relaxed">
                {questions[currentQIndex].question}
              </p>

              <div className="space-y-3">
                {questions[currentQIndex].options.map((opt, i) => (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className={`w-full p-4 text-left border rounded-xl transition-colors duration-200 ${
                      questions[currentQIndex].userAnswer === opt 
                        ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                        : "hover:bg-blue-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <button 
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(i => i-1)}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button 
              onClick={() => currentQIndex === 14 ? submitQuiz() : setCurrentQIndex(i => i+1)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition transform active:scale-95"
            >
              {currentQIndex === 14 ? "Submit Quiz" : "Next Question"}
            </button>
          </div>
        </div>

        {/* Sidebar (Responsive) */}
        <div className={`
            fixed inset-0 z-50 bg-gray-800/50 lg:static lg:bg-transparent lg:z-auto
            ${showSidebar ? "flex" : "hidden lg:block"} 
            justify-end lg:justify-start
        `}>
            <div className="bg-white w-3/4 lg:w-full h-full lg:h-fit p-6 lg:p-4 shadow-2xl lg:shadow rounded-l-2xl lg:rounded-xl overflow-y-auto">
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h3 className="font-bold text-xl">Overview</h3>
                    <button onClick={() => setShowSidebar(false)}><X /></button>
                </div>
                
                <h3 className="font-bold text-gray-700 mb-4 hidden lg:block">Question Overview</h3>
                <div className="grid grid-cols-4 lg:grid-cols-4 gap-2">
                    {questions.map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => {
                                setCurrentQIndex(i);
                                setShowSidebar(false);
                            }}
                            className={`h-10 rounded-lg border font-medium text-sm transition-all ${getStatusClass(i)}`}
                        >
                            {i+1}
                        </button>
                    ))}
                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div> Attempted</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div> Visited</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-50 border border-blue-600 rounded"></div> Current</div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default QuizScreen;