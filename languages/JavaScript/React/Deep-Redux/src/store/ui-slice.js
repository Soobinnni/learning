import { createSlice } from "@reduxjs/toolkit";


const initialState  = {
    cartIsVisible: false
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggle(state){state.cartIsVisible=!state.cartIsVisible}
    }
})

const { reducer: uiReducer, actions: uiActions } = uiSlice;

export { uiActions };
export default uiReducer;