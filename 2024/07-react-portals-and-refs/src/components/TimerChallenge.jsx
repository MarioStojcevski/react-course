import { useRef, useState } from "react";
import ResultModal from "./ResultModal";

const TimerChallenge = ({ title, targetTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);
  const timer = useRef();
  const dialog = useRef();

  const timerIsActive = timeRemaining > 0 && timeRemaining < targetTime * 1000;

  if(timeRemaining <= 0) {
    clearInterval(timer.current);
    dialog.current.open();
  }

  const handleResetModal = () => {
    setTimeRemaining(targetTime * 1000);
  }

  const startTimer = () => {
    timer.current = setInterval(() => {
      setTimeRemaining((time) => time - 10);
    }, 10);
  }

  const handleStop =() => {
    clearInterval(timer.current);
    dialog.current.open();
  }

  return (
    <>
      <ResultModal ref={dialog} targetTime={targetTime} remainingTime={timeRemaining} onReset={handleResetModal} />

      <section className="challenge">
      <h2>{title}</h2>
      <p className="challenge-time">
        {targetTime} second{targetTime > 1 ? "s" : ""}
      </p>
      <p>
        <button onClick={timerIsActive ? handleStop : startTimer}>
          {timerIsActive ? "Stop" : "Start"}
        </button>
      </p>

      <p className={timerIsActive ? 'active' : undefined}>
        {timerIsActive ? "Timer Running" : "Timer Not Started"}
      </p>
    </section>
    </>
  );
};

export default TimerChallenge;