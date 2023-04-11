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
        <Link to="/authentification"><button>Log in</button></Link>
      </form>
      </main>
      <Footer />
    </div>
  );
}

export default Error401;
