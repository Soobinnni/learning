import { useRef, useState } from "react";
import ResultModal from './ResultModal.jsx';

export default function TimerChallenge({ title, targetTime }) {
    const timer = useRef();
    const dialog = useRef();

    // 시간이 얼마나 남았는 지, 나머지 시간을 상태변수로 관리.
    const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);

    // 시작되었는지, 종료되었는지 boolean 
    const timerIsActive = timeRemaining > 0 && timeRemaining < targetTime * 1000;

    if (timeRemaining <= 0) {
        // 시간이 다 되어 종료
        clearInterval(timer.current);
        setTimeRemaining(targetTime * 1000);
        dialog.current.open();
    }

    // 남은 시간을 관리하기 위해 setTimeout -> setInterval함수로 변경
    function handleStart() {
        timer.current =
            setInterval(() => {
                setTimeRemaining(prevTimeRemaining => prevTimeRemaining - 10);
            }, 10);
    }
    function handleStop() {
        // 수동으로 멈췄을 때.
        clearInterval(timer.current);

        // TODO: 승리 모달이 띄워지게 하기.
        dialog.current.open();
    }
    return (
        <>
            <ResultModal
                targetTime={targetTime}
                result="lost"
                ref = {dialog}
                />
            <section className="challenge">
                <h2>{title}</h2>
                <p className="challenge-time">
                    {targetTime} second{targetTime > 1 && 's'}
                </p>
                <p>
                    <button
                        onClick={timerIsActive ? handleStop : handleStart}
                    >
                        {timerIsActive ? 'Stop' : 'Start'} Challenge
                    </button>
                </p>
                <p className={timerIsActive ? 'active' : undefined}>
                    {
                        timerIsActive ?
                            'Time is running...' :
                            'Timer inactive'
                    }
                </p>
            </section>
        </>
    )
}