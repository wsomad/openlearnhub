import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../types/user';

// Define the AuthState type.
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

// Define the initial state of AuthState.
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

// Create a slice named `auth`.
const authSlice = createSlice({
    name: 'auth',
    initialState,
    // Reducers define how the state changes in response to specific actions.
    reducers: {
        // Action to set the user and authenticate.
        setUser(state, action: PayloadAction<User>) {
            // `action.payload` contains data belongs to authenticated user.
            state.user = action.payload;
            // This indicates that user is authenticated (sign in/sign up).
            state.isAuthenticated = true;
        },

        // Action to clear the user and de-authenticate.
        clearUser(state) {
            // `null` means that no data belongs to user.
            state.user = null;
            // This indicates that user is signed out.
            state.isAuthenticated = false;
        },
    },
});

// Export actions and the reducer.
export const {setUser, clearUser} = authSlice.actions;
export default authSlice.reducer;
