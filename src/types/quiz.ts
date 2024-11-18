export interface Quiz {
    quiz_id: string;
    quiz_title: string;
    questions: QuizQuestion[];
}

export interface QuizQuestion {
    question_id: string;
    question_text: string;
    question_type: 'multiple-choice' | 'true-false' | 'open-ended';
    options?: string[];
    correct_answer: string;
}
