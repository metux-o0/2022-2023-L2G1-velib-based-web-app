import React from 'react';
import Header from '../Authenticated/header';
import Footer from '../fr/footer';
import { useState, useEffect } from 'react';

function Authenticated() {
    const [user, setUser] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const [isProfileEditing, setIsProfileEditing] = useState(false);



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3030/users/me', {
                    headers: {
                        'Authorization': 'bearer ' + localStorage.getItem('token'),
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setEditedUser({
                        nom: data.nom,
                        prenom: data.prenom,
                        password: data.password,
                    });
                } else {
                    const errorData = await response.json();
                    alert(errorData.message);
                }
            } catch (error) {
                console.error(error);
                alert('Erreur lors de la communication avec le serveur');
            }
        };
        fetchUserData();
    }, []);

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

    const handleSaveEdit = async () => {
        // Enregistrer les modifications de l'utilisateur dans la base de données
        try {
            const response = await fetch(`http://localhost:3030/users/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(editedUser),
            });
            if (response.ok) {
                // Mettre à jour l'état avec les nouvelles informations de l'utilisateur
                const data = await response.json();
                setUser(data);
                alert('Votre profil a été modifié avec succès.');
                handleCancelEdit();
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la communication avec le serveur');
        }
    };

    const handleChange = (event) => {
        // Mettre à jour le state de editedUser modifié avec les nouvelles valeurs de l'input
        setEditedUser({ ...editedUser, [event.target.name]: event.target.value });
    };

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

    const handleClearHistory = async () => {
        const confirmClear = window.confirm('Êtes-vous sûr de vouloir effacer votre historique ?');
        if (confirmClear) {
          try {
            const response = await fetch(`http://localhost:3030/users/${user._id}/clearAddresses`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('token'),
              },
              body: JSON.stringify({ adresses: [] }),
            });
            if (response.ok) {
              setUser({ ...user, adresses: [] });
              alert('Votre historique a été effacé avec succès.');
            } else {
              const errorData = await response.json();
              alert(errorData.message);
            }
          } catch (error) {
            console.error(error);
            alert('Erreur lors de la communication avec le serveur');
          }
        }
      };
      

    const handleEditProfile = () => {
        setIsProfileEditing(true);
    };

    const handleCancelEdit = () => {
        setIsProfileEditing(false);
    };

    return (
        <div>
            <Header />

            <main>
                <h1 className='description'>Connexion réussie!</h1>
                {user && (
                    <div className='description'>
                        <h2>Bienvenue {user.nom} {user.prenom} sur votre compte.</h2>
                        <h3>Historique d'adresses saisies précédemment : </h3>
                        <br />
                        <ul>
                            {user.adresses.map((adresse, index) => (
                                <li key={index}>{adresse}</li>
                            ))}
                        </ul>
                        <button className='btn-tester' onClick={handleClearHistory}>Effacer l'historique</button>
                    </div>
                )}

                <br></br>

                {user && !isProfileEditing && (
                    <div className='description'>
                        <h2>Mes informations</h2>
                        <p>Nom : {user.nom}</p>
                        <p>Prénom : {user.prenom}</p>
                        <p>Email : {user.email}</p>
                        <p>Mot de passe : {user.password.length > 10 ? user.password.slice(0, 10).replace(/./g, '•') : user.password.replace(/./g, '•')}</p>
                        <br />
                        <button className='btn-tester' onClick={handleEditProfile}>Modifier mon profil</button>
                    </div>
                )}

                {isProfileEditing &&
                    (
                        <div>
                            <h1>Modification de profil</h1>
                            <p>Email : {user.email}</p>
                            <div>
                                <label htmlFor="nom">Nom :</label>
                                <input type="text" id="nom" name="nom" value={editedUser.nom || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="prenom">Prénom :</label>
                                <input type="text" id="prenom" name="prenom" value={editedUser.prenom || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="password">Mot de passe :</label>
                                <input type="password" id="password" name="password" value={editedUser.password || ''} onChange={handleChange} />
                            </div>
                            <button className='btn-tester' onClick={handleSaveEdit}>Enregistrer</button>
                            <button className='btn-tester' onClick={handleCancelEdit}>Annuler</button>
                        </div>
                    )}

                <br />
                <button className='btn-tester' onClick={handleDeleteAccount}>Supprimer mon compte</button>
            </main>

            <Footer />
        </div>
    );
}

export default Authenticated;