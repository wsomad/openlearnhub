import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Course} from '../../types/course';

interface CourseState {
    selectedCourse: Course | null;
    searchCourseResult: Course[] | [];
    allCourses: Course[] | [];
    popularCourses: Course[] | [];
}

const initialState: CourseState = {
    selectedCourse: null,
    searchCourseResult: [],
    allCourses: [],
    popularCourses: [],
};

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setCourse(state, action: PayloadAction<Course>) {
            state.selectedCourse = action.payload;
        },

        setCourses(state, action: PayloadAction<Course[]>) {
            state.allCourses = action.payload;
        },

        setPopularCourses(state, action: PayloadAction<Course[]>) {
            state.popularCourses = action.payload;
        },

        setSearchCourseResult(state, action: PayloadAction<Course[]>) {
            state.searchCourseResult = action.payload;
        },

        modifyCourse(state, action: PayloadAction<{id: string; updatedCourseObject: Partial<Course>;}>) {
            const {id, updatedCourseObject} = action.payload;
            const existingCourse = state.allCourses.find(
                (course: Course) => course.course_id === id,
            );
            if (existingCourse) {
                Object.assign(existingCourse, updatedCourseObject);
            }
        },

        clearCourse(state, action: PayloadAction<string>) {
            const id = action.payload;
            state.allCourses = state.allCourses.filter(
                (course: Course) => course.course_id !== id,
            );
        },

        clearSingleCourse(state) {
            state.selectedCourse = null;
        },

        clearCourses(state) {
            state.allCourses = [];
        },

        clearPopularCourses(state) {
            state.popularCourses = [];
        },

        clearSearchCourseResults(state) {
            state.searchCourseResult = [];
        },
    },
});

// Export the actions and reducer.
export const {
    setCourse,
    setCourses,
    setPopularCourses,
    setSearchCourseResult,
    modifyCourse,
    clearCourse,
    clearCourses,
    clearSingleCourse,
    clearPopularCourses,
    clearSearchCourseResults,
} = courseSlice.actions;
export default courseSlice.reducer;
