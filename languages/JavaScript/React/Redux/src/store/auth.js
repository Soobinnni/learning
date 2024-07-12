import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state){state.isAuthenticated=true},
        logout(state){state.isAuthenticated=false}
    }
});

const {reducer: authReducer, actions: authActions} = authSlice;

export { authActions };
export default authReducer;