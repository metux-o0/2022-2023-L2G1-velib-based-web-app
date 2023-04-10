import React, { useState, useEffect } from 'react'
import './footer.css'

export default function Footer() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:3030/users/me', {
                        headers: {
                            "Authorization": "bearer " + token,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchUserData();
    }, []);

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
                localStorage.removeItem("userId");
                alert("Déconnexion avec succès, vous serez redirigé vers la page de connexion");
                window.location.href = "/authentification";
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            //console.error(error);
            alert("Erreur lors de la communication avec le serveur");
        }
    };

    return (
        <footer>
            <div className='content'>
                {userData &&
                    <>
                        <p>Vous êtes connecté(e) sous le nom "{userData.nom} {userData.prenom}"</p>
                        <button className='btn-auth' onClick={handleLogout}>Se déconnecter</button>
                    </>
                }
                <p>&copy; 2023 CycloTrack tous droits réservés.</p>
            </div>
        </footer>
    )
}