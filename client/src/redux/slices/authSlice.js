

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: "",
    email: "",
    password: ""
  },
  isAuthenticated: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;  
    },
    setAuthenticationStatus(state, action) {  
      state.isAuthenticated = action.payload; 
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false; 
      localStorage.removeItem("token"); 
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  }
});

export const { setUser, setAuthenticationStatus ,clearUser, updateUser} = userSlice.actions;

export default userSlice.reducer;
