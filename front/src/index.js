import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import './styleSite.css';
import AccueilFR from './AccueilFR';
import AccueilEN from './AccueilEN';
import App from './App';
import Erreur from './Erreur';
import Authentification from './Authentification';
import Authenticated from './Authenticated';
import PrivateRoutes from './PrivateRoutes';
import Error401 from './Error401'

const root = ReactDOM.createRoot(document.getElementById('root'));

function AppRoutes() {

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccueilFR />} />
        <Route path="/en" element={<AccueilEN />} />
        <Route path="/authentification" element={<Authentification/>} />

        <Route path="/error401" element={<Error401 />} />
        <Route element={<PrivateRoutes />}>
          <Route element={<Authenticated />} path="/authenticated"  exact />
          <Route element={<App />} path="/app" exact />

        </Route>


        
        <Route path="*" element={<Erreur />} />
      </Routes>
    </Router>
  );
}





root.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
);