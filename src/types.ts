export interface Choice {
    text: string;
    is_correct: boolean;
}

export interface Question {
    text: string;
    choices: Choice[];
    explanation: string;
}

export interface QuizData {
    subject: string;
    difficulty: string;
    questions: Question[];
}
