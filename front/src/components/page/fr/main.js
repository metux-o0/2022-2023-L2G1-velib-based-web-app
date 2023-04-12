import React, { useState } from 'react';
import './main.css';
import imageAppWeb from '../../media/imageAppWeb.jpg';
import { Link } from 'react-router-dom';

export default function Main() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();


        if (!email || !message || !name) {
            alert('Veuillez remplir tous les champs requis.');
            return;
        }

        const form = event.target;
        const formData = new FormData(form);

        fetch('https://formspree.io/f/xbjezbea', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Votre message a été envoyé avec succès.');
                    setName('');
                    setEmail('');
                    setMessage('');
                    console.log(response);
                } else {
                    throw new Error('Une erreur est survenue lors de l\'envoi de votre message.');
                }
            })
            .catch((error) => {
                alert('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.');
                console.error(error);
            });
    };

    return (
        <main>
            <div className='content'>
                <div className='home'>
                    <button className='btn-accueil'>Accueil</button>
                    <Link to='/app' className='btn-tester'>
                        Tester CycloTrack
                    </Link>
                </div>
                <div className='description'>
                    <h2>La description</h2>
                    <section id="velib">
                        <h3>Qu'est-ce que Vélib ?</h3>
                        <br></br>
                        <p>Vélib est un système de vélos en libre-service développé par la ville de Paris en 2007. Il permet aux utilisateurs de louer un vélo pour un trajet d'une durée maximale de 30 minutes pour les vélos électriques et 1 heure pour les vélos mécaniques, avant de le restituer à une station Vélib proche. Depuis son lancement, Vélib est devenu un moyen de transport populaire pour les habitants et les touristes de Paris, offrant une solution pratique, économique et écologique pour les déplacements urbains.</p>
                        <p>Aujourd'hui, le service Vélib est disponible dans toute la région Île-de-France, avec des milliers de vélos disponibles à des centaines de stations dans toute la ville. Le service est accessible 24 heures sur 24 et 7 jours sur 7, offrant une flexibilité maximale pour les utilisateurs.</p>
                    </section>

                    <section id="cyclotrack">
                        <h3>Qu'est-ce que CycloTrack ?</h3>
                        <br></br>
                        <p>CycloTrack est une application web développée par <strong>CodeX Hive</strong> qui facilite la recherche de vélos en libre-service dans la région Île-de-France. Avec une interface simple et intuitive, CycloTrack offre une solution pratique et écologique pour les déplacements urbains rapides.</p>
                        <p>Notre application permet aux utilisateurs de consulter en temps réel les stations de vélos en libre-service disponibles à Paris et ses alentours, de rechercher la station la plus proche de leur adresse et d'obtenir un itinéraire clair pour s'y rendre. Les données sont obtenues à partir de l'API publique Vélib pour garantir l'exactitude des informations, permettant aux utilisateurs de planifier leur voyage en toute confiance et de s'assurer de la disponibilité du vélo souhaité lors de leur arrivée à la station.</p>
                        <p>CycloTrack est facile à utiliser, pratique et écologique, offrant une solution idéale pour les utilisateurs de Vélib qui souhaitent trouver rapidement une station de vélos en libre-service et planifier leur itinéraire en toute confiance.</p>
                    </section>

                    <h2>Comment ça marche ?</h2>
                    <div>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/VvBwd6QCmSM" title="Vidéo de présentation de CycloTrack" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <h2>Notre application</h2>

                    <Link to='/app' className='my-image-container'>
                        <img src={imageAppWeb} alt='Application Web' className='my-image' />
                    </Link>
                    <h3 className='tester'>
                        Testez notre application web en cliquant sur l'image
                    </h3>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <h2 className='contact-title'>Contactez-nous :</h2>
                <label htmlFor='name'>Nom</label>
                <input type='text' id='name' name='name' placeholder='Votre nom...' value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor='email'>E-mail</label>
                <input type='email' id='email' name='email' placeholder='Votre e-mail... (ex: votre-email@gmail.com)' value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor='message'>Message</label>
                <textarea id='message' name='message' placeholder='Votre message...' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                <button type='submit'>Envoyer</button>
            </form>
        </main>
    );
}