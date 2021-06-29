import React from 'react'

function CardTileTextAndContent(props){
    return(
        <div className={'cardAreaPadding cardAreaEdge ' + props.wrapperBlockClasses || ''}>
            <p className={'iconTextTogether ' + props.wrapperInlineClasses || ''} 
                onKeyPress={props.funcKeyPressActivity} onClick={props.funcClickActivity}
                tabIndex={props.tabIndexing}>
                <i className='material-icons iconItself'>{props.iconDef}</i>
                <span className={'textNextToIcon tileNameText ' + props.textClasses}>
                    {props.tileText}
                </span>
            </p>
            { props.children }
        </div>
    )
}

export default CardTileTextAndContent