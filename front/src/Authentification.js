import React, { useState } from 'react';

function Authentification() {
    // States, états, données
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
    const [showCreateAccountSuccess, setShowCreateAccountSuccess] = useState(false);

    // Comportements, Fonctions
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleNomChange = (event) => {
        setNom(event.target.value);
    };

    const handlePrenomChange = (event) => {
        setPrenom(event.target.value);
    };

    const handleShowCreateAccountForm = () => {
        setShowCreateAccountForm(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setNom("");
        setPrenom("");
    };

    const handleCancelCreateAccountForm = () => {
        setShowCreateAccountForm(false);
    };

    const handleCreateAccount = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }
        try {
            const response = await fetch("http://localhost:3030/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prenom,
                    nom,
                    email,
                    password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data); // affiche la réponse du serveur
                // réinitialiser les champs de formulaire
                setNom("");
                setPrenom("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                // afficher un message de succès
                setShowCreateAccountSuccess(true);
                setShowCreateAccountForm(false);
            } else {
                const errorData = await response.json();
                alert("Erreur: " + errorData.message);
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la communication avec le serveur, Merci de rafraîchir la page ou de réessayer ultérieurement");

        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch("http://localhost:3030/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('userId', data.user.id);  //stocker des info cherchées depuis le BACK
            localStorage.setItem("token", data.token);  //stocker des info cherchées depuis le BACK
      
            console.log(localStorage.getItem('userId')); // test
            console.log(localStorage.getItem('token')); // test
      
            // Rajouter une latence de 2 secondes avant de rediriger vers la page d'authentification
            window.location.href = "/authenticated";
          } else {
            const errorData = await response.json();
            alert(errorData.message);
          }
        } catch (error) {
          console.error(error);
          alert("Erreur lors de la communication avec le serveur");
        }
      };
      

    // RENDERING
    return (
        <div>
            {showCreateAccountForm ? (
                <form onSubmit={handleCreateAccount}>
                    <label>
                        Nom:
                        <input
                            type="text"
                            value={nom}
                            onChange={handleNomChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Prénom:
                        <input
                            type="text"
                            value={prenom}
                            onChange={handlePrenomChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Mot de passe:
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Confirmation de mot de passe:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit">Créer un compte</button>
                    <button type="button" onClick={handleCancelCreateAccountForm}>
                        Annuler
                    </button>
                </form>
            ) : (
                <div>
                    {showCreateAccountSuccess ? (
                        <div>
                            <p>Compte créé avec succès !</p>
                            <button onClick={() => {
                                setShowCreateAccountSuccess(false);
                                setShowCreateAccountForm(false);
                            }}>OK</button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                            </label>
                            <br />
                            <label>
                                Mot de passe:
                                <input
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </label>
                            <br />
                            <button type="submit">Se connecter</button>
                            <button type="button" onClick={handleShowCreateAccountForm}>
                                Pas encore de compte, qu'attendez-vous!!
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default Authentification;
