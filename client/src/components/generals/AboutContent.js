import React from 'react'

const AboutContent = ()=>{
    return(
        <aside className='aboutContent'>
            <h3>Demonstrative site by Daniel Csonka</h3>
            <p>This site is made with the purpose demonstrating the theoretical and 
                technical IT knowledges, capabilities of the creator.</p>
            <p>The main role of this app is to maintain the activity list of a previously 
                registered and logged in person. The registration not requires real personal 
                datas - suggested the usage of dummy details for manual testing. For simplier 
                usage, it shows the registered users of the system by a unique username. After 
                registration and/or login it is recording the activity, its priority, some notation, 
                present the date of creation, last update of that. It can manage some details of 
                the account - password change or delet the account.
                </p>
            <p>It is a typically MERN, REST-full web application, a full-stack 
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
                <li>JavaScript Jest test framework and Testing Library</li>
            </ul>
            <p>Back-end technologies, technics, standards:</p>
            <ul>
                <li>JavaScript Node Runtime Environment</li>
                <li>Express JS Framework</li>
                <li>Several JavaScript utility libraries</li>
                <li>Free Heroku and MongoDB Cloud services</li>
                <li>JavaScript Mocha-Chai test framework and library</li>
            </ul>
        </aside>
    )
}

export default AboutContent