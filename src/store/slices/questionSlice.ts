import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Question } from '../../types/question';

interface QuestionState {
    selectedQuestion: Question | null;
    quizQuestions: Question[];
}

const initialState: QuestionState = {
    selectedQuestion: null,
    quizQuestions: [],
};

const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        // Existing reducers
        setQuestion(state, action: PayloadAction<Question>) {
            state.selectedQuestion = action.payload;
        },

        // Quiz question management reducers (transferred from lessonSlice)
        setQuestions(state, action: PayloadAction<Question[]>) {
            state.quizQuestions = action.payload;
        },

        modifyQuestionAdd(state, action: PayloadAction<Question>) {
            state.quizQuestions.push(action.payload);
        },

        modifyQuestion(
            state,
            action: PayloadAction<{
                index: number;
                question: Question;
            }>,
        ) {
            const {index, question} = action.payload;
            state.quizQuestions[index] = question;
        },

        modifyQuestionRemove(state, action: PayloadAction<number>) {
            state.quizQuestions.splice(action.payload, 1);
        },

        clearQuestions(state) {
            state.quizQuestions = [];
        },
    },
});

export const {
    setQuestion,
    setQuestions,
    modifyQuestionAdd,
    modifyQuestion,
    modifyQuestionRemove,
    clearQuestions,
} = questionSlice.actions;

export default questionSlice.reducer;
