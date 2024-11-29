import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Question} from '../../types/Question';

interface QuestionState {
    selectedQuestion: Question | null;
    allQuestions: Question[] | [];
}

const initialState: QuestionState = {
    selectedQuestion: null,
    allQuestions: [],
};

const QuestionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        setQuestion(state, action: PayloadAction<Question>) {
            state.selectedQuestion = action.payload;
        },
        setQuestions(state, action: PayloadAction<Question[]>) {
            state.allQuestions = action.payload;
        },
        modifyQuestion(
            state,
            action: PayloadAction<{
                id: string;
                updatedQuestionObject: Partial<Question>;
            }>,
        ) {
            const {id, updatedQuestionObject} = action.payload;

            const existingQuestion = state.allQuestions.find(
                (question: Question) => question.question_id === id,
            );

            if (existingQuestion) {
                Object.assign(existingQuestion, updatedQuestionObject);
            }
        },
        clearSingleQuestion(state) {
            state.selectedQuestion = null;
        },
    },
});

export const {setQuestion, setQuestions, modifyQuestion, clearSingleQuestion} =
    QuestionSlice.actions;
export default QuestionSlice.reducer;
