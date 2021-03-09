import React from 'react';

function ShowMessages(props){
    /*
    const possibleAnchor = props.messageContent.field? 
    <a href={`#${props.messageContent.field}`}>Jump there!</a>
    : '';
    */
    if(typeof props.messageContent === 'undefined'){ //TodoItem def. undefined!!
        console.log('Undef')
        return (<></>)
    }
    const clssnmForErrorLine = 'errorLine'
    const clssnmForText = 'errorText'
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

export default ShowMessages