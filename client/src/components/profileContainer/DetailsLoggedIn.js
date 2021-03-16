import React from 'react';
import FromInputUnit from '../generals/FormInputUnit'
import ButtonWithIcon from '../generals/ButtonWithIcon'

const DetailsLoggedIn = (props)=>{
  const stateOfComponent = props.inputModeChange;

  let areaContent1, areaContent2, areaContentForButton = '';

  const titleAtModifyState = stateOfComponent === 'del'?
    'For deletion give the password!' : 'For password change fill the form!'
  const titleForFirstPwdTag = stateOfComponent === 'del'?
    'Password:' : 'Old password:'
  if(stateOfComponent === 'pwd'){
    areaContent2 = <>
      <p>{ titleAtModifyState }</p>
        <FromInputUnit 
        label={titleForFirstPwdTag}
        type='password' name='old_password' id='old_password'
        value={props.oldPwd} funcChange={props.funcInputChange}
      />
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
    areaContentForButton = <ButtonWithIcon sizing='big'
      wrapperBlockClasses='btnBack' iconDef='cancel' 
      funcClickActivity={props.funcCancelModify}>Cancel</ButtonWithIcon>
  }

  if(stateOfComponent === 'del'){
    areaContent1 = <>
      <p>{ titleAtModifyState }</p>
      <FromInputUnit 
        label={titleForFirstPwdTag}
        type='password' name='old_password' id='old_password'
        value={props.oldPwd} funcChange={props.funcInputChange}
      /></>
      areaContentForButton = <ButtonWithIcon sizing='big'
        wrapperBlockClasses='btnBack' iconDef='cancel'
        funcClickActivity={props.funcCancelModify}>Cancel</ButtonWithIcon>
  }

  return(
    <div className='wrapperColumnAllCenter'>
        <p className='userDetail'>
          <span className='dataLabelMarking'>Fullname:</span>
          <span> {props.extraDatas.fullname}</span></p>
        <p className='userDetail'>
          <span className='dataLabelMarking'>Age: </span>
          <span>{props.extraDatas.age}</span></p>
        <p className='userDetail'>
          <span className='dataLabelMarking'>Occupation: </span>
          <span>{props.extraDatas.occupation}</span></p>
        <div className='profileInputContainer'>
        { areaContent1 } { areaContent2 } 
        </div>
        <div className='buttonGroupWrapper'>
          { areaContentForButton }

          <ButtonWithIcon sizing='big'
            wrapperBlockClasses='btnChange' iconDef='edit' 
            funcClickActivity={props.funcPwdChange}>Change password</ButtonWithIcon>
          <ButtonWithIcon sizing='big'
            wrapperBlockClasses='btnDelete' iconDef='delete' 
            funcClickActivity={props.funcProfDel}>Delete account</ButtonWithIcon>
          <ButtonWithIcon sizing='big'
            wrapperBlockClasses='btnLogout' iconDef='lock' 
            funcClickActivity={props.funcLogOut}>Logout</ButtonWithIcon>

        </div>
    </div>
  )
  
}

export default DetailsLoggedIn