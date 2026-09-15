import { useState } from 'react';

import Counter from './components/Counter/Counter.jsx';
import Header from './components/Header.jsx';
import CounterProcess from './components/Counter/CounterProcess.jsx';
import { log } from './log.js';

function App() {
  log('<App /> rendered');
  const [chosenCount, setChosenCount] = useState(0);

  function handleSetClick(enteredNumber) {
    setChosenCount(enteredNumber);
  }

  return (
    <>
      <Header />
      <main>
        <CounterProcess setCounter={handleSetClick}  />
        <Counter initialCount={chosenCount} />
      </main>
    </>
  );
}

export default App;
