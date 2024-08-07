import {
  Form,
  useNavigate,
  useNavigation,
  useActionData,
  json,
  redirect
} from 'react-router-dom';

import classes from './EventForm.module.css';
import { getAuthToken } from '../util/auth';

function EventForm({ method, event }) {
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  function cancelHandler() {
    navigate('..');
  }

  return (
    <Form
      className={classes.form}
      method={method}
    >
      {data && data.errors && <ul>
        {
          Object.values(data.errors).map(error => <li key={error}>
            {error}
          </li>)
        }
      </ul>}
      <p>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          defaultValue={event ? event.title : ''}
        />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="url"
          name="image"
          required
          defaultValue={event ? event.image : ''}
        />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          required
          defaultValue={event ? event.date : ''}
        />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          required
          defaultValue={event ? event.description : ''}
        />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button disabled={isSubmitting}>{
          isSubmitting ? 'Submitting...' : 'Save'
        }</button>
      </div>
    </Form>
  );
}

export default EventForm;

export const action = async ({ request, params }) => {
  const method = request.method;
  const data = await request.formData();

  const eventData = {
    title: data.get('title'),
    image: data.get('image'),
    date: data.get('date'),
    description: data.get('description'),
  }

  let url = 'http://localhost:8080/events';
  if (method === 'PATCH') {
    url += ('/' + params.eventId);
  }

  const token = getAuthToken();
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(eventData)
  });

  if (response.status === 422 || response.status === 401) { // backend 유효하지 않은 데이터 상태 반환
    return response;
  }

  if (!response.ok) {
    throw json({ message: 'Could not save event.' }, { status: 500 })
  }

  return redirect('/events');
}