import React, { Component } from 'react'

import DetailsLoggedIn from './DetailsLoggedIn'
import DetailsLoggedOut from './DetailsLoggedOut'

import { loginInputRevise, 
  pwdChangeInputRevise, 
  deleteProfInputRevise } 
  from '../../utils/inputRevise.js'

import { 
  doAjaxSending, 
  assembleLoginDatas, 
  assemblePwdChangeDatas } from '../../utils/apiMessenger.js'

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
      loginProfile: props.loginProfile,

      cardOnFocus: props.cardOnFocus,
      cardLoggedIn: props.cardLoggedIn,

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
    this.props.funcCardChoosing(this.state.userid);
  }

  handleLogin(){
    loginInputRevise(this.state)
    .then(()=>{
      const ajaxBody = assembleLoginDatas(this.state);
      doAjaxSending(this.state.loginProfile, 'POST', ajaxBody)
      .then((res)=>{

        doAjaxSending(this.props.userExtraDatas.gettingTodos, 'GET', '')
        .then(result=>{
          this.setState({ profileMessage: res.message })
          this.props.funcLoginProc(this.state.userid, this.result)
        })
        .catch(e=>{
          this.setState({profileProcessMessage: err})
        })
      })
      .catch(err=>{
        this.setState({profileProcessMessage: err})
      })
    })
    .catch((error)=>{
      this.setState({ profileMessage: error })
    })
    
  }
  handleLogOut(){
    doAjaxSending(this.props.userExtraDatas.logoutProfile, 'POST', ajaxBody)
    .then(res=>{
      this.props.funcLogoutProc(this.state.userid)
      this.setState({
        profileMessage: res.message,
        todos: {}
      });
    })
    .catch(error=>{
      this.setState({
        profileMessage: error.message,
      });
    })


  }
  handlePwdChange(){
    pwdChangeInputRevise(this.state)
    .then(()=>{
      const ajaxBody = assemblePwdChangeDatas(this.state);
      doAjaxSending(this.props.loggedInUserExtraDatas.manageProfile, 'POST', ajaxBody)
      .then(res=>{
      // -- server side process
        this.setState({ 
          password: '', password_repeat: '',
          profileMessage: res.message
        })
      }).catch(err=>{
        this.setState({ profileMessage: err.message})
      })
    })
    .catch((error)=>{
      this.setState({ profileMessage: error.message})
    })
  }
  handleAccountDel(){
    deleteProfInputRevise(this.state)
    .then(()=>{
      const datas = {userid: this.state.userid, old_password:  this.state.old_password}
      this.props.funcCardRemoval(datas);
    })
    .catch(error=>{
      this.setState({profileMessage: error})
    });
  }

  render(){

    const loggedOutContent =  <DetailsLoggedOut 
      funcInputChange={this.handleInputChange}

      funcLogin={this.handleLogin}
    />;      

    const loggedInContent = <DetailsLoggedIn
      datas={this.props.userExtraDatasAtReg}

      funcInputChange={this.handleInputChange}

      funcPwdChange={this.handlePwdChange}
      funcProfDel={this.handleAccountDel}
      funcLogOut={this.handleLogOut}
    />;

    const cardState = this.state.cardOnFocus? 'cardUserActive' : 'cardUserInactive'

    return (
      <div className={cardState} >

        <p onClick={ }>Username: <span className='profUsername'>
          {this.state.username}</span></p>

        { this.state.cardOnFocus? 
            this.state.cardLoggedIn ?
              loggedInContent : loggedOutContent
            : ''
        }
      <p className='cardProfileMessage'>{this.state.profileMessage}</p>
      </div>
    )
  }
}

export default ProfileItem
