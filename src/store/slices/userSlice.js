import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'users',
    initialState: {
        currentUser: null,
        allUsers: [],
    },
    reducers: {
        setUser(state, action) {
            state.currentUser = action.payload;
        },
        setUsers(state, action) {
            state.allUsers = action.payload;
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

export const {setUser, setUsers, modifyUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
