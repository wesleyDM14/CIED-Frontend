import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
    isAuthenticated: boolean;
    accessToken: string | null;
    userRole: string | null;
    checked: boolean;
}

const initialState: SessionState = {
    isAuthenticated: false,
    accessToken: null,
    userRole: null,
    checked: false,
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ accessToken: string; userRole: string }>) => {
            state.isAuthenticated = true;
            state.accessToken = action.payload.accessToken;
            state.userRole = action.payload.userRole;
            state.checked = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.accessToken = null;
            state.userRole = null;
            state.checked = true;
            localStorage.removeItem('user');
        },
        setChecked: (state) => {
            state.checked = true;
        },
    },
});

export const { login, logout, setChecked } = sessionSlice.actions;
export default sessionSlice.reducer;