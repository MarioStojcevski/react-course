
import { useState } from 'react';

function Counter() {

  // useState(0) = start from 0
  const [count, setCount] = useState(0);

  // Add 1.
  function increaseCount() {
    setCount(count + 1);
  }

  // Subtract 1.
  function decreaseCount() {
    setCount(count - 1);
  }

  // Go back to 0.
  function resetCount() {
    setCount(0);
  }

  return (
    <div>
      <h2>Counter</h2>
      <p>{count}</p>
      <button onClick={increaseCount}>
        +1
      </button>
      <button onClick={decreaseCount}>
        -1
      </button>
      <button onClick={resetCount}>
        Reset
      </button>
    </div>
  );
}

export default Counter;