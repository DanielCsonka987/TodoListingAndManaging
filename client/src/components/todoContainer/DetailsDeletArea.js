function DetailsDeleteArea(props){

    const preDeletePhase =     
        <>
            <button className='todoBtn btnAlert'
                onClick={props.funcExecDelete}>Execute</button>
            <button className='todoBtn btnBack' name='forDeletion' 
                onClick={props.funcModeSwitch}>Cancel</button>
        </> 
    const beforeDeletePhase = 
        <button className='todoBtn btnAlert' name='forDeletion' 
            onClick={props.funcModeSwitch}>Delete</button>
    return (
      <div className='todoItemDetail'>
        { props.deleteAreaMode?   preDeletePhase : beforeDeletePhase  }
      </div>
    )
}

export default DetailsDeleteArea