import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import 'virtual:nexa-styles.css';
import App from 'virtual:nexa-app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
