import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Import the Course type if it's defined elsewhere
import {Course} from '../../types/course'; // Adjust the path to your Course type

// Define the initial state type
interface CourseState {
    selectedCourse: Course | null;
    allCourses: Course[];
}

// Define the initial state
const initialState: CourseState = {
    selectedCourse: null,
    allCourses: [],
};

// Create the slice
const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        // Set the selected course
        setCourse(state, action: PayloadAction<Course>) {
            state.selectedCourse = action.payload;
        },

        // Set all courses
        setCourses(state, action: PayloadAction<Course[]>) {
            state.allCourses = action.payload;
        },

        // Modify a course in the list
        modifyCourse(
            state,
            action: PayloadAction<{
                id: string;
                updatedCourseObject: Partial<Course>;
            }>,
        ) {
            const {id, updatedCourseObject} = action.payload;
            const existingCourse = state.allCourses.find(
                (course: Course) => course.course_id === id,
            );
            if (existingCourse) {
                Object.assign(existingCourse, updatedCourseObject);
            }
        },

        // Clear a course from the list
        clearCourse(state, action: PayloadAction<string>) {
            const courseId = action.payload;
            state.allCourses = state.allCourses.filter(
                (course: Course) => course.course_id !== courseId,
            );
        },
    },
});

// Export the actions
export const {setCourse, setCourses, modifyCourse, clearCourse} =
    courseSlice.actions;

// Export the reducer
export default courseSlice.reducer;
