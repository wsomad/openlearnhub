import {createSlice} from '@reduxjs/toolkit';

const courseSlice = createSlice({
    name: 'courses',
    initialState: {
        selectedCourse: null,
        allCourses: [],
    },
    reducers: {
        setCourse(state, action) {
            state.selectedCourse = action.payload;
        },
        setCourses(state, action) {
            state.courses = action.payload;
        },
        modifyCourse(state, action) {
            const {id, updatedCourseObject} = action.payload;
            const existingCourse = state.courses.find(
                (course) => course.id === id,
            );
            if (existingCourse) {
                Object.assign(existingCourse, updatedCourseObject);
            }
        },
        clearCourse(state, action) {
            const course_id = action.payload;
            state.courses = state.courses.filter(
                (course) => course.id !== course_id,
            );
        },
    },
});

export const {setCourse, setCourses, modifyCourse, clearCourse} =
    courseSlice.actions;
export default courseSlice.reducer;
