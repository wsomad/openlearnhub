import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';
import sectionReducer from './slices/sectionSlice';
import lessonReducer from './slices/lessonSlice';

// Define RootState type based on store's structure
export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        courses: courseReducer,
        sections: sectionReducer,
        lessons: lessonReducer,
    },
});

// Infer RootState from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
