import React from 'react';

interface ResultProps {
    score: number;
    totalQuestions: number;
    onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ score, totalQuestions, onRestart }) => {
    const isVictory = score >= 7;

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
            <h1 className={`text-6xl font-black mb-6 ${isVictory ? 'text-green-500' : 'text-red-500'} drop-shadow-lg`}>
                {isVictory ? 'VICTORY' : 'DEFEAT'}
            </h1>
            <p className="text-2xl text-white mb-8">
                You scored <span className="text-neon-orange font-bold">{score}</span> / {totalQuestions}
            </p>

            <button
                onClick={onRestart}
                className="px-8 py-3 bg-neon-orange text-black font-bold text-xl rounded hover:bg-orange-400 transition-all transform hover:scale-105 shadow-neon"
            >
                Play Again
            </button>
        </div>
    );
};

export default Result;
