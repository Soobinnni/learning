import { Link, useNavigate } from "react-router-dom";
import Modal from "../../UI/Modal.jsx";
import { useMutation } from "@tanstack/react-query";
import { createArticle } from "../../../utils/http/article.js";
import { queryClient } from "../../../utils/http/index.js";
import Form from "./Form.jsx";
import ErrorBlock from "../../ErrorBlock.jsx";

const NewArticle = () => {
  const navigate = useNavigate();

  const {
    mutate,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(['article']);
      navigate('/blog')
    }
  });

  function handleSubmit(articleFormData) {
    mutate(articleFormData);
  }
  return (
    <Modal onClose={() => navigate('../')}>
      <Form onSubmit={handleSubmit}>
        {
          isPending && '제출 중...'
        }
        {
          !isPending && <>
            <Link to="../" className="button-text">
              취소
            </Link>
            <button type="submit" className="button">
              완료
            </button>
          </>
        }
      </Form>
      {
        isError && <ErrorBlock
          title='오류가 발생했습니다.'
          message={
            error.info?.message ||
            '글 생성에 실패했습니다.'
          }
        />
      }
    </Modal>
  )
}

export default NewArticle;