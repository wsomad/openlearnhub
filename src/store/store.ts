import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';

// Define RootState type based on your store's structure
export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        courses: courseReducer,
    },
});

// Infer RootState from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
