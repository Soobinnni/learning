import { configureStore } from "@reduxjs/toolkit"

import counterReducer from "./counter";
import authReducer from "./auth";


// store생성
// 여러 개의 리듀서를 하나의 리듀서로 합칠 수 있다.
const store = configureStore({
    // reducer: counterSlice.reducer, 갖고 있는 유일한 리듀서이므로 하나만 정의해도 됨.
    reducer: { 
        counter: counterReducer,
        auth: authReducer
    } // 여러 개 병합할 때

});

export default store;