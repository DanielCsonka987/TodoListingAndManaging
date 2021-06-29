import React from 'react'
import ButtonWithIcon from '../generals/ButtonWithIcon'

function DetailsStatusArea(props){
    const actState = props.actStatusText === 'Finished'
    const btnIcon = actState? 'close' : 'done'
    const btnTypeClass = actState? 'btnChange' : 'btnCreate'
    const btnBubbleText = actState? 'Cancel this task!' 
        : 'Make this task to done!'
    return(
        <p className='todoItemForSatus'>
            <span><span className='formAndCardLabels'>State: </span>{props.actStatusText}</span>
            <ButtonWithIcon
                wrapperBlockClasses = { btnTypeClass }
                naming='forStatus'
                funcClickActivity={props.funcStatusChange}
                iconDef={btnIcon}
            >
                { btnBubbleText }
            </ButtonWithIcon> 
        </p>
    )
}

export default DetailsStatusArea