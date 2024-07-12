import { counterActions } from '../store/counter';
import classes from './Counter.module.css';
import { useSelector, useDispatch } from 'react-redux';


const Counter = () => {

  // 디스패치 함수
  const dispatch = useDispatch();

  // state선택
  const counter = useSelector((state)=>state.counter.counter);
  const show = useSelector((state)=>state.counter.showCounter);

  // 액션 객체를 디스패치 함수의 인자로 전달
  const incrementHandler = () => {dispatch(counterActions.increment());}
  const increaseHandler = (amount) => {dispatch(counterActions.increase(amount))  };
  const decrementHandler = () => {dispatch(counterActions.decrement());}
  const toggleCounterHandler = () => {dispatch(counterActions.toggleCounter());}

  return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      { show && <div className={classes.value}>{counter}</div>}
      <div>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={()=>increaseHandler(5)}>Increment 5</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
};

export default Counter;
