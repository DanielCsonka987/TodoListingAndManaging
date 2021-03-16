import React from 'react'
import FormInputUnit from '../generals/FormInputUnit'
import ButtonWithIcon from '../generals/ButtonWithIcon'

const textInputArea={
    width: '100%'
}


function DetailsNotationArea(props){

    const preNotationChangePhase = <>
        <FormInputUnit additWrapperStyles={ textInputArea }
            neededInputWidth='75%'
            id='notation' label='Notation:' name='notation'
          type='textarea' value={props.noteValue}
          funcChange={props.funcChangeNotation}
        >
          You can write at most 150 character!
        </FormInputUnit>
        <ButtonWithIcon 
            iconDef='send' wrapperBlockClasses='btnCreate'
            funcClickActivity={props.funcExecNotify}
        >Save the new notation!</ButtonWithIcon>
        <ButtonWithIcon naming='forNotation' 
            iconDef='cancel' wrapperBlockClasses='btnBack'
            funcClickActivity={props.funcModeSwitch}
        >Cancel notation editing!</ButtonWithIcon>

    </>

    const  beforeNotationChangePhase = <>
        <span style={ textInputArea }>
            <span className='dataLabelMarking'>Notation: </span>
            <span>{props.notation}</span>
        </span>

        <ButtonWithIcon naming='forNotation' 
            iconDef = 'edit' wrapperBlockClasses='btnChange'
            funcClickActivity={props.funcModeSwitch}
        >Edit this notation!</ButtonWithIcon>
    </>

    return(
        <div className='todoItemCardAreas wrapperRowAllCenter' >
            { props.notationAreaMode === 'notationChange'? 
            preNotationChangePhase : beforeNotationChangePhase }
        </div>
    )
}
export default DetailsNotationArea