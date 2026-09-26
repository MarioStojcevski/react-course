import { useState } from 'react';

function ColorPicker() {
  // color remembers the current background color.
  const [color, setColor] = useState('#1f1f1f');

  return (
    <div
      style={{
        backgroundColor: color,
        padding: '30px'
      }}
    >
      <h2>Color Picker</h2>
      <button onClick={() => setColor('#600000')}>
        Red
      </button>
      <button onClick={() => setColor('#005315')}>
        Green
      </button>
      <button onClick={() => setColor('#0b0060')}>
        Blue
      </button>
    </div>
  );
}

export default ColorPicker;