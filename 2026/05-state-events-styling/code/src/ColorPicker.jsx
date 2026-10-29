import { useState } from 'react';
import Button from './components/Button.jsx';
import styles from './ColorPicker.module.css';

const COLORS = [
  { name: 'Red', value: '#fee2e2' },
  { name: 'Green', value: '#d1fae5' },
  { name: 'Blue', value: '#dbeafe' },
];

function ColorPicker({ onChange }) {
  const [selected, setSelected] = useState(null);

  function pick(color) {
    setSelected(color);
    onChange(color.value);
  }

  return (
    <div className={styles.card}>
      <h2>ColorPicker</h2>
      <div className={styles.buttons}>
        {COLORS.map((color) => (
          <Button key={color.value} onClick={() => pick(color)}>
            {color.name}
          </Button>
        ))}
      </div>

      {selected ? (
        <div
          className={styles.swatch}
          style={{ backgroundColor: selected.value }}
        >
          Page background: {selected.value}
        </div>
      ) : (
        <p className={styles.hint}>Pick a color to repaint the page.</p>
      )}
    </div>
  );
}

export default ColorPicker;
