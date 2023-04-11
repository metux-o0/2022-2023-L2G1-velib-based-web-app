import React from 'react';
import { Link } from 'react-router-dom';
import Header from './header';
import Footer from '../fr/footer'

function Error401() {
  return (
    <div>
      <Header />
      <main>
      <form>
        <h1>Error 401: Unauthorized</h1>
        <p>Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez vous connecter pour continuer.</p>
        <button><Link to="/authentification">Log in</Link></button>
      </form>
      </main>
      <Footer />
    </div>
  );
}

export default Error401;
