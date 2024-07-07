import { useEffect } from "react";

export default function DeleteConfirmation({ onConfirm, onCancel }) {

  // setTime을 useEffect로 정의하는 이유: 컴포넌트 생명주기와 관계없이 설정한 타이머는 계속해서 실행되며
  // 만일 setTimeout에 상태가 포함될 경우 컴포넌트가 여러 번 렌더링될 수 있음
  useEffect(()=>{
    const timer = setTimeout(()=>{
      onConfirm()
    }, 3000);
    
    // clean up function
    return ()=>{
      clearTimeout(timer);
    }
  }, [onConfirm])
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
    </div>
  );
}
