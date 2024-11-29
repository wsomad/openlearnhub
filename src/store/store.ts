import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';
import sectionReducer from './slices/sectionSlice';
import lessonReducer from './slices/lessonSlice';
import questionReducer from './slices/questionSlice';

// Define RootState type based on store's structure
export const store = configureStore({
    reducer: {
        user: userReducer,
        courses: courseReducer,
        sections: sectionReducer,
        lessons: lessonReducer,
        questions: questionReducer,
    },
});

// Infer RootState from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
