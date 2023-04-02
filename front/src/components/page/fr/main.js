import React from 'react';
import './main.css';
import { useState } from 'react';
import imageAppWeb from '../../media/imageAppWeb.jpg';
import {Link} from 'react-router-dom';

export default function Main() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <main>
            <div className='content'>
                <div className='home'>
                    <button className='btn-accueil'>Accueil</button>
                    <Link to="/app" className='btn-tester'>
                        Tester CycloTrack
                    </Link>
                </div>
                <div className='description'>
                    <h2>La description</h2>
                    <p>
                        CycloTrack est une application web développée par {' '}
                        <strong>CodeX Hive</strong> qui facilite la recherche de vélos en
                        libre-service dans la région Île-de-France. Avec une interface simple
                        et intuitive, CycloTrack offre une solution pratique et écologique
                        pour les déplacements urbains rapides.
                    </p>
                    <br />
                    <p>
                        Notre application permet aux utilisateurs de consulter en temps réel
                        les stations de vélos en libre-service disponibles à Paris et ses
                        alentours, de rechercher la station la plus proche de leur adresse et
                        d'obtenir un itinéraire clair pour s'y rendre. Les données sont
                        obtenues à partir de l'API publique Vélib pour garantir l'exactitude
                        des informations, permettant aux utilisateurs de planifier leur
                        voyage en toute confiance et de s'assurer de la disponibilité du vélo
                        souhaité lors de leur arrivée à la station.
                    </p>
                    <h2>Comment ça marche ?</h2>
                    <p>
                        CycloTrack utilise l'API publique Vélib pour afficher en temps réel
                        les stations de vélos en libre-service disponibles à Paris et ses
                        alentours. Les utilisateurs peuvent rechercher la station la plus
                        proche de leur adresse en saisissant une adresse et obtenir un
                        itinéraire clair pour s'y rendre. En plus de cela, notre application
                        offre la possibilité de filtrer les stations qui possèdent des vélos
                        électriques ou des vélos mécaniques. CycloTrack est facile à utiliser
                        et permet aux utilisateurs de planifier leur voyage en toute
                        confiance et de s'assurer de la disponibilité du vélo souhaité lors
                        de leur arrivée à la station.
                    </p>
                    <Link to="/app" className='my-image-container'>
                        <img src={imageAppWeb} alt='Application Web' className='my-image'/>
                    </Link>
                    <h3 className='tester'>
                        Testez notre application web en cliquant sur l'image !
                    </h3>
                </div>
            </div>
                <form onSubmit={handleSubmit}>
                    <h2 className='contact-title'>Contactez-nous :</h2>
                    <label htmlFor='name'>Nom</label>
                    <input type='text' id='name' name='name' placeholder='Votre nom...' value={name} onChange={(e) => setName(e.target.value)} />
                    <label htmlFor='email'>E-mail</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='Votre e-mail... (ex: votre-email@gmail.com)'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor='message'>Message</label>
                    <textarea
                        id='message'
                        name='message'
                        placeholder='Votre message...'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    <button type='submit'>Envoyer</button>
                </form>
        </main>
    );
}

