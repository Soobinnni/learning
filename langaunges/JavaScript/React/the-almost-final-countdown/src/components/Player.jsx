import { useRef, useState } from "react";

export default function Player() {
  const playerName = useRef();

  const [enteredPlayerName, setEnteredPlayerName] = useState(null);

  function handleClick() {
    setEnteredPlayerName(playerName.current.value);
    playerName.current.value = '';
  }
  return (
    <section id="player">
      {/* ?? 연산자는 연산자는 피연산자가 null 또는 undefined인 경우에만 오른쪽 피연산자를 반환
        그 외의 값이 있을 경우에는 왼쪽 피연산자를 반환 */}
      <h2>Welcome { enteredPlayerName ?? "unknown entity"}</h2>
      <p>
        <input
          ref={playerName}
          type="text"/>
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
