import React from 'react';
import { Link } from 'react-router-dom';

function Error401() {
  return (
    <div>
      <h1>Error 401: Unauthorized</h1>
      <p>Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez vous connecter pour continuer.</p>
      <Link to="/authentification">Log in</Link>
    </div>
  );
}

export default Error401;
