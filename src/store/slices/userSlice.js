import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'users',
    initialState: {
        currentUser: null,
        userRole: 'student',
    },
    reducers: {
        setUser(state, action) {
            const user = action.payload;
            state.currentUser = user;
            state.userRole = user.role;
        },
        modifyUser(state, action) {
            const updatedUser = action.payload;
            if (
                state.currentUser &&
                state.currentUser.id === action.payload.id
            ) {
                Object.assign(state.currentUser, updatedUser);
            }
        },
        clearUser(state, action) {
            const user_id = action.payload;
            state.currentUser = state.currentUser.filter(
                (user) => user.id !== user_id,
            );
        },
    },
});

export const {setUser, modifyUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
