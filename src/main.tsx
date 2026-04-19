import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/app-discovery'; // 🧿 ABSOLUTE APEX: Trigger side-effect registration
import { getAllApps } from './lib/app-registry';

// 🧿 APEX ROOT INITIALIZATION: Force registry discovery before React mounts
getAllApps();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
