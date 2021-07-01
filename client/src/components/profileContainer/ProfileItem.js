import React, { Component, Fragment } from 'react'
import DetailsLoggedIn from './DetailsLoggedIn'
import DetailsLoggedOut from './DetailsLoggedOut'
import ShowMessages from '../generals/ShowMessages'
import CardTileTextAndContent from '../generals/CardTileTextAndContent'

import { loginInputRevise,  pwdChangeInputRevise, 
  deleteProfInputRevise }  from '../../utils/inputRevise.js'
import { doAjaxSending, 
  smblLoginDatas, smblPwdChangeDatas } from '../../utils/apiMessenger.js'


class ProfileItem extends Component {
  constructor(props){
    super(props)
    this.handleAPIError = this.handleAPIError.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this);

    this.handleCardFocus = this.handleCardFocus.bind(this)
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handlePwdChange = this.handlePwdChange.bind(this);
    this.handleAccountDel = this.handleAccountDel.bind(this)
    this.handleCancelModify = this.handleCancelModify.bind(this)

    this.setBaseCardState = this.setBaseCardState.bind(this)
    this.setPwdChangeCardState = this.setPwdChangeCardState.bind(this)
    this.setAccDelCardState = this.setAccDelCardState.bind(this)

    this.state = {
      password: '',
      old_password: '',
      new_password: '',
      password_repeat: '',
      actualCardState: 'none',

      profileMessage: ''

    }
  } 
  handleInputChange(event){
    const { name, value} = event.target;
    this.setState({ [name]:value })
  }
  handleCardFocus(e){
    if(e.type === 'click'){
      this.props.funcCardFocus(this.props.userid);
    }
    if(e.type === 'keypress' && ( e.code === 'Space' || e.code === 'Enter' )){
      this.props.funcCardFocus(this.props.userid);
    }
  }
  handleAPIError(err){
    let errmsg = ''
    if(err.name.includes('Validate')){
      errmsg = err.errorFields
    }else{
      //console.log(err.name + '-' + err.message)
      errmsg = err.message;
    }
    this.setState({ 
      profileMessage:  { type: 'warn', msg: errmsg }
    })
  }

  async handleLogin(){
    try{
      await loginInputRevise(this.state);
      const ajaxBody = smblLoginDatas(
        this.props.username,
        this.state.password
      );
      const loginRes = await doAjaxSending(this.props.loginUrl, 'POST', ajaxBody);
      this.setState({
        password: '', 
        profileMessage: { 
          type: loginRes.status === 'success'? 'norm':'warn',
          msg: loginRes.message }
      })
      this.props.funcLoginProc(loginRes, 'login');

    }catch(err){
      this.handleAPIError(err);
    }

  }
  async handleLogOut(){
    try{
      const logoutRes = await doAjaxSending(this.props.userExtraDatas.logoutUrl, 'GET', '')
      this.props.funcLogoutProc(this.props.userid, logoutRes.message)
      this.setBaseCardState('')
    }catch(err){
      this.handleAPIError(err);
    }
  }
  async handlePwdChange(){
    try{
      if(this.state.actualCardState === 'pwd'){
        await pwdChangeInputRevise(this.state)
        const ajaxBody = smblPwdChangeDatas(
          this.state.old_password, this.state.new_password
        );
        const pwdChangeRes = await doAjaxSending(this.props.userExtraDatas.changePwdDelAccUrl,
           'PUT', ajaxBody)
        this.setBaseCardState(pwdChangeRes.message)
      }else{
        this.setPwdChangeCardState('');
      }
    }catch(err){
      this.handleAPIError(err)
    }
  }
  async handleAccountDel(){
    try{
      if(this.state.actualCardState === 'del'){
        await deleteProfInputRevise(this.state)
        this.props.funcCardRemoval(this.state.old_password, this.props.userid);
      }
      this.setAccDelCardState()
    }catch(err){
      this.handleAPIError(err);
    }
  }
  handleCancelModify(){
    this.setBaseCardState('')
  }
  setBaseCardState(msg){
    this.setState({
      old_password: '',
      new_password: '',
      password_repeat: '',
      actualCardState: 'none',
      profileMessage: { type: 'norm', msg: msg }
    })
  }
  setPwdChangeCardState(){
    this.setState({  
      actualCardState: 'pwd',
      profileMessage: { type: 'norm', msg: 'For password change fill the form!' }
    })

  }
  setAccDelCardState(){
    this.setState({ 
      actualCardState: 'del',
      profileMessage: { type: 'norm', msg: 'For deletion give the password!' }
    })
  }
  render(){
    const isThisCardLoggedIn = typeof this.props.userExtraDatas ==='object';

    const loggedOutContent = <Fragment>
      <DetailsLoggedOut
        pwd={this.state.password}
        funcInputChange={this.handleInputChange}
        funcInputHitEnter={this.handleLogin}
        funcLogin={this.handleLogin}
      />
      <ShowMessages messageContent={ this.state.profileMessage } />
    </Fragment>      

    const loggedInContent = <Fragment>
      <DetailsLoggedIn
        extraDatas={ isThisCardLoggedIn? this.props.userExtraDatas: ''}
        oldPwd={this.state.old_password}
        newPwd={this.state.new_password}
        repPwd={this.state.password_repeat}
        inputModeChange={this.state.actualCardState}
        funcInputChange={this.handleInputChange}

        funcPwdChange={this.handlePwdChange}
        funcProfDel={this.handleAccountDel}
        funcCancelModify={this.handleCancelModify}
        funcLogOut={this.handleLogOut}
      />
      <ShowMessages messageContent={ this.state.profileMessage || this.props.userExtraMessage} />
    </Fragment>

    const cardFocusState = this.state.cardOnFocus? 'cardUserActive' : 'cardUserInactive'

    const cardContent= this.props.cardOnFocus? 
        isThisCardLoggedIn? loggedInContent : loggedOutContent  : ''
    return (
      <CardTileTextAndContent
        wrapperBlockClasses={'' + cardFocusState} 
        wrapperInlineClasses=''
        funcKeyPressActivity={this.handleCardFocus}
        funcClickActivity={this.handleCardFocus}
        tabIndexing='0' iconDef='account_circle'
        tileText={this.props.username}
      >
      { cardContent } </CardTileTextAndContent>

    )
  }
}

export default ProfileItem
