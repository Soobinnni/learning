import { useRef, useState } from "react";
import ResultModal from './ResultModal.jsx';

export default function TimerChallenge({ title, targetTime }) {
    /*
     * 도전을 시작하면, 흐른 시간을 유추해서 멈춤을 누르는 컴포넌트
     */

    const timer = useRef();
    const dialog = useRef();

    const [timeStarted, setTimeStarted] = useState(false);
    const [timeExpired, setTimeExpired] = useState(false);

    function handleStart() {
        timer.current =
            setTimeout(() => {
                setTimeExpired(true);
                dialog.current.showModal();
            }, targetTime * 1000);
        setTimeStarted(true);
    }
    function handleStop() {
        clearTimeout(timer.current);
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
                        onClick={timeStarted ? handleStop : handleStart}
                    >
                        {timeStarted ? 'Stop' : 'Start'} Challenge
                    </button>
                </p>
                <p className={timeStarted ? 'active' : undefined}>
                    {
                        timeStarted ?
                            'Time is running...' :
                            'Timer inactive'
                    }
                </p>
            </section>
        </>
    )
}