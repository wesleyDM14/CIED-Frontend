import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
    isAuthenticated: boolean;
    accessToken: string | null;
    userRole: string | null;
    checked: boolean;
    serviceCounter: string | null;
}

const initialState: SessionState = {
    isAuthenticated: false,
    accessToken: null,
    userRole: null,
    checked: false,
    serviceCounter: localStorage.getItem('serviceCounter') ?? null,
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
        setServiceCounter: (state, action: PayloadAction<string>) => {
            state.serviceCounter = action.payload;
            localStorage.setItem('serviceCounter', action.payload);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.accessToken = null;
            state.userRole = null;
            state.checked = true;
            state.serviceCounter = null;
            localStorage.removeItem('serviceCounter');
            localStorage.removeItem('user');
        },
        setChecked: (state) => {
            state.checked = true;
        },
    },
});

export const { login, logout, setChecked, setServiceCounter } = sessionSlice.actions;
export default sessionSlice.reducer;