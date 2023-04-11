import React from 'react';
import './header.css'
import { Link } from 'react-router-dom'
import logo from '../../media/cyclotrack.png'
import velib from '../../media/velib.png'

export default function header() {
    return (
        <header>
            <div className="content">
                <Link to="/" className="logo">
                    <img src={logo} alt="Logo CycloTrack" />
                    <h1>CycloTrack</h1>
                </Link>

                <p className="dev-info">Développé par Codex Hive</p>
                <div className="buttons">
                    <Link to="/authentification" className="login-btn">
                        Connexion
                    </Link>
                </div>
                <div className="velib-metropole">
                    <a href="https://www.velib-metropole.fr/" target="_blank" rel="noopener noreferrer">
                        <img src={velib} alt="Logo Velib" className="velib-logo" />
                    </a>
                </div>
            </div>
        </header>


    )
}
