import { useState } from 'react';
import Button from './components/Button.jsx';
import styles from './VisibilityToggle.module.css';

function VisibilityToggle() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={styles.card}>
      <h2>Visibility Toggle</h2>
      <Button primary onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'}
      </Button>

      {isVisible && (
        <p className={styles.text}>
          State decides what renders. Flip the switch and React removes this
          paragraph from the DOM — then puts it back.
        </p>
      )}
    </div>
  );
}

export default VisibilityToggle;
