import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';

import RootLayout from './pages/Root.js';
import EventRootLayout from './pages/EventRoot.js';

import HomePage from './pages/Home.js';
import EventsPage from './pages/Events.js';
import EventDetailPage from './pages/EventsDetail.js';
import NewEventPage from './pages/NewEvent.js';
import EditEventPage from './pages/EditEvent.js';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
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
            },
            {
              path: ':eventId',
              element: <EventDetailPage />,
            },
            {
              path: 'new',
              element: <NewEventPage />,
            },
            {
              path: ':eventId/edit',
              element: <EditEventPage />,
            },
          ]
        },
      ]
    },
  ])
  return <RouterProvider router={router} />;
}

export default App;