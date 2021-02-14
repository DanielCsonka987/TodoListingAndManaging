import React from 'react';
import FromInputUnit from '../generals/FormInputUnit'

const DetailsLoggedIn = (props)=>{
  const stateOfComponent = props.inputModeChange;

  let areaContent1, areaContent2, areaContentForButton = '';
  if(stateOfComponent !== 'none'){

    const titleAtModifyState = stateOfComponent === 'del'?
      'For deletion give the password!' : 'For password change fill the form!'
    const titleForFirstPwdTag = stateOfComponent === 'del'?
      'Password:' : 'Old password:'

    areaContent1 = <>
      <p>{titleAtModifyState}</p>
      <FromInputUnit 
        label={titleForFirstPwdTag}
        type='password' name='old_password' id='old_password'
        value={props.oldPwd} funcChange={props.funcInputChange}
      /></>
  }
  if(stateOfComponent === 'pwd'){
    areaContent2 = <>
      <FromInputUnit 
        label='New password:'
        type='password' name='new_password' id='new_password'
        value={props.newPwd} funcChange={props.funcInputChange}
      />
      <FromInputUnit 
        label='New password again:'
        type='password' name='password_repeat' id='password_repeat'
        value={props.repPwd} funcChange={props.funcInputChange}
      /></>
  }
  if(stateOfComponent !== 'none'){
    areaContentForButton = <button onClick={props.funcCancelModify}>Cancel</button>
  }
  return(
    <div>
        <p className='userDetail'>Fullname: {props.extraDatas.fullname}</p>
        <p className='userDetail'>Age: {props.extraDatas.age}</p>
        <p className='userDetail'>Occupation: {props.extraDatas.occupation}</p>
        <div className='userPwdChange'>
        { areaContent1 } { areaContent2 } 
        </div>
        <div className='userButtons'>
          { areaContentForButton }
          <button onClick={props.funcPwdChange}>Change password</button>
          <button onClick={props.funcProfDel}>Delete accout</button>
          <button onClick={props.funcLogOut}>Logout</button>
        </div>
    </div>
  )
  
}

export default DetailsLoggedIn