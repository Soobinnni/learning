// 리듀서 함수 정의: 인자 state는 상태, = 으로 초기값 설정.
//                  인자 action은 상태 변화에 대한 정보 객체
const counterReducer = (state = { counter: 0 }, action) => {
    if (action.type === 'increment') {
        return {
            counter: state.counter + 1
        };
    }
    if (action.type === 'decrement') {
        return {
            counter: state.counter - 1
        };
    }
    return state;
};

// redux 중앙 저장소 생성. 인자로 리듀서 함수 전달.
const redux = require('redux');
const store = redux.createStore(counterReducer);

// 구독함수 정의, 구독함수 등록. 중앙 저장소가 변경되면 수행할 일을 구독함수에 정의한다.
const counterSubscriber = () => {
    store.getState();
};
store.subscribe(counterSubscriber);

// 컴포넌트는 상태변화가 필요하면, dispatch함수 및 액션을 통해 트리거한다.
store.dispatch({ type: 'increment' });
console.log(store.getState());

store.dispatch({ type: 'decrement' });
console.log(store.getState());

/**요약
 * 1. 컴포넌트는 상태 변경이 필요하면, dispatch 메소드를 통해 액션을 발송한다.
 * 2. Redux는 액션이 발송되면 순수함수인 리듀서를 호출하고 리듀서 함수는 상태를 변화시키고 최신의 상태를 반환한다.
 * 3. 리듀서 함수가 반환한 새 상태는 모든 상태를 저장한 중앙 데이터 저장소에 의해 갱신된다.
 * 4. 저장소가 업데이트되면, 이를 구독하고 있는 모든 구독 함수가 실행된다.
 * 5. 상태가 변경될 때마다 구독함수는 호출되며 정의된 필요한 작업을 수행한다.
 */