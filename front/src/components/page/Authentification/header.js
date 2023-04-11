import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import logo from '../../media/cyclotrack.png';
import usericon from '../../media/iconuser.webp';

export default function header() {
    return (
            <header>
                <div className='content'>
                    <Link to='/' className='logo'>
                        <img src={logo} alt='Logo CycloTrack' />
                        <h1>CycloTrack</h1>
                    </Link>
                    <div className="account-button">
                        <Link to='/authenticated'>
                            <span>Mon compte</span>
                            <img src={usericon} alt="Icon user" />
                        </Link>
                    </div>
                </div>
            </header>

    )
}