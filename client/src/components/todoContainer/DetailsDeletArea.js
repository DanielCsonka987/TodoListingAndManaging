import React from 'react'
import ButtonWithIcon from '../generals/ButtonWithIcon'

function DetailsDeleteArea(props){

    const preDeletePhase =     
        <>
            <ButtonWithIcon 
                iconDef='delete' wrapperBlockClasses='btnDelete'
                funcClickActivity={props.funcExecDelete}
            >Confirm the deletion!</ButtonWithIcon>
            <ButtonWithIcon naming='forDeletion'
                iconDef='cancel' wrapperBlockClasses='btnBack'
                funcClickActivity={props.funcModeSwitch}
            >Cancel the task deletion!</ButtonWithIcon>
        </> 
    const beforeDeletePhase = 
        <ButtonWithIcon sizing = 'small' naming='forDeletion'
            wrapperBlockClasses='btnDelete' iconDef='delete'
            funcClickActivity={props.funcModeSwitch}
        >Delete this task!</ButtonWithIcon>
    return (
      <div className='todoItemCardArea wrapperRowAllCenter'>
        { props.deleteAreaMode === 'deleteConfirm'?
           preDeletePhase : beforeDeletePhase  }
      </div>
    )
}

export default DetailsDeleteArea