import React, { useState } from 'react'
import { Transition } from 'react-transition-group'

const wrapperToBubble ={
    display: 'block',
    position: 'relative'
}

const bubbleStyle={
    display: 'block',
    position: 'absolute',
    zIndex: '3',
    opacity: '0.0',
    padding: '0.4rem',
    maxWidth: '6.5rem',
    top: '1.5rem',
    right: '-5rem',
    color: 'black',
    background: '#FFF0C3',
    borderRadius: '13%',
    border: '1px solid grey',
    fontSize: '0.8rem',
    transition: 'opacity 16000ms ease'
}

function ButtonWithIcon(props){
    let btnConfig = [];
    let btnTextContent = ''
    const [ bubbleState, setBubbleState ] = useState(false)
    if(props.sizing=== 'big'){
        btnConfig[0] = 'btnObjBig';
        btnConfig[1] = 'iconAndTextTogether'
        if(props.children){
            btnTextContent =  <span className={'textNextToIcon' 
                + ' ' + props.textClasses}> {props.children} </span>
        }
    }else{  //at small mode, the button text appears as bubble at focus/noMouse
        btnConfig[0] = 'btnObjSmall'
        btnConfig[1] = 'iconWithoutText'
        if(props.children){
            btnTextContent = <Transition
                transitionentertimeout={500}
                transitionleavetimeout={500}
                timeout={500}
                >
                {
                    bubbleState ?
                    <span style={ bubbleStyle } key={'2'}>
                        {  props.children }
                    </span>
                    : <span key={'2'}></span>
                }
            </Transition>
        }
    }
    const bubbleAppeare = ()=>{
        setBubbleState(true)
    }
    const bubbleDisappeare = ()=>{
        setBubbleState(false)
    }

    return(
        <div className={props.classes} style={ props.additWrapperStyles }>
            <button name={props.naming}
                className={'clickable ' + btnConfig[0] + ' ' + props.wrapperBlockClasses}
                onClick={props.funcClickActivity}
                onFocus={bubbleAppeare} onMouseOver={bubbleAppeare}
                onBlur={bubbleDisappeare} onMouseOut={bubbleDisappeare}>
                <span name={props.naming} style={ wrapperToBubble } 
                    className={btnConfig[1] + ' ' + props.wrapperInlineClasses} >
                    <i name={props.naming} className='material-icons iconItself' >
                        {props.iconDef}</i>


                    { btnTextContent }

                    
                </span>
            </button>
        </div>
    )
}

export default ButtonWithIcon