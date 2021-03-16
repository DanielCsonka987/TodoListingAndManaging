import React, {Component} from 'react';
import FromInputUnit from '../generals/FormInputUnit'
import ButtonWithIcon from '../generals/ButtonWithIcon'

const DetailsLoggedOut = (props)=>{
  const handleHitEnterOnInput = (e)=>{
    if(e.type==='keypress' && e.code === 'Enter'){
      props.funcInputHitEnter();
    }
  }

  return(
    <div className='wrapperColumnAllCenter'>
      <div className='profileInputContainer'>
        <FromInputUnit 
              label='Password:' classes='userDetail'
              type='password' name='password' id='pwdLog'
              value={props.pwd} funcChange={props.funcInputChange}
              funcHitEnter={handleHitEnterOnInput}
        />
      </div>
      <div className='buttonGroupWrapper'>
        <ButtonWithIcon sizing='big'
          wrapperBlockClasses='btnLogin' iconDef='lock_open'
          funcClickActivity={props.funcLogin}
        >Login</ButtonWithIcon>
      </div>
    </div>
  )
}

export default DetailsLoggedOut
