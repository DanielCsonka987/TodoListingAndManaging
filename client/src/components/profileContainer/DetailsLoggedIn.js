import React from 'react';
import FromInputUnit from '../generals/FormInputUnit'
import ButtonWithIcon from '../generals/ButtonWithIcon'

const DetailsLoggedIn = (props)=>{
  const stateOfComponent = props.inputModeChange;

  let areaContent1, areaContent2, areaContentForButton = '';

  if(stateOfComponent === 'pwd'){
    areaContent2 = <>
      <FromInputUnit 
        label='New password:'
        type='password' name='new_password' id='new_password'
        value={props.newPwd} funcChange={props.funcInputChange}
        />
      <FromInputUnit 
        label='Password again:'
        type='password' name='password_repeat' id='password_repeat'
        value={props.repPwd} funcChange={props.funcInputChange}
      />
    </>
    areaContentForButton = <ButtonWithIcon
      wrapperBlockClasses='btnBack' iconDef='cancel' 
      funcClickActivity={props.funcCancelModify}>Cancel</ButtonWithIcon>
  }

  if(stateOfComponent === 'del'){
  
    const titleAtModifyState = stateOfComponent === 'del'?
      'For deletion give the password!' : 'For password change fill the form!'
    const titleForFirstPwdTag = stateOfComponent === 'del'?
      'Password:' : 'Old password:'
  
    areaContent1 = <>
      <p>{ titleAtModifyState }</p>
      <FromInputUnit 
        label={titleForFirstPwdTag}
        type='password' name='old_password' id='old_password'
        value={props.oldPwd} funcChange={props.funcInputChange}
      /></>
      areaContentForButton = <ButtonWithIcon
        wrapperBlockClasses='btnBack' iconDef='cancel'
        funcClickActivity={props.funcCancelModify}>Cancel</ButtonWithIcon>
  }

  return(
    <div className='wrapperColumnAllCenter'>
        <p className='userDetail'>Fullname: {props.extraDatas.fullname}</p>
        <p className='userDetail'>Age: {props.extraDatas.age}</p>
        <p className='userDetail'>Occupation: {props.extraDatas.occupation}</p>
        <div className='profileInputContainer'>
        { areaContent1 } { areaContent2 } 
        </div>
        <div className='buttonGroupWrapper'>
          { areaContentForButton }

          <ButtonWithIcon
            wrapperBlockClasses='btnChange' iconDef='build' 
            funcClickActivity={props.funcPwdChange}>Change password</ButtonWithIcon>
          <ButtonWithIcon
            wrapperBlockClasses='btnDelete' iconDef='delete' 
            funcClickActivity={props.funcProfDel}>Delete account</ButtonWithIcon>
          <ButtonWithIcon
            wrapperBlockClasses='btnLogout' iconDef='lock' 
            funcClickActivity={props.funcLogOut}>Logout</ButtonWithIcon>

        </div>
    </div>
  )
  
}

export default DetailsLoggedIn