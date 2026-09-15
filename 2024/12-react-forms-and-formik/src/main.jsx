import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import EventBubbling from './EventBubbling.jsx';
import MyForm from './MyForm.jsx';
import FormikForm from './FormikForm.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EventBubbling />

    <MyForm />

    <FormikForm />
  </StrictMode>,
)
