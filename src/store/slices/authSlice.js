import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, // Initially, there is no user
        isAuthenticated: false, // Initially, the user is not authenticated
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const {setUser, clearUser} = authSlice.actions;
export default authSlice.reducer;
