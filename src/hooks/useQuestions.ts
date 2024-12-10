import { useDispatch, useSelector } from 'react-redux';

import { createNewQuestion } from '../components/enrollment/testingLesson/questionUtils';
import {
	clearQuestions,
	modifyQuestion,
	modifyQuestionAdd,
	modifyQuestionRemove,
	setQuestions,
} from '../store/slices/questionSlice';
import { RootState } from '../store/store';
import { Question } from '../types/question';

export const useQuestions = () => {
    const dispatch = useDispatch();

    // Select questions state from Redux store
    const quizQuestions = useSelector(
        (state: RootState) => state.questions.quizQuestions,
    );

    /**
     * Adds a new question to the quiz
     */
    const createQuestion = () => {
        const newQuestion = createNewQuestion(quizQuestions.length);
        dispatch(modifyQuestionAdd(newQuestion));
    };

    /**
     * Updates a specific question field
     * @param index - Question index
     * @param field - Field to update
     * @param value - New value
     */
    const updateQuestion = (
        index: number,
        field: keyof Question,
        value: string | number | string[],
    ) => {
        const updatedQuestion = {...quizQuestions[index]};

        if (field === 'question_options') {
            updatedQuestion.question_options = value as string[];
        } else {
            (updatedQuestion as any)[field] = value;
        }

        dispatch(modifyQuestion({index, question: updatedQuestion}));
    };

    /**
     * Deletes a question and reorders remaining questions
     * @param indexToDelete - Index of question to delete
     */
    const deleteQuestion = (indexToDelete: number) => {
        dispatch(modifyQuestionRemove(indexToDelete));

        // Reorder remaining questions
        const updatedQuestions = quizQuestions
            .filter((_, index) => index !== indexToDelete)
            .map((q, index) => ({
                ...q,
                question_order: index + 1,
            }));

        dispatch(setQuestions(updatedQuestions));
    };

    const initializeQuizQuestions = (questions: Question[]) => {
        dispatch(setQuestions(questions));
    };

    const clearQuestionsState = () => {
        dispatch(clearQuestions());
    };

    return {
        quizQuestions,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        initializeQuizQuestions,
        clearQuestionsState,
    };
};
