import React from 'react'
import '../styles/pages/landing.css'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import logoImg from '../images/logo-dark.svg'

function Landing() {
    return (
        <div id="page-landing">
        <div className="content-wrapper">
            <img src={ logoImg } alt=""/>

            <main>
                <h1>Leve felicidade para o mundo</h1>
                <p>Visite orfanatos e mude o dia de crianças.</p>
            </main>

            <div className="location">
                <strong>Londrina</strong>    
                <span>Paraná</span>
            </div>

            <Link to="/app" className="enter-app">
                    <FiArrowRight size={32} />
            </Link>
        </div>
    </div>
    )
}

export default Landing