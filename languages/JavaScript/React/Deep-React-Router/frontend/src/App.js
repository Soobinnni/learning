import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import EditEventPage from './pages/EditEvent';
import ErrorPage from './pages/Error';
import EventsDetailPage, {
  loader as eventDetailLoader,
  action as deleteEventAction,
} from './pages/EventsDetail';
import EventsPage, { loader as eventsLoader } from './pages/Events';
import EventRootLayout from './pages/EventRoot';
import HomePage from './pages/Home';
import NewEventPage from './pages/NewEvent';
import RootLayout from './pages/Root';
import NewsletterPage, { action as newsletterAction } from './pages/Newsletter';
import AuthenticationPage, { action as authAction } from './pages/Authentication';

import { action as manipulateEventAction } from './components/EventForm';
import { action as logoutAction } from './pages/Logout';
import { tokenLoader, checkAuthLoader } from './util/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'events',
        element: <EventRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
          },
          {
            path: ':eventId',
            id: 'event-detail',
            loader: eventDetailLoader,
            children: [
              {
                index: true,
                element: <EventsDetailPage />,
                action: deleteEventAction,
              },
              {
                path: 'edit',
                element: <EditEventPage />,
                action: manipulateEventAction,
                loader: checkAuthLoader
              },
            ],
          },
          {
            path: 'new',
            element: <NewEventPage />,
            action: manipulateEventAction,
            loader: checkAuthLoader
          },
        ],
      },
      {
        path: 'newsletter',
        element: <NewsletterPage />,
        action: newsletterAction,
      },
      {
        path: 'auth',
        element: <AuthenticationPage />,
        action: authAction
      },
      {
        path: 'logout',
        action: logoutAction
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;