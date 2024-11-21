import { createSlice } from '@reduxjs/toolkit';
import { signupUser, loginUser } from './authAPI';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    addToken: (state, action) => {

      state.token = action.payload;
    },
    addUser: (state, action) => {
      state.user = localStorage.getItem("user");
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      // dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('token');
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        console.log("Signup pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        // state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        console.log("Signup successful! Token: " + action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
        console.error("Signup failed:", state.error);
      })
      .addCase(loginUser.pending, (state) => {
        console.log("Login pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', action.payload.user);
        console.log('Login successful! Token:', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        console.error("Login failed:", state.error);
      });
  },
});

export const { addToken, addUser, logout } = authSlice.actions;
export default authSlice.reducer;
