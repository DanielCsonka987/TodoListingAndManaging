import React from 'react';

function ShowProblems(props){
    /*
    const possibleAnchor = props.messageContent.field? 
    <a href={`#${props.messageContent.field}`}>Jump there!</a>
    : '';
    */
    if(typeof props.messageContent === 'undefined'){    //RegisterForm def. string, ProfItem def. undefined!!
        console.log('Undef')
        return (<></>)
    }
    const clssnmForErrorLine = ''
    const clssnmForText = ''
    if(typeof props.messageContent === 'string'){
        // SIMPLE MESSAGE - loggedin, logged out, ect. // 
        return (
            <div className={clssnmForErrorLine}>
                <p className={clssnmForText}>{props.messageContent}</p>
            </div>
        )
    }else{
        return (
            props.messageContent.map((item, index)=>{
                return <div className={clssnmForErrorLine} key={index}>
                  <p className={clssnmForText}>{item.msg}</p>
                  <a href={`#${item.field}`}>Jump there!</a>
                </div>
            })
        )
    }


}

export default ShowProblems