import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectUser = createSelector(
    (state: RootState) => state.session.accessToken,
    (state: RootState) => state.session.userRole,
    (accessToken, userRole) => ({ accessToken, userRole })
);