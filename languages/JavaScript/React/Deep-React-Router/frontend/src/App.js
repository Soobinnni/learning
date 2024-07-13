import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';

import RootLayout from './pages/Root.js';
import EventRootLayout from './pages/EventRoot.js';

import ErrorPage from './pages/Error.js';

import HomePage from './pages/Home.js';
import EventsPage, { loader as eventLoader } from './pages/Events.js';
import EventDetailPage, { loader as eventDetailLoader, action as deleteEventAction } from './pages/EventsDetail.js';
import NewEventPage from './pages/NewEvent.js';
import EditEventPage from './pages/EditEvent.js';
import {action as manipulateEventAction} from './components/EventForm.js';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'events',
          element: <EventRootLayout />,
          children: [
            {
              index: true,
              element: <EventsPage />,
              loader: eventLoader
            },
            {
              path: 'new',
              action: manipulateEventAction,
              element: <NewEventPage />,
            },
            {
              path: ':eventId',
              id: 'event-detail',
              loader: eventDetailLoader,
              children: [
                {
                  index: true,
                  element: <EventDetailPage />,
                  action: deleteEventAction
                },
                {
                  path: 'edit',
                  action: manipulateEventAction,
                  element: <EditEventPage />,
                },
              ]
            },
          ]
        },
      ]
    },
  ])
  return <RouterProvider router={router} />;
}

export default App;