import React, { Fragment } from 'react'
import ButtonWithIcon from '../generals/ButtonWithIcon'
import FormTextareaUnit from '../generals/FormTextareaUnit'

function DetailsNotationArea(props){

    const preNotationChangePhase = <Fragment>

        <FormTextareaUnit classes='todoInputForNote'
            id='noteTodo' label='Notation:'
            name='notation' maxCharLength={'150'}
            value={props.noteValue}
            funcChange={props.funcChangeNotation}
        >
            If you define this, it must be max 150 character!
        </FormTextareaUnit>
        <div>
            <ButtonWithIcon 
                iconDef='send' wrapperBlockClasses='btnCreate'
                funcClickActivity={props.funcExecNotify}
            >Save the new notation!</ButtonWithIcon>
            <ButtonWithIcon naming='forNotation' 
                iconDef='cancel' wrapperBlockClasses='btnBack'
                funcClickActivity={props.funcModeSwitch}
            >Cancel notation editing!</ButtonWithIcon>
        </div>

    </Fragment>

    const  beforeNotationChangePhase = <Fragment>
        <p className='todoItemForShowNote' >
            {props.notation?props.notation : 'Notation none...'}
        </p>

        <ButtonWithIcon naming='forNotation' 
            iconDef = 'edit' wrapperBlockClasses='btnChange'
            funcClickActivity={props.funcModeSwitch}
        >Edit this notation!</ButtonWithIcon>
    </Fragment>

    return(
        <div className='todoItemForNotation' >
            { props.notationAreaMode === 'notationChange'? 
            preNotationChangePhase : beforeNotationChangePhase }
        </div>
    )
}
export default DetailsNotationArea