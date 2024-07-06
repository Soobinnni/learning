import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = function Modal({ open, onClose, children }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open])

  return createPortal(
    // 닫기버튼을 직접 클릭하면 DeleteConfirmation의 onClick
    // 이벤트 처리로 상태 변경이 되어 모달이 닫히지만, dialog의 
    // ESC를 이용하여 모달을 닫을 경우, 상태가 업데이트 되지 않아 
    // 버그가 생김.

    // => dialog의 onClose prop을 이용하여 상태를 변경한다.
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
