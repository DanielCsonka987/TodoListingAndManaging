import React, { useState } from 'react'

function ButtonWithIcon(props){
    let btnConfig = [];
    let btnTextContent = ''
    const [ tooltipBubbleState, setTooltipState ] = useState(false)
    
    if(props.sizing=== 'big'){
        btnConfig[0] = 'btnObjBig ';
        btnConfig[1] = 'iconAndTextTogether '
        if(props.children){
            btnTextContent =  <span className={'textNextToIcon ' + props.textClasses}>
                 {props.children} </span>
        }
    }else{  //at small mode, the button text appears as bubble at focus/noMouse
        btnConfig[0] = 'btnObjSmall '
        btnConfig[1] = 'iconWithoutText '
        if(props.children){
            btnTextContent =  tooltipBubbleState ? 
                <span className={'btnTooltipBubble'} name={props.naming} >
                    {  props.children } </span>  : ''
        }
    }
    const bubbleAppeare = ()=>{
        setTooltipState(true)
    }
    const bubbleDisappeare = ()=>{
        setTooltipState(false)
    }
    
    return(
        <button name={props.naming} 
            className={'clickable ' + btnConfig[0] + props.wrapperBlockClasses }
            onClick={props.funcClickActivity}
            onFocus={bubbleAppeare} onMouseOver={bubbleAppeare}
            onBlur={bubbleDisappeare} onMouseOut={bubbleDisappeare}>
            <span name={props.naming} className={btnConfig[1] + props.wrapperInlineClasses } >
                <i name={props.naming} className='material-icons iconItself' >
                    {props.iconDef}</i>
                { btnTextContent }
            </span>
        </button>
    )
}

export default ButtonWithIcon