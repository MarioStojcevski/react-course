import { useState } from 'react';
import Counter from './Counter.jsx';
import TodoList from './TodoList.jsx';
import VisibilityToggle from './VisibilityToggle.jsx';
import ColorPicker from './ColorPicker.jsx';
import styles from './App.module.css';

function App() {
  const [pageColor, setPageColor] = useState('#f3f4f6');

  return (
    <main className={styles.app} style={{ backgroundColor: pageColor }}>
      <h1>Session 05 App</h1>
      <p className={styles.subtitle}>
        State, events and styling — counter, todos, toggle and color picker.
      </p>

      <section className={styles.grid}>
        <Counter />
        <TodoList />
        <VisibilityToggle />
        <ColorPicker onChange={setPageColor} />
      </section>
    </main>
  );
}

export default App;
