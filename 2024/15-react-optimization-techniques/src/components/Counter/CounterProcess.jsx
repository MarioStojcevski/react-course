import { log } from '../../log.js';
import { useState } from 'react';

const CounterProcess = ({ setCounter }) => {
  log('<CounterProcess /> rendered');
  const [enteredNumber, setEnteredNumber] = useState(0);

  function handleChange(event) {
    setEnteredNumber(+event.target.value);
  }
  
  return (
    <section id="configure-counter">
      <h2>Set Counter</h2>
      <input type="number" onChange={handleChange} value={enteredNumber} />
      <button onClick={() => {
        setCounter(enteredNumber);
        setEnteredNumber(0);
      }}>Set</button>
    </section>
  );
};

export default CounterProcess;