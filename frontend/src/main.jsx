import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initOffline } from './lib/offline';

// Modo offline: app sin internet + envía emergencias pendientes al volver la señal
initOffline();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);