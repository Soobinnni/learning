import Modal from "./Modal.jsx";
import ErrorBlock from "../ErrorBlock.jsx";

const DeleteConfirmationModal = ({ onClose, onConfirm, title, isPendingDeletion, isErrorDeleting, deleteError }) => {
    return (
        <Modal onClose={onClose}>
            <h2 className="text-center font-extrabold text-lg"><span className="font-serif">{title}</span>을 삭제합니다.</h2>
            <div className="modal-content my-6 text-zinc-500">
                <p>정말 삭제하시겠습니까?</p>
                <p>삭제한 글은 다시 복구할 수 없습니다.</p>
            </div>
            <div className="form-actions">
                {isPendingDeletion && <p>삭제 중입니다. 조금만 기다려주세요!</p>}
                {!isPendingDeletion && (
                    <>
                        <button onClick={onClose} className="button-text">취소</button>
                        <button onClick={onConfirm} className="button">삭제</button>
                    </>
                )}
            </div>
            {isErrorDeleting && (
                <ErrorBlock
                    title="글 삭제 실패"
                    message={deleteError.info?.message || '글 삭제에 실패했습니다. 잠시 뒤 다시 시도해주세요!'}
                />
            )}
        </Modal>
    );
}

export default DeleteConfirmationModal;