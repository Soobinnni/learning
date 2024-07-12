import { createSlice, configureStore } from "@reduxjs/toolkit"

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


// store생성
// 여러 개의 리듀서를 하나의 리듀서로 합칠 수 있다.
const store = configureStore({
    reducer: counterSlice.reducer, // 갖고 있는 유일한 리듀서이므로 하나만 정의해도 됨.
    // reducer: {counter: counterSlice.reducer} 여러 개 병합할 때

});

export const counterActions = counterSlice.actions;
export default store;