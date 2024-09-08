// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state) {
      state.isAuthenticated = true;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
    },
    setAuthState(state, action) {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { loginSuccess, logoutSuccess, setAuthState } = authSlice.actions;
export default authSlice.reducer;
