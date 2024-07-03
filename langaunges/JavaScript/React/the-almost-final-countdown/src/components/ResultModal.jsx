import { forwardRef, useImperativeHandle, useRef } from "react"

const ResultModal = forwardRef(function ResultModal({remainingTime, targetTime, onReset}, ref){
    const dialog = useRef();

    const userLost = remainingTime <= 0;
    const formattedRemainingTime = (remainingTime / 1000).toFixed(2);

    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            }
        }
    });
    return (
        <dialog 
            className="result-modal" 
            ref = {dialog}>
            {
                userLost &&
                <h2>Your lost</h2>
            }
            <p>The target time was <strong>{targetTime} seconds.</strong></p>
            <p>You stopped the timer with <strong>{formattedRemainingTime} seconds left.</strong></p>

            <form action="dialog" onSubmit={onReset}> 
                {/* 닫을 때, set remain time이 초기화 된다. */}
                <button>Close</button>
            </form>
        </dialog>
    )
})

export default ResultModal;