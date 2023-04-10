import React from 'react';
import Header from './components/page/fr/header';
import Footer from './components/page/fr/footer';
import { useState, useEffect } from 'react';

function Authenticated() {
    const [user, setUser] = useState(null);

    // const handleLogout = async () => {
    //     try {
    //         const response = await fetch("http://localhost:3030/users/logout", {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": "bearer " + localStorage.getItem("token"),
    //             },
    //         });
    //         if (response.ok) {
    //             localStorage.removeItem("token");
    //             localStorage.removeItem("userId");
    //             alert("Déconnexion avec succès, vous serez redirigé vers la page de connexion");
    //             window.location.href = "/authentification";
    //         } else {
    //             const errorData = await response.json();
    //             alert(errorData.message);
    //         }
    //     } catch (error) {
    //         //console.error(error);
    //         alert("Erreur lors de la communication avec le serveur");
    //     }
    // };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.');
        if (confirmDelete) {
            const userId = localStorage.getItem('userId');
            //console.log(userId)
            try {
                const response = await fetch(`http://localhost:3030/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": "bearer " + localStorage.getItem("token"),
                    },
                });
                if (response.ok) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    alert('Votre compte a été supprimé avec succès.');
                    window.location.href = '/authentification';
                } else {
                    const errorData = await response.json();
                    alert(errorData.message);
                }
            } catch (error) {
                //console.error(error);
                alert('Erreur lors de la communication avec le serveur');
            }
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:3030/users/me", {
                    headers: {
                        "Authorization": "bearer " + localStorage.getItem("token"),
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    const errorData = await response.json();
                    alert(errorData.message);
                }
            } catch (error) {
                console.error(error);
                alert("Erreur lors de la communication avec le serveur");
            }
        };
        fetchUserData();
    }, []);

    const handleEditProfile = () => {
        // Rediriger vers la page de modification du profil
        window.location.href = '/modifier-profil';
    };

    return (
        <div>
            <Header />



            <main>
                <h1>Connexion réussie!</h1>
                {user && (
                    <div>
                        <h2>Bienvenue {user.nom} {user.prenom} sur votre compte.</h2>
                        <p>Historique d'adresses saisies précédement: </p>
                        <br></br>
                        <ul>
                            {user.adresses.map((adresse, index) => (
                                <li key={index}>{adresse}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {user && (
                    <div>
                        <h2>Mes informations</h2>
                        <p>Nom : {user.nom}</p>
                        <p>Prénom : {user.prenom}</p>
                        <p>Email : {user.email}</p>
                        <p>Mot de passe : {user.password.length > 10 ? user.password.slice(0, 10).replace(/./g, '•') : user.password.replace(/./g, '•')}</p>
                        <br></br>
                        <button className='btn-tester' onClick={handleEditProfile}>Modifier mon profil</button>
                    </div>
                )}
                <br></br>
                <button className='btn-tester' onClick={handleDeleteAccount}>Supprimer mon compte</button>
            </main>



            <Footer />
        </div>
    );
}

export default Authenticated;
