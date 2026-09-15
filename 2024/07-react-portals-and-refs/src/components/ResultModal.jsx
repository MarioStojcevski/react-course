import { forwardRef, useRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

const ResultModal = forwardRef(function ResultModal ({ remainingTime, targetTime, onReset}, ref) {
  const dialog = useRef();

  const userLost = remainingTime <= 0;
  const formattedTime = (remainingTime / 1000).toFixed(2);
  const score = (1 - remainingTime / 1000).toFixed(2) * 100;

  useImperativeHandle(ref, () => ({
    open: () => {
      dialog.current.showModal();
    }
  }));

  return createPortal(
    <dialog ref={dialog} className='result-modal'>
      {userLost && <h2>Time's up!</h2>}
      {!userLost && <h2>Score: {score}</h2>}
      <p>The target time was <strong>{targetTime}</strong> seconds.</p>
      <p>You stopped the timer with <strong>{formattedTime} seconds left.</strong></p>
      <form method="dialog" onSubmit={onReset}>
        <button>Close</button>
      </form>
    </dialog>
    , document.body);
});

export default ResultModal;