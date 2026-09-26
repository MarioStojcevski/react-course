// Import the CSS module.
import styles from './Button.module.css';

function Button({ children, primary }) {
  // If primary is true, use both classes.
  // If primary is false, use only the normal button class.
  const className = primary
    ? `${styles.button} ${styles.primary}`
    : styles.button;

  return (
    <button className={className}>
      {children}
    </button>
  );
}

export default Button;