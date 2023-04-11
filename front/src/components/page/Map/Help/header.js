import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import logo from '../../../media/cyclotrack.png';

export default function header() {
    return (
            <header>
                <div className='content'>
                    <Link to='/' className='logo'>
                        <img src={logo} alt='Logo CycloTrack' />
                        <h1>CycloTrack</h1>
                    </Link>
                    <div className="account-button">
                        <Link to='/app'>
                            <span>Retourner sur CycloTrack</span>
                        </Link>
                    </div>
                </div>
            </header>

    )
}