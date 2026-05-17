import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './logo.css';
import { initI18n } from './i18n.js';

createRoot(document.getElementById('root')).render(<App />);
initI18n();
