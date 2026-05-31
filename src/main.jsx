import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './logo.css';
import { seedDemoData } from './demoDataSeed.js';
import { initI18n } from './i18n.js';
import { initLogoRuntimeSvg } from './logoRuntimeSvg.js';
import { initDemoUiRuntime } from './demoUiRuntime.js';
import { initAiInvoiceRuntime } from './aiInvoiceRuntime.js';

seedDemoData();
createRoot(document.getElementById('root')).render(<App />);
initI18n();
initLogoRuntimeSvg();
initDemoUiRuntime();
initAiInvoiceRuntime();
