import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../types/user'; // Import the User type from the types folder

// Define the AuthState type using the imported User type
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Action to set the user and authenticate
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        // Action to clear the user and de-authenticate
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

// Export actions and the reducer
export const {setUser, clearUser} = authSlice.actions;
export default authSlice.reducer;
