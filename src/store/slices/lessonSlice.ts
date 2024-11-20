import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Lesson} from '../../types/lesson';

// Define the SectionState type.
interface LessonState {
    selectedLesson: Lesson | null;
    allLessons: Lesson[];
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
        setLesson(state, action: PayloadAction<Lesson>) {
            // `action.payload` contains data belongs to a lesson.
            state.selectedLesson = action.payload;
        },
        // Action to set all lessons.
        setLessons(state, action: PayloadAction<Lesson[]>) {
            // `action.payload` contains data belongs to all lessons.
            state.allLessons = action.payload;
        },
        // Action to modify any lesson in the list.
        modifyLesson(
            state,
            action: PayloadAction<{
                id: string;
                updatedLessonObject: Partial<Lesson>;
            }>,
        ) {
            // `action.payload` contains data belongs to a lesson.
            // We are accessing `id` and `updatedLessonObject` from `action.payload`.
            const {id, updatedLessonObject} = action.payload;
            // Since `allLessons` is a list, we are mapping that list to find matches lesson ID.
            const existingLesson = state.allLessons.find(
                (lesson: Lesson) => lesson.lesson_id === id,
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
                (lesson: Lesson) => lesson.lesson_id !== id,
            );
        },
    },
});

// Export the actions and reducer.
export const {setLesson, setLessons, modifyLesson, clearLesson} =
    lessonSlice.actions;
export default lessonSlice.reducer;
