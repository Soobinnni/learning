import { useState } from "react";

export default function Login() {
  const [enteredValues, setEnteredValues] = useState({
    email: '',
    password: '',
  });
  const [didEdit, setDidEdit] = useState({ // 사용자가 input을 건드렸는지 log
    email: false,
    password: false,
  });

  // 유효성 검사
  const emailIsInvalid=(didEdit.email) && (!enteredValues.email.includes('@'));

  function handleSubmit(event) {
    event.preventDefault();

    console.log(`email: ${enteredValues.email}\npassword: ${enteredValues.password}`)
  }

  function handleInputChange(identifier, value){
    setEnteredValues(prevValues=>(
      {
        ...prevValues,
        [identifier]:value
      }
    ))
    setDidEdit(preDid=>( //다시 입력할 때 유효성 검사를 위해 리셋
      {...preDid, [identifier]:false}
    ))
  }
  function handleInputBlur(identifier) {
    setDidEdit(preDid=>(
      {...preDid, [identifier]:true}
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
            onBlur={()=>handleInputBlur('email')}
            onChange={(event)=>handleInputChange('email', event.target.value)}
            value={enteredValues.email}
          />
          <div className="control-error">{emailIsInvalid&&<p>Please enter a valid email address</p>}</div>
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