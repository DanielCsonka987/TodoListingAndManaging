import React from 'react'

const FooterPopUp = (props)=>{

    return (
        <div className='footerPopup'>
            <span className='cookiePopupText'>
                This site uses some essential cookies for the proper functionality. 
                The site do not collect or persist personal information of any kind.
            </span>
            <button className='cookiePopupBtn clickable' onClick={props.funcUserAcknowl}>
                Acknowlegded
            </button>
        </div>
    )
}

export default FooterPopUp