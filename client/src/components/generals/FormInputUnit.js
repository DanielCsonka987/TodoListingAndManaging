import React from 'react'

const FormInputUnit = (props)=>{

    return (
        <div className={props.classes}>
            <label htmlFor={props.id}>{props.label}</label>
            <span className='hiddenInformation'>{props.children}</span>
            <input type={props.type} name={props.name}
             id={props.id} value={props.value} 
             onChange={props.funcChange} />
        </div>
    )
}

export default FormInputUnit;