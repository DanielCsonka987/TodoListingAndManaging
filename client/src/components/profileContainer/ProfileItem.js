import React, { Component } from 'react'

import DetailsLoggedIn from './DetailsLoggedIn'
import DetailsLoggedOut from './DetailsLoggedOut'

import { loginInputRevise, 
  pwdChangeInputRevise, 
  deleteProfInputRevise } 
  from '../../utils/inputRevise.js'

import { doAjaxSending, 
  smblLoginDatas, smblPwdChangeDatas } from '../../utils/apiMessenger.js'

class ProfileItem extends Component {
  constructor(props){
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCardFocus = this.handleCardFocus.bind(this)
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handlePwdChange = this.handlePwdChange.bind(this);
    this.handleAccountDel = this.handleAccountDel.bind(this)

    this.state = {
      userid: props.userid,
      username: props.username,

      password: '',
      old_password: '',
      new_password: '',
      password_repeat: '',
      profileMessage: '',

    }
  } 
  handleInputChange(event){
    const { name, value} = event.target;
    this.setState({ [name]:value })
  }
  handleCardFocus(){
    this.props.funcCardFocus(this.state.userid);
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
      const todoRes = await doAjaxSending(loginRes.report.gettingTodos, 'GET', '');

      this.props.funcLoginProc(loginRes.report, todoRes.report);
    }catch(err){
      if(typeof err === 'string'){
        this.setState({ profileMessage: err })
      }else{
        console.log(err)
      }
    }

  }
  async handleLogOut(){
    try{
      const ajaxBody = '';
      const logoutRes = await doAjaxSending(this.props.userExtraDatas.logoutProfile, 'GET', ajaxBody)
      this.props.funcLogoutProc(this.state.userid)
      this.setState({ profileMessage: logoutRes.message });
    }catch(err){
      if(typeof err === 'string'){
        this.setState({ profileMessage: err.message });
      }else{
        console.log(err)
      }
    }
  }
  async handlePwdChange(){
    try{
      await pwdChangeInputRevise(this.state)
      const ajaxBody = smblPwdChangeDatas(
        this.state.old_password, this.state.new_password
      );
      const changeRes = doAjaxSending(this.props.loggedInUserExtraDatas.manageProfile,
         'POST', ajaxBody)
      if(!changeRes.error){
        this.setState({ 
          password: '', password_repeat: '',
          profileMessage: changeRes.message
        })
      }

    }catch(err){
      if(typeof err === 'string'){
        this.setState({ profileMessage: err.message})
      }else{
        console.log(err);
      }
    }

    
  }
  async handleAccountDel(){
    try{
      await deleteProfInputRevise(this.state)
      this.props.funcCardRemoval(this.state.old_password, this.state.userid);
    }catch(err){
      if(typeof err === 'string'){
        this.setState({ profileMessage: err.message})
      }else{
        console.log(err);
      }
    }
  }

  render(){

    const loggedOutContent = <DetailsLoggedOut
      pwd={this.state.password}
      funcInputChange={this.handleInputChange}

      funcLogin={this.handleLogin}
    />;      

    const loggedInContent = <DetailsLoggedIn
      datas={ typeof this.props.userExtraDatasAtReg ==='object'?
        this.props.userExtraDatasAtReg: ''}
      oldPwd={this.state.old_password}
      newPwd={this.state.new_pawwsord}
      repPwd={this.state.password_repeat}
      funcInputChange={this.handleInputChange}

      funcPwdChange={this.handlePwdChange}
      funcProfDel={this.handleAccountDel}
      funcLogOut={this.handleLogOut}
    />;

    const cardState = this.state.cardOnFocus? 
      'cardUserActive' : 'cardUserInactive'
    return (
      <div className={cardState}>
        <p onClick={this.handleCardFocus}>
          Username: <span className='profUsername'>{this.state.username}</span>
        </p>
        { this.props.cardOnFocus? 
            this.props.cardLoggedIn?  loggedInContent : loggedOutContent
            : ''
        }
        <p className='cardProfileMessage'>{this.state.profileMessage}</p>
      </div>
    )
  }
}

export default ProfileItem
