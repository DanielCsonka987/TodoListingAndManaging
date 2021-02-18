import FormInputUnit from '../generals/FormInputUnit'

function DetailsNotationArea(props){

    const preNotationChangePhase = <>
        <FormInputUnit classes=''
          id='notation' label='Notation:' name='notation'
          type='textarea' value={props.noteValue}
          funcChange={props.funcChangeNotation}
        >
          You can write at most 150 character!
        </FormInputUnit>
        <button onClick={props.funcExecNotify}>Change it!</button>
        <button className='todoChange' name='forNotation' 
            onClick={props.funcModeSwitch}>Cancel</button>
    </>

    const  beforeNotationChangePhase = <>
        <span className='todoItemCentral'>Notation: {props.notation}</span>
        <button className='todoChange' name='forNotation' 
            onClick={props.funcModeSwitch}>Edit</button>
    </>
    return(
        <div className='todoItemDetail'>
            { props.notationAreaMode? 
            preNotationChangePhase : beforeNotationChangePhase }
        </div>
    )
}
export default DetailsNotationArea