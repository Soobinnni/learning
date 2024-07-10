import { useInput } from "../hooks/useInput.js";

import Input from "./Input";

import { isEmail, isNotEmpty, hasMinLength } from "../util/validation.js"

export default function Login() {
  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailError
  } = useInput('', (value) => isEmail(value) && isNotEmpty(value));
  
  const {
    value: passwordlValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordError
  } = useInput('', (value) => hasMinLength(value, 6));

  function handleSubmit(event) {
    event.preventDefault();

    console.log(`email: ${emailValue}\npassword: ${passwordlValue}`)

    if (emailError || passwordError) return;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        {/* Email Input */}
        <Input
          label="Email"
          id="email"
          type="text"
          name="email"
          value={emailValue}
          onBlur={handleEmailBlur}
          onChange={handleEmailChange}
          error={emailError && 'Please enter a valid email!'}
        />
        <Input
          label="Password"
          id="password"
          type="password"
          name="password"
          value={passwordlValue}
          onBlur={handlePasswordBlur}
          onChange={handlePasswordChange}
          error={passwordError && 'Please enter a valid password!'}
        />
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}