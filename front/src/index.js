import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import './styleSite.css';
import AccueilFR from './AccueilFR';
import App from './components/page/Map/App';
import Erreur from './Erreur';
import Authentification from './components/page/Authentification/Authentification';
import Authenticated from './components/page/Authenticated/Authenticated';
import PrivateRoutes from './PrivateRoutes';
import Error401 from './components/page/Error401/Error401';
import Help from './components/page/Map/Help/Help';

const root = ReactDOM.createRoot(document.getElementById('root'));

function AppRoutes() {

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccueilFR />} />
        <Route path="/authentification" element={<Authentification/>} />

        <Route path="/error401" element={<Error401 />} />
        <Route element={<PrivateRoutes />}>
          <Route element={<Authenticated />} path="/authenticated"  exact />
          <Route element={<App />} path="/app" exact />
          <Route element={<Help />} path="/help" exact />

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