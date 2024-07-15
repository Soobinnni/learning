import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, deleteEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {
  const { id } = useParams();

  // query
  const {
    data,
    isPending: isSelectPending,
    isError: isSelectError,
    error: selectError
  } = useQuery({
    queryKey: ['events', { id }],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  // mutation
  const navigate = useNavigate();
  const {
    mutate,
    isPending: isDeletePending,
    isError: isDeleteError,
    error: deleteError
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {

      /* 404가 일어나는 코드
        queryClient.invalidateQueries({
          queryKey: ['events']
        })

        해결 1.
        queryClient.invalidateQueries({
          queryKey: ['events'],
          exact: true
        })
        
        해결 2.
        queryClient.invalidateQueries({
          queryKey: ['events'],
          refetchType: 'none'
        })


        해결 3.
        queryClient.removeQueries({
          queryKey: ['events', { id }],
          exact: true
        })
        queryClient.invalidateQueries({
          queryKey: ['events']
        })        
      */
      // 해결 4.
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchcType: 'none'
      });
      navigate('/events');
    }
  });
  function handleDelete(event) {
    event.preventDefault();
    mutate({ id });
  }

  // setting content
  let content;

  if (isSelectPending) {
    content = <div id="event-details-content" className="center">
      <p>Fetching event data...</p>
    </div>
  }
  if (isSelectError) {
    content = <ErrorBlock
      title='Failed to load fetch event.'
      message={selectError.info?.message || 'Failed to fetch event data, please try again later.'}
    />
  }
  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    content = <>
      <header>
        <h1>{data.title}</h1>
        <nav>
          <button onClick={handleDelete}>Delete</button>
          <Link to={`${data.id}/edit`}>Edit</Link>
        </nav>
      </header>
      <div id="event-details-content">
        <img src={`http://localhost:3000/${data.image}`} alt={data.description} />
        <div id="event-details-info">
          <div>
            <p id="event-details-location">{data.location}</p>
            <time dateTime={`Todo-DateT$Todo-Time`}>
              {formattedDate} @ {data.time}
            </time>
          </div>
          <p id="event-details-description">{data.description}</p>
        </div>
      </div>
    </>

  }
  if (isDeletePending) {
    content = <div id="event-details-content" className="center">
      <p>Delete event data...</p>
    </div>
  }
  if (isDeleteError) {
    content = <ErrorBlock
      title='Failed to load delete event.'
      message={deleteError.info?.message || 'Failed to delete event data, please try again later.'}
    />
  }
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
    </>
  );
}
