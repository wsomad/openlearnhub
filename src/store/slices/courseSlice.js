import {createSlice} from '@reduxjs/toolkit';

const courseSlice = createSlice({
    name: 'courses',
    initialState: {
        courses: [],
        selectedCourse: null,
    },
    reducers: {
        setCourses(state, action) {
            state.courses = action.payload;
        },
        setSelectedCourse(state, action) {
            state.selectedCourse = action.payload;
        },
        newCourse(state, action) {
            state.courses.push(action.payload);
        },
        modifiedCourse(state, action) {
            const {id, updatesCourseObject} = action.payload;
            const existingCourseObject = state.courses.find(
                (course) => course.id === id,
            );
            if (existingCourseObject) {
                Object.assign(existingCourseObject, updatesCourseObject);
            }
        },
    },
});

export const {setCourses, setSelectedCourse, newCourse, modifiedCourse} =
    courseSlice.actions;
export default courseSlice.reducer;
