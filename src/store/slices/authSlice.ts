import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    // Name of the slice
    name: 'auth',

    // An object with two properties
    initialState: {
        user: null, // Holds user data once the user logs in.
        isAuthenticated: false, // Indicates whether user is authenticated or not.
    },

    // Reducers containing functions/action creators that define on how state changes in response to actions.
    reducers: {
        // This function will be called when the `setUser()` action is dispatched.
        setUser(state, action) {
            // It sets the `state.user` to hold values coming from `action.payload`.
            state.user = action.payload;
            // It sets the `state.isAuthenticated` to indicate user is signed in.
            state.isAuthenticated = true;
        },

        // This function will be called when the `clearUser()` action is dispatched.
        clearUser(state) {
            // It resets the `state.user` to null.
            state.user = null;
            // It changes the `state.isAuthenticated` to indicate user is signed out.
            state.isAuthenticated = false;
        },
    },
});

export const {setUser, clearUser} = authSlice.actions;

// This line of code creates `authReducer`.
export default authSlice.reducer;
