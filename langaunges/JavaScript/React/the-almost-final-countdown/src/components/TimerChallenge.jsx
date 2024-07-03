import { useState } from "react";

export default function TimerChallenge({title, targetTime}) {
    /*
     * 도전을 시작하면, 흐른 시간을 유추해서 멈춤을 누르는 컴포넌트
     */


    const [timeStarted, setTimeStarted] = useState(false);
    const [timeExpired, setTimeExpired] = useState(false);
    function handleStart () {
        /*
         *  setTimeout 첫 번째 인자: time out 후 호출될 함수
         *              두 번째 인자: time 
         */
        setTimeout(() => {
            setTimeExpired(true);
        }, targetTime * 1000);
        setTimeStarted(true);
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
                    onClick={handleStart}
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