import { useRef, useState } from "react";

export default function Player() {
  // useRef hook 사용
  const playerName = useRef();

  const [enteredPlayerName, setEnteredPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  function handleChange(event) {
    setSubmitted(false);
    setEnteredPlayerName(event.target.value);
  }
  function handleClick() {
    setSubmitted(true);
  }
  return (
    <section id="player">
      <h2>Welcome {submitted ? enteredPlayerName : "unknown entity"}</h2>
      <p>
        <input
          ref = {playerName}
          type="text"
          onChange={handleChange}
          value={enteredPlayerName} />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
