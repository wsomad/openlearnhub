import { Question } from './Question';

export interface Quiz {
    quiz_id: string;
    quiz_title: string;
    questions: Question[]; // Array of questions for this quiz
    quiz_passingScore: number; // Minimum percentage score to pass (e.g., 70)
    quiz_timeLimit?: number; // Optional time limit in minutes for the quiz
}
