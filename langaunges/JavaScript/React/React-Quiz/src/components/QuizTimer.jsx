import { useEffect, useState } from "react"

export default function QuizTimer({timeout, onTimeout, activeQuestionIndex}) {
    const [remainingTime, setRemainingTime] = useState(timeout);
    
    useEffect(()=>{
        const timer = setTimeout( onTimeout, timeout);
        return () => {
            clearTimeout(timer);
        }
    },[onTimeout, timeout, activeQuestionIndex]);

    useEffect(()=>{
        const interval = setInterval(()=>{
            setRemainingTime((preRemainTime)=>(preRemainTime-100))
        },100);
        return () => {
            clearInterval(interval);
        }
    },[]);

    return (
        <progress id="question-time" value={remainingTime} max={timeout}/>
    )
}