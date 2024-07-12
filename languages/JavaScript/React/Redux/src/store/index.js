import { createStore } from "redux";

const initailState = {
    counter: 0,
    showCounter: true
}

const counterReducer = (state = initailState, action) => {

    switch (action.type) {
        case 'increment':
            return {
                ...state,
                counter: state.counter + 1,
            }
        case 'increase':
            return {
                ...state,
                counter: state.counter + action.amount
            }
        case 'decrease':
            return {
                ...state,
                counter: state.counter - 1
            }
        case 'toggle':
            return {
                ...state,
                showCounter: !state.showCounter
            }
        default:
            return state;
    }
}

// store생성
const store = createStore(counterReducer);
export default store;