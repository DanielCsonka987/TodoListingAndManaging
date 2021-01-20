import React from 'react'

const FormInputUnit = (props)=>{

    return (
        <div className={props.classes}>
            <label for={props.id}>{props.label}</label>
            <span className='hiddenInformation'>{props.children}</span>
            <input type={props.type} name={props.name}
             id={props.id} value={props.val} 
             onChange={props.funcChange} />
        </div>
    )
}

export default FormInputUnit;