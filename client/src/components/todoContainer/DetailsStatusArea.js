import React from 'react'
import ButtonWithIcon from '../generals/ButtonWithIcon'

function DetailsStatusArea(props){
    const btnIcon = props.actStatus? 'close' : 'done'
    const btnTypeClass = props.actStatus? 'btnChange' : 'btnCreate'
    const btnBubbleText = props.actStatus? 'Cancel this task!' 
        : 'Make this task to done!'
    return(
        <div className='todoItemCardAreas wrapperRowAllCenter'>
            <span className='dataLabelMarking' >Status: </span>
            <span>{props.actStatusText}</span>
            <ButtonWithIcon 
                wrapperBlockClasses = { btnTypeClass }
                funcClickActivity={props.funcStatusChange}
                iconDef={btnIcon}
            >
                { btnBubbleText }
            </ButtonWithIcon> 
        </div>
    )
}

export default DetailsStatusArea