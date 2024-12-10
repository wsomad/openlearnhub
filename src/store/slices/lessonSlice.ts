import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LessonBase } from '../../types/lesson';

// This applicable to Document, Video, and Quiz.

// Define state structure for lessons in Redux store
interface LessonState {
    selectedLesson: LessonBase | null; // Currently selected/active lesson
    lessonsBySection: Record<string, LessonBase[]>; // Map of section IDs to their lessons
}

// Initial state values when store is created
const initialState: LessonState = {
    selectedLesson: null,
    lessonsBySection: {},
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
        modifyLessonRemove(
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
        clearLesson(state) {
            state.selectedLesson = null;
        },

        /**
         * Resets the entire lesson state to initial values
         * @param state Current lesson state
         */
        clearLessonsState: (state) => {
            state.selectedLesson = null;
            state.lessonsBySection = {};
        },
    },
});

// Export individual action creators
export const {
    setLesson,
    setLessons,
    modifyLesson,
    clearLesson,
    modifyLessonRemove,
    clearLessonsState,
} = lessonSlice.actions;

// Export the reducer
export default lessonSlice.reducer;
