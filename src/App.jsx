import { QuizProvider } from "./context/QuizProvider";
import { useQuiz } from "./hooks/useQuiz";
import StartScreen from "./components/StartScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";

const AppContent = () => {
  const { gameState } = useQuiz();

  switch (gameState) {
    case "start":
      return <StartScreen />;
    case "quiz":
      return <QuizScreen />;
    case "result":
      return <ResultScreen />;
    default:
      return <StartScreen />;
  }
};

const App = () => {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
};

export default App;