import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Course} from '../../types/course';

// Define the CourseState type.
interface CourseState {
    selectedCourse: Course | null;
    allCourses: Course[];
}

// Define the initial state of CourseState.
const initialState: CourseState = {
    selectedCourse: null,
    allCourses: [],
};

// Create a slice named `courses`.
const courseSlice = createSlice({
    name: 'courses',
    initialState,
    // Reducers define how the state changes in response to specific actions.
    reducers: {
        // Action to set a course.
        setCourse(state, action: PayloadAction<Course>) {
            // `action.payload` contains data belongs to a course.
            state.selectedCourse = action.payload;
        },

        // Action to set all courses.
        setCourses(state, action: PayloadAction<Course[]>) {
            // `action.payload` contains list of data belongs to all courses.
            state.allCourses = action.payload;
        },

        // Action to modify any course in the list.
        modifyCourse(
            state,
            action: PayloadAction<{
                id: string;
                updatedCourseObject: Partial<Course>;
            }>,
        ) {
            // `action.payload` contains data belongs to a course.
            // We are accessing the `id` and `updatedCourseObject` from `action.payload`.
            const {id, updatedCourseObject} = action.payload;
            // Since `allCourses` is a list, we are mapping that list to find matches course ID.
            const existingCourse = state.allCourses.find(
                (course: Course) => course.course_id === id,
            );
            // If that specific course exists, then merge the update data to that course.
            if (existingCourse) {
                Object.assign(existingCourse, updatedCourseObject);
            }
        },

        // Action to clear any course from the list.
        clearCourse(state, action: PayloadAction<string>) {
            // `action.payload` contains data belongs to a course.
            // We are accessing `id` from `action.payload`.
            const id = action.payload;
            // Since `allCourses` is a list, we are mapping that list to check if course ID is false.
            // If false, we remove that course from list.
            // How this works? Let's say `id` from action.payload is 2, and course_id = 2,
            // Then, surely `course_id` === `id` is true right?
            // But, we mentioned that `course_id` !== `id`, (2 !== 2) which means it's false.
            // This must be true but since we use !==, then it becomes false, so we remove it.
            state.allCourses = state.allCourses.filter(
                (course: Course) => course.course_id !== id,
            );
        },
    },
});

// Export the actions and reducer.
export const {setCourse, setCourses, modifyCourse, clearCourse} =
    courseSlice.actions;
export default courseSlice.reducer;
