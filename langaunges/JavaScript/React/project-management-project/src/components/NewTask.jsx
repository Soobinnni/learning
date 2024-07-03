import { useState } from "react"

export default function NewTask({ onAdd }) {
    // task입력 후 버튼을 클릭했을 때 task 저장과 함께 input을 비우기 위해서 
    // useRef 대신 컴포넌트를 렌더링하는 useState를 사용
    const [enteredTask, setEnteredTask] = useState('');

    function handleChange(event) {
        setEnteredTask(event.target.value);
    }

    function handleClick() {
        setEnteredTask('');
        // props drilling으로 전달된 함수
        onAdd(enteredTask);
    }
    return (
        <div>
            <input
                type='text'
                className="w-64 px-2 py-1 mr-2 rounded-sm bg-stone-200" 
                value={enteredTask}
                onChange={handleChange}
            />
            <button
                className="text-stone-700 hover:text-stone-950"
                onClick={handleClick}
            >Add Task</button>
        </div>
    )
}