import React from 'react';
import './header.css'
import { Link } from 'react-router-dom'
import logo from '../../media/cyclotrack.png'
import velib from '../../media/velib.png'

export default function header() {
    return (
        <header>
            <div className='content'>
                <div className="logo">
                    <img src={logo} alt="Logo CycloTrack"></img>
                    <h1>CycloTrack</h1>
                </div>
                <p className="dev-info">Développé par Codex Hive</p>
                <div className="buttons">
                    <Link to="/" className="language-btn">FR</Link>
                </div>
                <Link to="https://www.velib-metropole.fr/" target="_blank" className='velib-metropole'>
                    <img src={velib} alt="Logo Velib" className="velib-logo"></img>
                </Link>
            </div>
        </header>
    )
}
