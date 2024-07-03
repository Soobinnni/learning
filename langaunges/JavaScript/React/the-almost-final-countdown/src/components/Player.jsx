import { useRef, useState } from "react";

export default function Player() {
  // useRef hook 사용
  const playerName = useRef();

  const [enteredPlayerName, setEnteredPlayerName] = useState(null);

  function handleClick() {
    /*
      React의 훅(hook) 중 하나로, **저장공간 또는 DOM 요소에 접근하기 위해 사용되는 React Hook.**

      - 자바스크립트에서 특정 DOM에 접근하기 위해 querySelector 등의 함수를 사용한다. 선언형 프로그래밍 언어인 React에서도 DOM을 직접 선택해야하는 경우가 필요한데, 그럴 때 useRef란 React Hook을 사용할 수 있다.
      
      [사용법]    
      - useRef로 객체를 생성하고 원하는 DOM에 ref객체를 속성으로 삽입(`ref={}`)
      - ref.current는 해당 DOM을가리킨다.
      - current를 통해 DOM을 직접 조작한다.
    */
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
