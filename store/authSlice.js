import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    autoFill: {
      infoForm: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      console.log(action.payload);
      state.login.currentUser = action.payload;
      state.autoFill.infoForm = null;
      state.login.error = false;
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },

    registerStart: (state) => {
      state.autoFill.isFetching = true;
    },
    registerSuccess: (state, action) => {
      state.autoFill.isFetching = false;
      state.autoFill.infoForm = action.payload;
      state.autoFill.error = false;
    },
    registerFailed: (state) => {
      state.autoFill.isFetching = false;
      state.autoFill.error = true;
    },

    logOutSuccess: (state) => {
      state.login.isFetching = false;
      state.login.currentUser = null;
      state.login.error = false;
    },
    logOutFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    logOutStart: (state) => {
      state.login.isFetching = true;
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
  logOutStart,
  logOutSuccess,
  logOutFailed,
} = authSlice.actions;

export default authSlice.reducer;
