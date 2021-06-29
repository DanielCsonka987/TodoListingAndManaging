import React from 'react';
import FromInputUnit from '../generals/FormInputUnit'
import ButtonWithIcon from '../generals/ButtonWithIcon'

const DetailsLoggedIn = (props)=>{
  const stateOfComponent = props.inputModeChange;

  let areaInputContent,  areaContentForButton = '';
  if(stateOfComponent === 'none'){
    areaContentForButton = <>
      <ButtonWithIcon sizing='big'
        wrapperBlockClasses='btnChange' iconDef='edit' 
        funcClickActivity={props.funcPwdChange}>Change password</ButtonWithIcon>
      <ButtonWithIcon sizing='big'
        wrapperBlockClasses='btnDelete' iconDef='delete' 
        funcClickActivity={props.funcProfDel}>Delete account</ButtonWithIcon>
      <ButtonWithIcon sizing='big'
        wrapperBlockClasses='btnLogout' iconDef='lock' 
        funcClickActivity={props.funcLogOut}>Logout</ButtonWithIcon>
    </>
  }
  if(stateOfComponent === 'pwd'){
    areaInputContent = <>
        <FromInputUnit 
        label={'Old password:'}
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
    areaContentForButton = <>
      <ButtonWithIcon sizing='big'
        wrapperBlockClasses='btnChange' iconDef='send' 
        funcClickActivity={props.funcPwdChange}>Change password</ButtonWithIcon>
      <ButtonWithIcon sizing='big'
        wrapperBlockClasses='btnBack' iconDef='cancel' 
        funcClickActivity={props.funcCancelModify}>Cancel</ButtonWithIcon>
    </> 
  }

  if(stateOfComponent === 'del'){
    areaInputContent = <>
      <FromInputUnit 
        label={'Password:'}
        type='password' name='old_password' id='old_password'
        value={props.oldPwd} funcChange={props.funcInputChange}
      /></>
      areaContentForButton = <>
        <ButtonWithIcon sizing='big'
          wrapperBlockClasses='btnDelete' iconDef='delete' 
          funcClickActivity={props.funcProfDel}>Delete account</ButtonWithIcon>  
        <ButtonWithIcon sizing='big'
          wrapperBlockClasses='btnBack' iconDef='cancel'
          funcClickActivity={props.funcCancelModify}>Cancel</ButtonWithIcon>
      </>
  }

  return(
    <div className='contentSetCenter'>
        <p className='userDetail'>
          <span className='formAndCardLabels'>Fullname:</span>
          <span> {props.extraDatas.fullname}</span></p>
        <p className='userDetail'>
          <span className='formAndCardLabels'>Age: </span>
          <span>{props.extraDatas.age}</span></p>
        <p className='userDetail'>
          <span className='formAndCardLabels'>Occupation: </span>
          <span>{props.extraDatas.occupation}</span></p>
        <section className='profileInputContainer'>
        { areaInputContent } 
        </section>
        <section className='buttonGroupWrapper'>
          { areaContentForButton }
        </section>
    </div>
  )
  
}

export default DetailsLoggedIn