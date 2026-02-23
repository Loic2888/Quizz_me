import React from 'react';
import { Question } from '../types';

interface QuizProps {
    question: Question;
    onAnswer: (isCorrect: boolean, index: number) => void;
    isAnswered: boolean;
    selectedAnswerIndex: number | null;
}

const Quiz: React.FC<QuizProps> = ({ question, onAnswer, isAnswered, selectedAnswerIndex }) => {
    return (
        <div className="flex flex-col items-center w-full max-w-2xl animate-fade-in-up">
            <div className="bg-dark-secondary p-6 rounded-lg shadow-lg mb-8 w-full border-l-4 border-neon-orange">
                <h2 className="text-2xl font-bold text-white mb-2">{question.text}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
                {question.choices.map((choice, idx) => {
                    let buttonClass = "p-4 font-semibold rounded border transition-all transform flex items-center justify-center min-h-[80px] text-white ";

                    if (isAnswered) {
                        if (choice.is_correct) {
                            buttonClass += "bg-green-600 border-green-400 shadow-[0_0_15px_rgba(22,163,74,0.5)]";
                        } else if (idx === selectedAnswerIndex) {
                            buttonClass += "bg-red-600 border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] opacity-100";
                        } else {
                            buttonClass += "bg-gray-800 border-gray-700 opacity-50";
                        }
                    } else {
                        buttonClass += "bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-neon-orange hover:-translate-y-1 active:scale-95 shadow-md";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={() => onAnswer(choice.is_correct, idx)}
                            className={buttonClass}
                        >
                            {choice.text}
                        </button>
                    );
                })}
            </div>

            {isAnswered && (
                <div className="w-full bg-blue-900/30 border border-blue-500/50 p-6 rounded-lg animate-fade-in">
                    <h3 className="text-blue-400 font-bold mb-2 tracking-widest text-sm">EXPLANATION</h3>
                    <p className="text-gray-200 leading-relaxed italic">
                        {question.explanation}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Quiz;
