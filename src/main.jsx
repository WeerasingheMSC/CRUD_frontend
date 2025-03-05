import React,{ StrictMode } from 'react';
import ReactDom from "react-dom/client"
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRoutes from './routs/CRUDRou';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoutes/>
  </React.StrictMode>,
)
