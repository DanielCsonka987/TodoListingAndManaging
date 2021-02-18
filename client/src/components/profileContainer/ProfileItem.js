import React, { Component } from 'react'

import DetailsLoggedIn from './DetailsLoggedIn'
import DetailsLoggedOut from './DetailsLoggedOut'
import ShowMessages from '../generals/ShowMessages'

import { loginInputRevise,  pwdChangeInputRevise, 
  deleteProfInputRevise }  from '../../utils/inputRevise.js'
import { doAjaxSending, 
  smblLoginDatas, smblPwdChangeDatas } from '../../utils/apiMessenger.js'

import interpretProblems from '../../utils/interpretProblems'

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
    this.state = {
      userid: props.userid,
      username: props.username,

      password: '',
      old_password: '',
      new_password: '',
      password_repeat: '',
      loggedInInputModeChange: 'none',

      profileMessage: ''

    }
  } 
  handleInputChange(event){
    const { name, value} = event.target;
    this.setState({ [name]:value })
  }
  handleCardFocus(){
    this.props.funcCardFocus(this.state.userid);
  }
  handleAPIError(err){
    interpretProblems(err, 'profileMessage', this.handleInputChange)
  }
  async handleLogin(){
    try{
      await loginInputRevise(this.state);
      const ajaxBody = smblLoginDatas(
        this.state.username,
        this.state.password
        );
      const loginRes = await doAjaxSending(this.props.loginProfile, 'POST', ajaxBody);
      this.setState({password: '', profileMessage: loginRes.message})
      const todoRes = await doAjaxSending(loginRes.report.getAddTodos, 'GET', '');
      this.props.funcLoginProc(loginRes.report, todoRes.report);

    }catch(err){
      this.handleAPIError(err);
    }

  }
  async handleLogOut(){
    try{
      const ajaxBody = '';
      const logoutRes = await doAjaxSending(this.props.userExtraDatas.logoutProfile, 'GET', ajaxBody)

      this.props.funcLogoutProc(this.state.userid)
      this.setState({ profileMessage: logoutRes.message });
    }catch(err){
      this.handleAPIError(err);
    }
  }
  async handlePwdChange(){
    try{
      if(this.state.loggedInInputModeChange === 'pwd'){
        await pwdChangeInputRevise(this.state)
        const ajaxBody = smblPwdChangeDatas(
          this.state.old_password, this.state.new_password
        );
        const pwdChangeRes = await doAjaxSending(this.props.userExtraDatas.manageProfile,
           'PUT', ajaxBody)
        this.setState({ 
          password: '', password_repeat: '',
          profileMessage: pwdChangeRes.message,
          loggedInInputModeChange: 'none'
        })
      }else{
        this.setState({ loggedInInputModeChange: 'pwd'  })
      }
    }catch(err){
      this.handleAPIError(err)
    }
  }
  async handleAccountDel(){
    try{
      if(this.state.loggedInInputModeChange === 'del'){
        await deleteProfInputRevise(this.state)
        this.props.funcCardRemoval(this.state.old_password, this.state.userid);
        this.setState({
          old_password: '',
          loggedInInputModeChange: 'none'
        })
      }else{
        this.setState({ loggedInInputModeChange: 'del' })
      }
    }catch(err){
      this.handleAPIError(err);
    }
  }
  handleCancelModify(){
    this.setState({
      old_password: '',
      new_password: '',
      password_repeat: '',
      loggedInInputModeChange: 'none',
      profileMessage: ''
    })
  }
  render(){

    const loggedOutContent = <>
      <DetailsLoggedOut
        pwd={this.state.password}
        funcInputChange={this.handleInputChange}

        funcLogin={this.handleLogin}
      />
      <ShowMessages messageContent={this.state.profileMessage} />
    </>      

    const loggedInContent = <>
      <DetailsLoggedIn
        extraDatas={ typeof this.props.userExtraDatas ==='object'?
          this.props.userExtraDatas: ''}
        oldPwd={this.state.old_password}
        newPwd={this.state.new_password}
        repPwd={this.state.password_repeat}
        inputModeChange={this.state.loggedInInputModeChange}
        funcInputChange={this.handleInputChange}

        funcPwdChange={this.handlePwdChange}
        funcProfDel={this.handleAccountDel}
        funcCancelModify={this.handleCancelModify}
        funcLogOut={this.handleLogOut}
      />
      <ShowMessages messageContent={this.state.profileMessage} />
    </>

    const cardState = this.state.cardOnFocus? 
      'cardUserActive' : 'cardUserInactive'

    return (
      <div className={'profileItem', cardState}>
        <p onClick={this.handleCardFocus}>
          Username: <span className='profUsername'>{this.state.username}</span>
        </p>
        { this.props.cardOnFocus? 
            this.props.cardLoggedIn? loggedInContent : loggedOutContent
            : ''
        }
      </div>
    )
  }
}

export default ProfileItem
