import React from 'react'
import ButtonWithIcon from '../generals/ButtonWithIcon'

function DetailsStatusArea(props){
    const actState = props.actStatusText === 'Finished'
    const btnIcon = actState? 'close' : 'done'
    const btnTypeClass = actState? 'btnChange' : 'btnCreate'
    const btnBubbleText = actState? 'Cancel this task!' 
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