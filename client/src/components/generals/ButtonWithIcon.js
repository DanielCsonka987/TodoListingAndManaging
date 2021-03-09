import React from 'react'

function ButtonWithIcon(props){
    return(
        <button className={'btnObj clickable ' + props.wrapperBlockClasses}
            onClick={props.funcClickActivity}>
            <span className={'iconAndTextTogether' + props.wrapperInlineClasses}>
                <i className='material-icons iconItself'>{props.iconDef}</i>
                <span className={'textNextToIcon ' + props.textClasses}>
                    {props.children}
                </span>
            </span>
        </button>
    )
}

export default ButtonWithIcon