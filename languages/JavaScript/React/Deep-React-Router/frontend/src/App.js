import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';

import RootLayout from './pages/Root.js';
import EventRootLayout from './pages/EventRoot.js';

import ErrorPage from './pages/Error.js';

import HomePage from './pages/Home.js';
import EventsPage, { loader as eventLoader } from './pages/Events.js';
import EventDetailPage, { loader as eventDetailLoader } from './pages/EventsDetail.js';
import NewEventPage from './pages/NewEvent.js';
import EditEventPage from './pages/EditEvent.js';

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
                },
                {
                  path: 'edit',
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