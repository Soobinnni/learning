import { useState } from "react";

export default function Login() {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [enteredPassword, setEnteredPassword] = useState('');

  const [enteredValues, setEnteredValues] = useState({
    email: '',
    password: '',
  });

  function handleSubmit(event) {
    event.preventDefault(); // 브라우저가 submit 이벤트에 기본적으로 수행하는 작업(새로고침) 방지.

    console.log(`email: ${enteredValues.email}\npassword: ${enteredValues.password}`)
  }

  function handleInputChange(identifier, value){
    setEnteredValues(prevValues=>(
      {
        ...prevValues,
        [identifier]:value
      }
    ))
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            type="email" 
            name="email" 
            onChange={(event)=>handleInputChange('email', event.target.value)}
            value={enteredValues.email}
          />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            type="password" 
            name="password" 
            onChange={(event)=>handleInputChange('password', event.target.value)}
            value={enteredValues.password}
          />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}
