import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../types/user'; // Assuming User type is defined in your types file

// Define the initial state structure
interface UserState {
    currentUser: User | null;
    userRole: 'student' | 'instructor'; // Add other roles as needed
}

// Initial state for the user slice
const initialState: UserState = {
    currentUser: null,
    userRole: 'student',
};

// Create the user slice
const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            const user = action.payload;
            state.currentUser = user;
            state.userRole = user.role;
        },
        modifyUser(state, action: PayloadAction<Partial<User>>) {
            const updatedUser = action.payload;
            if (
                state.currentUser &&
                state.currentUser.uid === updatedUser.uid
            ) {
                Object.assign(state.currentUser, updatedUser);
            }
        },
        clearUser(state) {
            state.currentUser = null; // Set currentUser to null instead of filtering
        },
    },
});

// Export actions and reducer
export const {setUser, modifyUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
