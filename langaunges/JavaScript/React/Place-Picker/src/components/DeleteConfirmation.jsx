import { useEffect, useState } from "react";

const TIMER = 3000;
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const [remainingTime, setRemainingTime] = useState(TIMER);

  useEffect(() => { // 모달 닫히는 시간 알려줌.
    const interval = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 10);
    }, 10)
    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => { // 모달이 닫힘
    const timer = setTimeout(() => {
      onConfirm()
    }, TIMER);

    return () => {
      clearTimeout(timer);
    }
  }, [onConfirm])


  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value={remainingTime} max={TIMER} />
    </div>
  );
}
