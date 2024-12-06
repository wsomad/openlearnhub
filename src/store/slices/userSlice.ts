import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../types/user';

// Define the UserState type.
interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    userRole: 'student' | 'instructor';
}

// Define the initial state of UserState.
const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    userRole: 'student',
};

// Create a slice named `user` that combines auth and user data.
const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        // Action to set the user and authenticate.
        setUser(state, action: PayloadAction<User>) {
            const user = action.payload;
            state.user = user;
            state.isAuthenticated = true;
            state.userRole = user.role // Set role based on the user data
        },

        // Action to modify specific properties of the current user.
        modifyUser(state, action: PayloadAction<Partial<User>>) {
            const updatedUser = action.payload;
            if (state.user && state.user.uid === updatedUser.uid) {
                Object.assign(state.user, updatedUser);
            }
        },

        // Action to clear the user and de-authenticate.
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.userRole = 'student'; // Reset role to default
        },
    },
});

// Export actions and reducer.
export const {setUser, modifyUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
