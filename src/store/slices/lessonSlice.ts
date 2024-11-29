import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LessonBase} from '../../types/lesson';

// This applicable to Document, Video, and Quiz.

// Define the SectionState type.
interface LessonState {
    selectedLesson: LessonBase | null;
    allLessons: LessonBase[];
}

// Define the initial state of SectionState.
const initialState: LessonState = {
    selectedLesson: null,
    allLessons: [],
};

// Create a slice named `lessons`.
const lessonSlice = createSlice({
    name: 'lessons',
    initialState,
    // Reducers define how the state changes in response to specific actions.
    reducers: {
        // Action to set a lesson.
        setLesson(state, action: PayloadAction<LessonBase>) {
            // `action.payload` contains data belongs to a lesson.
            state.selectedLesson = action.payload;
        },
        // Action to set all lessons.
        setLessons(state, action: PayloadAction<LessonBase[]>) {
            // `action.payload` contains data belongs to all lessons.
            state.allLessons = action.payload;
        },
        // Action to modify any lesson in the list.
        modifyLesson(
            state,
            action: PayloadAction<{
                id: string;
                updatedLessonObject: Partial<LessonBase>;
            }>,
        ) {
            // `action.payload` contains data belongs to a lesson.
            // We are accessing `id` and `updatedLessonObject` from `action.payload`.
            const {id, updatedLessonObject} = action.payload;
            // Since `allLessons` is a list, we are mapping that list to find matches lesson ID.
            const existingLesson = state.allLessons.find(
                (lesson: LessonBase) => lesson.lesson_id === id,
            );
            // If that specific lesson exists, then merge the update data to that lesson.
            if (existingLesson) {
                Object.assign(existingLesson, updatedLessonObject);
            }
        },
        // Action to clear any lesson from the list.
        clearLesson(state, action: PayloadAction<String>) {
            const id = action.payload;
            state.allLessons = state.allLessons.filter(
                (lesson: LessonBase) => lesson.lesson_id !== id,
            );
        },

        clearSingleLesson(state) {
            state.selectedLesson = null;
        },
    },
});

// Export the actions and reducer.
export const {
    setLesson,
    setLessons,
    modifyLesson,
    clearLesson,
    clearSingleLesson,
} = lessonSlice.actions;
export default lessonSlice.reducer;
