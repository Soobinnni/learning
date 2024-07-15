import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';

import { createNewEvent, queryClient } from '../../util/http.js'
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  const {
    mutate,
    isPending,
    isError,
    error
  } = useMutation({
    // mutationKey를 설정할 수 있으나, 응답 데이터 캐시를 처리하지 않으므로 반드시 필요하지 않다.
    mutationFn: createNewEvent,
    onSuccess: () => {
      /**이전에 가져온 데이터가 만료됐다고 표시하고 다시 가져오도록 트리거.
          => 리액트 쿼리에서 제공하는 메소드를 이용해 하나 이상의 쿼리를 무효화 
          => key가 완벽하게 일치하지 않아도, 배열에 포함되어 있다면 해당하는 쿼리를 모두 무효화
          => 정확한 일치를 위한 옵션은 exact:true
          */
      queryClient.invalidateQueries({
        queryKey: ['events'] /*, exact: true */
      });
      navigate('/events');
    }
  });
  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {
          isPending && 'Submitting...'
        }
        {
          !isPending && <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        }
      </EventForm>
      {
        isError && <ErrorBlock
          title='Failed to create event'
          message={
            error.info?.message ||
            'Failed to create event. Please check your inputs and try again later.'
          }
        />
      }
    </Modal>
  );
}
