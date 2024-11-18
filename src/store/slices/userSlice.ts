import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../types/user';

// Define the UserState type.
interface UserState {
    currentUser: User | null;
    userRole: 'student' | 'instructor';
}

// Define the initial state of UserState.
const initialState: UserState = {
    currentUser: null,
    userRole: 'student',
};

// Create a slice named `users`.
const userSlice = createSlice({
    name: 'users',
    initialState,
    // Reducers define how the state changes in response to specific actions.
    reducers: {
        // Action to set the current user in the state.
        setUser(state, action: PayloadAction<User>) {
            // `action.payload` contains data belongs to user.
            const user = action.payload;
            // Assigned that data to the current user.
            state.currentUser = user;
            // Plus, assigned the role of current user as well.
            state.userRole = user.role;
        },

        // Action to modify specific properties of the current user.
        modifyUser(state, action: PayloadAction<Partial<User>>) {
            // `action.payload` contains specific data belongs to user.
            const updatedUser = action.payload;
            // If currentUser is not null & current user's uid matches the user id being updated.
            if (
                state.currentUser &&
                state.currentUser.uid === updatedUser.uid
            ) {
                // Then, merge the updated data belongs to the current user.
                Object.assign(state.currentUser, updatedUser);
            }
        },

        // Action to clear user from state.
        clearUser(state) {
            state.currentUser = null;
        },
    },
});

// Export actions and reducer
export const {setUser, modifyUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
