import React from 'react';
import ReactDOM from 'react-dom/client';
import './styleSite.css';
import AccueilFR from './AccueilFR';
import AccueilEN from './AccueilEN';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import App from './App';
import Erreur from './Erreur';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<AccueilFR />} />
        <Route path="/en" element={<AccueilEN />} />
        <Route path="/app" element={<App />} />
        <Route path="*" element={<Erreur />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
