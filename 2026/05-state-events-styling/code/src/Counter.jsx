import { useState } from 'react';
import styles from './Counter.module.css';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.card}>
      <h2>Counter</h2>
      <p className={styles.value}>{count}</p>
      <div className={styles.controls}>
        <button onClick={() => setCount(count - 1)}>-1</button>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
}

export default Counter;
