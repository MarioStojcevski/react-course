import styles from './Button.module.css';

function Button({ children, primary = false, onClick, type = 'button' }) {
  const className = primary
    ? `${styles.button} ${styles.primary}`
    : styles.button;

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
