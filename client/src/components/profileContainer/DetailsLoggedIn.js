import React, {Component} from 'react';
import FromInputUnit from '../generals/FormInputUnit'

const DetailsLoggedIn = (props)=>{

  return(
    <div>
        <p className='userDetail'>Fullname: {props.fullname}</p>
        <p className='userDetail'>Age: {props.age}</p>
        <p className='userDetail'>Occupation: {props.occupation}</p>
        <div className='userPwdChange'>
        <FromInputUnit 
            label='Old password:'
            type='password' name='old_password' id='old_password'
            value={props.oldPwd} funcChange={props.funcInputChange}
          />
          <FromInputUnit 
            label='New password:'
            type='password' name='new_password' id='new_password'
            value={props.newPwd} funcChange={props.funcInputChange}
          />
          <FromInputUnit 
            label='New password again:'
            type='password' name='password_repeat' id='password_repeat'
            value={props.repPwd} funcChange={props.funcInputChange}
          />
        </div>
        <div className='userButtons'>
          <button onClick={props.funcPwdChange}>Change password</button>
          <button onClick={props.funcProfDel}>Delete accout</button>
          <button onClick={props.funcLogOut}>Logout</button>
        </div>
    </div>
  )
  
}

export default DetailsLoggedIn