import React, {Component} from 'react';
import FromInputUnit from '../generals/FormInputUnit'

const DetailsLoggedOut = (props)=>{

  return(
    <div>
      <FromInputUnit 
            label='Password:' classes='userDetail'
            type='password' name='password' id='pwdLog'
            onChange={props.handleInputChange}
          />
      <div className='userButtons'>
        <button onClick={props.funcLogin}>Login</button>
        
      </div>
    </div>
    
  )
}

export default DetailsLoggedOut
