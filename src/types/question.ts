export interface Question {
    question_id: string;
    question_order: number;
    question_text: string;
    question_options: string[]; // Array of possible answers
    question_correct_answer_index: number; // Index of the correct answer in the options array
    question_answer_explanation?: string; // Optional explanation for the correct answer
}
