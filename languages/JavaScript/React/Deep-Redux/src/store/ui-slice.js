import { createSlice } from "@reduxjs/toolkit";


const initialState  = {
    cartIsVisible: false,
    notification: null
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggle(state){state.cartIsVisible=!state.cartIsVisible},
        showNotification(state, action){
            /**
             * http status update
             */
            state.notification = { 
                statue: action.payload.status,
                title: action.payload.title,
                message: action.payload.message,
            };
        }
    }
})

const { reducer: uiReducer, actions: uiActions } = uiSlice;

export { uiActions };
export default uiReducer;