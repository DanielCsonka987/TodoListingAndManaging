import React from 'react';

function ShowMessages(props){
    if(props.messageContent === '' || typeof props.messageContent === 'undefined'){
        return (<></>)
    }
    const clssnmForErrorLine = 'msgLine'
    const clssnmForText = props.messageContent.type === 'warn'? 'errorText' : 'msgText'
    if(typeof props.messageContent.msg === 'string'){
        // SIMPLE MESSAGE - loggedin, logged out, ect. from server eg. // 
        return (
            <div className={clssnmForErrorLine}>
                <p className={clssnmForText}>{props.messageContent.msg}</p>
            </div>
        )
    }else /* if(typeof props.messageContent.msg === 'object' || typeof props.messageContent.msg === 'array')*/{
        return (
            props.messageContent.msg.map((item, index)=>{
                return <div className={clssnmForErrorLine} key={index}>
                  <span className={clssnmForText}>{item.message}</span>
                  <a href={`#${item.field}`}><i className='material-icons'>arrow_back</i></a>
                </div>
            })
        )
    }
}

export default ShowMessages