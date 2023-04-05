import React from 'react';

function Authenticated() {
    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:3030/users/logout", {
                method: "POST",
                headers: {
                    "Authorization": "bearer " + localStorage.getItem("token"),
                },
            });
            if (response.ok) {
                localStorage.removeItem("token");
                alert("Déconnexion avec succès, vous serez redirigé vers la page de connexion");
                window.location.href = "/authentification";
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la communication avec le serveur");
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.');
        if (confirmDelete) {
            const userId = localStorage.getItem('userId');
            console.log(userId)
            try {
                const response = await fetch(`http://localhost:3030/users/${userId}`, {
                    method: 'DELETE',
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
                console.error(error);
                alert('Erreur lors de la communication avec le serveur');
            }
        }
    };


    return (
        <div>
            <h1>Connexion réussie!</h1>
            <p>Bienvenue sur votre compte.</p>
            <button onClick={handleLogout}>Se déconnecter</button>
            <button onClick={handleDeleteAccount}>Supprimer mon compte</button>
        </div>
    );
}

export default Authenticated;
