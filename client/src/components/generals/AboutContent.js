import React from 'react'

const AboutContent = ()=>{
    return(
        <div className='aboutContent'>
            <h3>Demonstrative site by Daniel Csonka</h3>
            <p>This site is made with the purpose demonstrating the theoretical and 
                technical IT knowledges, capabilities of the creator.</p>
            <p>It is a dummy, typically MERN, REST-full web application, a full-stack 
                development of the latter mentinoed person with own content and idea. 
                The capabilities mainly cover simple CRUD, session-cookie managmement,
                basic password handling processes. Front-styling is made with the
                requirement of being resposible, minimally cross-browser tested and
                being resistent to older browser rendering errors that connot execute 
                grid or flex laying out. It is tested by manual and automated methods.</p>
            <p> All rigths reserved!</p>
            <p>Front technologies, technics, standards:</p>
            <ul>
                <li>JavaScript React Framework</li>
                <li>JacaScript Core Fetch API</li>
                <li>Unique CSS definitions and Google Icons</li>
                <li>JavaScript Jest test framework</li>
            </ul>
            <p>Back-end technologies, technics, standards:</p>
            <ul>
                <li>JavaScript Node Runtime Environment</li>
                <li>Express JS Framework</li>
                <li>Several JavaScript utility libraries</li>
                <li>Free Heroku and MongoDB Cloud services</li>
                <li>JavaScript Mocha-Chai test framework and library</li>
            </ul>
        </div>
    )
}

export default AboutContent