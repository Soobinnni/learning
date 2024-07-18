import { Link, redirect, useNavigate, useParams, useSubmit, useNavigation } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { /*useMutation,*/ useQuery } from '@tanstack/react-query';
import { queryClient, fetchEvent, updateEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  /**
   * loaderData로 fetchQuery의 데이터를 가져오지만, useQuery는 유지하는 것이 좋다.
   *  (이미 캐시된 상태이므로 useLoaderData를 호출할 필요 없음)
   * 왜냐하면 fetchQuery의 결과 역시 캐시되고 이를 useQuery가 다시 실행되면
   * 캐시된 결과를 가져오는 캐싱 메커니즘이 그대로 적용되기 때문이다.
   * 또한, 창을 나갔다가 다시 들어오는 백그라운드 트리거의 효과도 필요하기 때문에 유지한다.
   * 
   * 대신, 미리 데이터를 로드하므로 pending상태에 관한 내용은 삭제한다.
   * 또한 error상태를 load함수가 다루므로 error상태 관리 내용도 삭제할 수 있다.
   */
  const navigate = useNavigate();
  const { id } = useParams();


  // query
  const {
    data, isError, error
  } = useQuery({
    queryKey: ['events', { id }],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),

    // React Router와 Tanstack Query의 쿼리 중복 요청을 방지
    // 캐시된 데이터가 10초 미만인 경우 내부적으로 다시 가져오지 않는다.
    staleTime: 10000
  });

  /* mutation
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
    */

  const submit = useSubmit();
  const {state} = useNavigation();
  function handleSubmit(formData) {
    submit(formData, { method: 'PUT' });
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

export function loader({ params }) {
  const { id } = params;
  return queryClient.fetchQuery({
    queryKey: ['events', { id }],
    queryFn: ({ signal }) => fetchEvent({ signal, id })
  });
}

export async function action({ request, params }) {
  /**
   * 대신 낙관적 업데이트를 수행하지 못하게 됨.
   * 실행하기 위해선 submit메소드에서 자체 로직을 작성해야만 함.
   */
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);

  const { id } = params;

  await updateEvent({ id, event: updatedEventData });

  // 이후 queryClient로 해당 mutation과 관련된 query를 무효화, 다시 가져오도록 한다.
  await queryClient.invalidateQueries(['events', { id }]);

  return redirect('../')
}