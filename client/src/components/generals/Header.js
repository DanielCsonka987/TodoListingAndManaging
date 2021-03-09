import React from 'react'

function Header(props){
    return(
        <>
            <header className='appHeader1 wrapperColumnAllCenter blackBackgr logo'>
                <p>ActivityLister<span className='regSymbol'>&reg;</span>
                </p>
            </header>
            <div className='appHeader2 wrapperColumnAllCenter blackBackgr siteMessage '>
                <p>Web aplication that helps you to be strict!</p>
            </div>
        </>
    )
    
}

export default Header