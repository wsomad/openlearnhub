export interface Question {
    question_id: string;
    question_text: string;
    question_options: string[]; // Array of possible answers
    question_correctAnswerIndex: number; // Index of the correct answer in the options array
    answer_explanation?: string; // Optional explanation for the correct answer
}
