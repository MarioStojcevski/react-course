import { useState, useEffect } from 'react';

function DocumentTitle() {
  // count remembers how many times the button was clicked.
  const [count, setCount] = useState(0);

  // This effect runs every time count changes.
  // Секогаш кога count ќе се смени, смени го и title-от на browser tab-от.
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);   // А [count] е dependency array. - run this effect when count changes. го пуштаме само еднаш

  return (
    <div>
      <h2>Document Title</h2>

      <p>You clicked {count} times</p>

      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default DocumentTitle;