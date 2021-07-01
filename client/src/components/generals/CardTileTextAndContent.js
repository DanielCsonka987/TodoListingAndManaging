import React from 'react'

function CardTileTextAndContent(props){

    const cardStructure =  <p className={'clickable iconTextTogether ' + props.wrapperInlineClasses || ''} 
        onKeyPress={props.funcKeyPressActivity} onClick={props.funcClickActivity}
        tabIndex={props.tabIndexing}>
        <i className='material-icons iconItself'>{props.iconDef}</i>
        <span className={'textNextToIcon tileNameText ' + props.textClasses}>
            {props.tileText}
        </span>
</p>
    if(props.setTestId){
        return (
            <div data-testid={props.setTestId}
                className={'cardAreaPadding cardAreaEdge ' + props.wrapperBlockClasses || ''}>
                { cardStructure }
                { props.children }
            </div>
        )
    }else{
        return(
            <div className={'cardAreaPadding cardAreaEdge ' + props.wrapperBlockClasses || ''}>
                { cardStructure }
                { props.children }
            </div>
        )
    }

}

export default CardTileTextAndContent