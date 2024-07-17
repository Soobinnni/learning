import { Link, useNavigate, useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, fetchEvent, updateEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  /**
   * Update에서 낙관적 업데이트 하기.
   * - 백그라운드에서 쿼리 무효화 및 활성 쿼리 재요청과 무관하게,
   *   수정 내용을 UI에만 바로 반영하여 낙관적 업데이트를 한다.
   * - 역시 마찬가지로, 실패하더라도 낙관적 업데이트 후 롤백한다.
   * 
   */


  const navigate = useNavigate();
  const { id } = useParams();

  // query
  const {
    data, state, isError, error
  } = useQuery({
    queryKey: ['events', { id }],
    queryFn: ({ signal }) => fetchEvent({ signal, id })
  });

  // mutation
  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;

      // 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['events', { id }] });

      // 롤백을 위한 데이터
      const prevEvent = queryClient.getQueryData(['events', { id }]);
      // 캐시 조작
      queryClient.setQueryData(['events', { id }], newEvent);

      return { prevEvent }
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(['events', { id }], context.prevEvent);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['events', { id }]);
    }
  })

  function handleSubmit(formData) {
    // onSuccess를 여기서 다루지 않음.
    // isPending을 다룰 수 있는 여러 방법
    mutate({ id, event: formData });
    navigate('../');
  }

  function handleClose() {
    navigate('../');
  }


  let content;

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            'Failed to load event. Please check your inputs and try again later.'
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? (
          <p>Sending data...</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;

}
