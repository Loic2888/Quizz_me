import React from 'react';

interface HUDProps {
    score: number;
    currentQuestion: number;
    totalQuestions: number;
}

const HUD: React.FC<HUDProps> = ({ score, currentQuestion, totalQuestions }) => {
    return (
        <div className="flex justify-between items-center p-4 bg-dark-secondary rounded-lg border border-neon-orange shadow-lg mb-4">
            <div className="text-xl font-bold text-white">
                Question: <span className="text-neon-orange">{currentQuestion}</span> / {totalQuestions}
            </div>
            <div className="text-2xl font-bold text-neon-orange drop-shadow-md">
                Score: {score}
            </div>
        </div>
    );
};

export default HUD;
