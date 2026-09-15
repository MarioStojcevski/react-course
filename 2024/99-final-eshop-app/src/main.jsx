import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

import routes from './routes.jsx';
import App from './App.jsx';
import './index.css';
import NavBar from './components/NavBar.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes}>
      <NavBar />

      <App />
      
    </RouterProvider>
  </StrictMode>
);
