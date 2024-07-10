import { useState } from "react";

export function useInput(defaultValue, validatinFn) {
    const [enteredValue, setEnteredValue] = useState(defaultValue);
    const [didEdit, setDidEdit] = useState(false);

    const valueIsValid = validatinFn(enteredValue);

    function handleInputChange(event) {
        setEnteredValue(event.target.value);
        setDidEdit(false)
    }
    function handleInputBlur() {
        setDidEdit(true)
    }

    return {
        value: enteredValue,
        handleInputChange,
        handleInputBlur,
        hasError: didEdit && !valueIsValid
    }
}