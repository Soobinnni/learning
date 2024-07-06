import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = function Modal({ open, children }) {
  const dialog = useRef();

  // ref객체를 활용하는 코드는 아직 완전한 렌더링이 되지 않을 때
  // DOM요소와 연결되어야 하는 ref객체가 불완전할 수 있으므로(undefined) useEffect의 effect함수에
  // 정의하는 것이 안전하다.
  // 또한, open의 true, false값에 따라 modal이 닫히고 열려야 하므로 의존성 배열에 open을 추가한다.
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open])

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
