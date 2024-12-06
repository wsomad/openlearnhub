import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LessonBase } from '../../types/lesson';
import { Question } from '../../types/question';

// This applicable to Document, Video, and Quiz.

// Define state structure for lessons in Redux store
interface LessonState {
    selectedLesson: LessonBase | null; // Currently selected/active lesson
    lessonsBySection: Record<string, LessonBase[]>; // Map of section IDs to their lessons
    questions: Question[]; // Questions for quiz type lessons
}

// Initial state values when store is created
const initialState: LessonState = {
    selectedLesson: null,
    lessonsBySection: {},
    questions: [],
};

// Create the lesson slice with reducers
const lessonSlice = createSlice({
    name: 'lessons',
    initialState,
    // Reducers define how the state changes in response to specific actions.
    reducers: {
        // Lesson Management Reducers

        /**
         * Sets the currently selected lesson
         * @param state Current lesson state
         * @param action Payload containing lesson data
         */
        setLesson(state, action: PayloadAction<LessonBase>) {
            // action.payload contains data belongs to a lesson.
            state.selectedLesson = action.payload;
        },

        /**
         * Updates all lessons for a specific section
         * @param state Current lesson state
         * @param action Payload containing section ID and array of lessons
         */
        setLessons(
            state,
            action: PayloadAction<{sectionId: string; lessons: LessonBase[]}>,
        ) {
            // Store lessons mapped to their section ID for easy access
            state.lessonsBySection[action.payload.sectionId] =
                action.payload.lessons;
        },

        /**
         * Updates a specific lesson within a section
         * @param state Current lesson state
         * @param action Payload containing section ID, lesson ID, and updated data
         */
        modifyLesson(
            state,
            action: PayloadAction<{
                section_id: string;
                id: string;
                updatedLessonObject: Partial<LessonBase>;
            }>,
        ) {
            const {section_id, id, updatedLessonObject} = action.payload;
            const sectionLessons = state.lessonsBySection[section_id];

            // Find and update the specific lesson if it exists
            if (sectionLessons) {
                const existingLesson = sectionLessons.find(
                    (lesson) => lesson.lesson_id === id,
                );
                if (existingLesson) {
                    Object.assign(existingLesson, updatedLessonObject);
                }
            }
        },

        // Lesson Cleanup Reducers

        /**
         * Removes a specific lesson from a section
         * @param state Current lesson state
         * @param action Payload containing section ID and lesson ID to remove
         */
        clearLesson(
            state,
            action: PayloadAction<{section_id: string; lesson_id: string}>,
        ) {
            const {section_id, lesson_id} = action.payload;

            // Filter out the specified lesson
            if (state.lessonsBySection[section_id]) {
                state.lessonsBySection[section_id] = state.lessonsBySection[
                    section_id
                ].filter((lesson) => lesson.lesson_id !== lesson_id);
            }
        },

        /**
         * Clears the currently selected lesson
         * @param state Current lesson state
         */
        clearSingleLesson(state) {
            state.selectedLesson = null;
        },

        // Quiz Question Management Reducers

        /**
         * Sets the entire array of questions for a quiz
         * @param state Current lesson state
         * @param action Payload containing array of questions
         */
        setQuestions(state, action: PayloadAction<Question[]>) {
            state.questions = action.payload;
        },

        /**
         * Adds a new question to the quiz
         * @param state Current lesson state
         * @param action Payload containing new question data
         */
        addQuestion(state, action: PayloadAction<Question>) {
            state.questions.push(action.payload);
        },

        /**
         * Updates a specific question in the quiz
         * @param state Current lesson state
         * @param action Payload containing question index and updated data
         */
        updateQuestion(
            state,
            action: PayloadAction<{
                index: number;
                question: Question;
            }>,
        ) {
            const {index, question} = action.payload;
            state.questions[index] = question;
        },

        /**
         * Removes a question from the quiz
         * @param state Current lesson state
         * @param action Payload containing index of question to remove
         */
        deleteQuestion(state, action: PayloadAction<number>) {
            state.questions.splice(action.payload, 1);
        },

        /**
         * Clears all questions from the quiz
         * @param state Current lesson state
         */
        clearQuestions(state) {
            state.questions = [];
        },

        /**
         * Resets the entire lesson state to initial values
         * @param state Current lesson state
         */
        resetLessonState: (state) => {
            state.selectedLesson = null;
            state.lessonsBySection = {};
            state.questions = [];
        },
    },
});

// Export individual action creators
export const {
    setLesson,
    setLessons,
    modifyLesson,
    clearLesson,
    clearSingleLesson,
    setQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    clearQuestions,
    resetLessonState,
} = lessonSlice.actions;

// Export the reducer
export default lessonSlice.reducer;
