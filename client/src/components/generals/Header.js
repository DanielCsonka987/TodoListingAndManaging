import React from 'react'

function Header(props){
    return(
        <>
            <header className='appHeader1 blackBackgr logo'>
                <h1>ActivityLister<span className='regSymbol'>&reg;</span>
                </h1>
            </header>
            <div className='appHeader2 blackBackgr siteMessage '>
                <h2>Web aplication that helps you to be strict!</h2>
            </div>
        </>
    )
    
}

export default Header