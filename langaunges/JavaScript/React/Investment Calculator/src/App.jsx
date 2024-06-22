import UserInput from "./components/UserInput.jsx"
import Results from "./components/Results.jsx";
import { USER_INPUT_INFO } from "./const/userInfo.js"

import { useState } from 'react';

function App() {
  const [userInput, setUserInput] = useState({
    initialInvestment: 10000,
    annualInvestment: 1200,
    expectedReturn: 6,
    duration: 10
  });
  const inputIsValid = userInput.duration >= 1;

  function handleChange(inputIdentifier, newValue) {
    setUserInput(preUserInput => {
      return {
        ...preUserInput,
        [inputIdentifier]: +newValue,
      };
    });
  }
  return (
    <>
      <UserInput userInputInfo={USER_INPUT_INFO} userInput={userInput} onChangeInputValue={handleChange} />
      {
        inputIsValid && <Results input={userInput}/>
      }
      {
        !inputIsValid && 
          <p className="center">Please enter a duration greater than zero.</p>
      }
    </>
  )
}

export default App