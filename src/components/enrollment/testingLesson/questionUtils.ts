import { Question } from '../../../types/question';

export const createNewQuestion = (currentLength: number): Question => ({
    question_id: `q_${Date.now()}`,
    question_order: currentLength + 1,
    question_text: '',
    question_options: ['', '', '', ''],
    question_correct_answer_index: 0,
    question_answer_explanation: '',
});
