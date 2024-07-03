import { useRef, useState } from "react";

export default function TimerChallenge({title, targetTime}) {
    /*
     * 도전을 시작하면, 흐른 시간을 유추해서 멈춤을 누르는 컴포넌트
     */

    const timer = useRef();

    const [timeStarted, setTimeStarted] = useState(false);
    const [timeExpired, setTimeExpired] = useState(false);

    function handleStart () {
        timer.current = 
            setTimeout(() => {
                setTimeExpired(true);
            }, targetTime * 1000);
        setTimeStarted(true);
    }
    function handleStop(){
        // 어떻게 handleStart 내 setTimeout 함수에 접근하느냐??
        // ---> ref, 참조를 이용한다.
        clearTimeout(timer.current);
    }
    return (
        <section className="challenge">
            <h2>{title}</h2>
            {
                timeExpired && <p>You lost!</p>
            }
            <p className="challenge-time">
                {targetTime} second{targetTime > 1 && 's'}
            </p>
            <p>
                <button
                    onClick={timeStarted?handleStop:handleStart}
                >
                    {timeStarted?'Stop':'Start'} Challenge
                </button>
            </p>
            <p className={timeStarted?'active':undefined}>
                {
                    timeStarted?
                        'Time is running...' :
                        'Timer inactive'
                }
            </p>
        </section>
    )
}