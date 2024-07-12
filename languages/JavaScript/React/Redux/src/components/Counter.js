import { counterActions } from '../store';
import classes from './Counter.module.css';
import { useSelector, useDispatch } from 'react-redux';


const Counter = () => {

  const dispatch = useDispatch();
  const counter = useSelector((state)=>state.counter);
  const show = useSelector((state)=>state.showCounter);

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
