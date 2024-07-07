import { useEffect, useState } from "react";

export default function ProgressBar({timer}) {
    /*
        생성 이유: setInterval로 인해서 state변경이 일어나고,
                이로 인해서 다른 useEffect 부수효과에 의존성인 onConfirm 함수객체를 확인해서 재실행 여부를
                확인해야 함-> 성능 개선을 위해 다른 컴포넌트를 생성해서 해당 함수만 검토하도록 리팩토링
    */

    const [remainingTime, setRemainingTime] = useState(timer);

    useEffect(() => { // 모달 닫히는 시간 알려줌.
        const interval = setInterval(() => {
            setRemainingTime(prevTime => prevTime - 10);
        }, 10)
        return () => {
            clearInterval(interval);
        }
    }, []);

    return (

        <progress value={remainingTime} max={timer} />
    )
}