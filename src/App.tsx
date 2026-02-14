import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { QuizData } from "./types";
import HUD from "./components/HUD";
import Quiz from "./components/Quiz";
import Result from "./components/Result";

type GameState = 'MENU' | 'LOADING' | 'PLAYING' | 'RESULT';

function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("Good");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const difficulties = ["Easy", "Good", "Hardcore"];

  const handleStart = async () => {
    if (!subject.trim()) {
      setErrorMsg("Please enter a subject!");
      return;
    }
    setErrorMsg("");
    setGameState('LOADING');

    try {
      // Generate Quiz
      const jsonStr = await invoke<string>("generate_quiz", { subject, difficulty });
      const data: QuizData = JSON.parse(jsonStr);
      setQuizData(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setGameState('PLAYING');

      // Save Quiz asynchronously (fire and forget)
      invoke("save_quiz", { subject, quizJson: jsonStr }).catch(console.error);

    } catch (error) {
      console.error(error);
      setErrorMsg(`Failed to generate quiz: ${error}`);
      setGameState('MENU');
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(s => s + 1);
    }

    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setGameState('RESULT');
    }
  };

  const handleRestart = () => {
    setGameState('MENU');
    setSubject("");
    setScore(0);
    setQuizData(null);
  };

  return (
    <main className="min-h-screen bg-dark-bg text-white font-sans flex flex-col p-4 select-none">

      {gameState === 'MENU' && (
        <div className="flex flex-col items-center justify-center flex-grow space-y-8 animate-fade-in">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-orange to-red-500 tracking-tighter drop-shadow-neon">
            QUIZZ_ME
          </h1>

          <div className="w-full max-w-md space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 font-bold tracking-wide">SUBJECT</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-dark-secondary border border-gray-700 rounded p-4 text-xl text-white focus:outline-none focus:border-neon-orange transition-colors placeholder-gray-600"
                placeholder="e.g. Space, Rust, Cyberpunk..."
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-bold tracking-wide">DIFFICULTY</label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-3 rounded font-bold transition-all border ${difficulty === diff
                        ? 'bg-neon-orange text-black border-neon-orange shadow-[0_0_15px_rgba(255,158,11,0.5)]'
                        : 'bg-dark-secondary text-gray-400 border-gray-700 hover:border-gray-500'
                      }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-500 font-bold text-center animate-pulse">{errorMsg}</p>
            )}

            <button
              onClick={handleStart}
              className="w-full py-4 bg-gradient-to-r from-neon-orange to-orange-600 rounded text-black font-black text-2xl hover:opacity-90 transform hover:scale-[1.02] transition-all shadow-lg mt-4"
            >
              START GAME
            </button>
          </div>
        </div>
      )}

      {gameState === 'LOADING' && (
        <div className="flex flex-col items-center justify-center flex-grow animate-pulse">
          <div className="text-4xl font-bold text-neon-orange mb-4">GENERATING...</div>
          <div className="w-16 h-16 border-4 border-neon-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400 text-sm">Consulting the AI Oracle</p>
        </div>
      )}

      {gameState === 'PLAYING' && quizData && (
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
          <HUD
            score={score}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={quizData.questions.length}
          />
          <div className="flex-grow flex items-center justify-center">
            <Quiz
              question={quizData.questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
            />
          </div>
        </div>
      )}

      {gameState === 'RESULT' && quizData && (
        <Result
          score={score}
          totalQuestions={quizData.questions.length}
          onRestart={handleRestart}
        />
      )}

    </main>
  );
}

export default App;
