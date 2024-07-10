import { useRef } from "react"
import Input from "./Input.jsx"
import Modal from "./Modal.jsx";
export default function NewProject ({ onAdd, onCancel }) {
    const title = useRef();
    const description = useRef();
    const dueDate = useRef();
    const dialog = useRef();

    function handleSave() {
        const enteredTitle = title.current.value;
        const enteredDescription = description.current.value;
        const enteredDueDate = dueDate.current.value;

        // validate
        if(
            enteredTitle.trim()==='' ||
            enteredDescription.trim()==='' ||
            enteredDueDate.trim()===''
        ) {
            // show modal
            dialog.current.open();
            return;
        }

        // save(상위 컴포넌트 함수 호출)
        onAdd({
            title:enteredTitle,
            description:enteredDescription,
            dueDate:enteredDueDate,
        });
    }
    return (
        <>
            <Modal ref={dialog} buttonCaption='Okay'>
            <h2 className="text-xl font-bold text-stone-600 my-4">Invalid Input</h2>
            <p className="text-stone-600 mb-4">Oops ... looks like you forgot to enter a value.</p>
            <p className="text-stone-600 mb-4">Please make sure you provide a valid value for every input field.</p>
            </Modal>
            <div className="w-[35rem] mt-16">
                <menu className="flex items-center justify-end gap-4 my-4">
                    <li><button 
                            className="text-stone-800 hover:text-stone-950"
                            onClick={onCancel}
                            >Cancel</button></li>
                    <li><button 
                            className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
                            onClick={handleSave}
                            >Save</button></li>
                </menu>
                <div>
                    <Input type="text" label ='Title' ref={title} />
                    {/* <Input label ='Description' textarea={true}/> 아래도 같은 표현*/}
                    <Input label ='Description' textarea ref={description}/>
                    <Input type="date" label ='Due Date'  ref={dueDate}/>
                </div>
            </div>
        </>
    )
}