import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    counter: 0,
    showCounter: true
}

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment(state) { state.counter++ }, // 자동으로 원래 상태를 복사하므로 불변성 유지.
        increase(state, action) { state.counter += action.payload },
        decrement(state) { state.counter-- },
        toggleCounter(state) { state.showCounter = !state.showCounter }
    }
});


const {reducer: counterReducer, actions: counterActions} = counterSlice;

export { counterActions };
export default counterReducer;