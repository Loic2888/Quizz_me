import React from 'react';
import { Question } from '../types';

interface QuizProps {
    question: Question;
    onAnswer: (isCorrect: boolean) => void;
}

const Quiz: React.FC<QuizProps> = ({ question, onAnswer }) => {
    return (
        <div className="flex flex-col items-center w-full max-w-2xl animate-fade-in-up">
            <div className="bg-dark-secondary p-6 rounded-lg shadow-lg mb-8 w-full border-l-4 border-neon-orange">
                <h2 className="text-2xl font-bold text-white mb-4">{question.text}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {question.choices.map((choice, idx) => (
                    <button
                        key={idx}
                        onClick={() => onAnswer(choice.is_correct)}
                        className="p-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded border border-gray-600 hover:border-neon-orange transition-all transform hover:-translate-y-1 active:scale-95 shadow-md flex items-center justify-center min-h-[80px]"
                    >
                        {choice.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Quiz;
