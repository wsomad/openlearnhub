import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';

export const store = configureStore({
    reducer: {
        // `auth` key corresponds to the key in Redux state where `authReducer` --
        // -- handles the `auth` slice properties like `user` and `isAuthenticated`.
        // `authReducer` is responsible for handling actions like `setUser` and `cleanUser`.
        // This means it responsibles in updating authentication state accordingly.
        auth: authReducer,
        users: userReducer,
        courses: courseReducer,
    },
});
