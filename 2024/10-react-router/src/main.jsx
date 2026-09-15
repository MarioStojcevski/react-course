import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ErrorPage from './error-page';
import Contact, { contactLoader } from './pages/contact';
import HomePage, { action, loader } from './pages/homepage';
import './index.css';
import EditContact, { saveContact } from './pages/edit-contact';
import { destroyAction } from './pages/destroy';
import Index from './pages';

const myRoutes = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
    loader,
    action,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: '/contacts/:id',
        element: <Contact />,
        loader: contactLoader
      },
      {
        path: 'contacts/:id/edit',
        element: <EditContact />,
        loader: contactLoader,
        action: saveContact,
      },
      {
        path: 'contacts/:id/destroy',
        action: destroyAction,
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={myRoutes} />
  </StrictMode>,
)
