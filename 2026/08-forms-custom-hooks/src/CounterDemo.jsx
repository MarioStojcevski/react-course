   //  TRY  easy 

   import useCounter from './useCounter';

function CounterDemo() {
  const {
    count,
    increment,
    decrement,
    reset
  } = useCounter(0);

  return (
    <div>
      <h2>Counter</h2>

      <p>{count}</p>

      <button onClick={increment}>
        +1
      </button>

      <button onClick={decrement}>
        -1
      </button>

      <button onClick={reset}>
        Reset
      </button>
    </div>
  );
}

export default CounterDemo;