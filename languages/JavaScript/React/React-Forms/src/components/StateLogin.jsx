import { useState } from "react";

import Input from "./Input";

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
  const passwordIsInvalid=(didEdit.password) && (enteredValues.password.trim().length < 6 );

  function handleSubmit(event) {
    event.preventDefault();

    console.log(`email: ${enteredValues.email}\npassword: ${enteredValues.password}`)

    if(emailIsInvalid) return;
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
        {/* Email Input */}
        <Input
          label="Email"
          id="email"
          type="email"
          name="email"
          value={enteredValues.email}
          onBlur={()=>handleInputBlur('email')}
          onChange={(event)=>handleInputChange('email', event.target.value)}
          error={emailIsInvalid&&'Please enter a valid email!'}
        />
        <Input
          label="Password"
          id="password"
          type="password"
          name="password"
          value={enteredValues.password}
          onBlur={()=>handleInputBlur('password')}
          onChange={(event)=>handleInputChange('password', event.target.value)}
          error={passwordIsInvalid&&'Please enter a valid password!'}
        />
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}