import React, { Component } from 'react';
import ProfileItem from './ProfileItem.js';
import RegisterForm from './RegisterForm.js'

class ProfileList extends Component {
  constructor(props){
    super(props);
    this.handleUserLogin = this.handleUserLogin.bind(this)
    this.handleUserLogout = this.handleUserLogout.bind(this)
  }
  handleUserLogin(user, todos){
    this.props.funcLogin(user, todos)
  }
  handleUserLogout(){
    this.props.funcLogout()
  }
  render() {
    const loggedInUserId = typeof this.props.loggedUser === 'object' ?
      this.props.loggedUser.id : '';

    const regArea =   loggedInUserId? '' :
      <RegisterForm
        regServMsg={this.props.regServMsg}
        funcRegister={this.props.registerProfProc}
      />

    return (
      <div className='profileList wrapperColumHorCentVertUp'>

        { typeof this.props.loggedUser === 'object'? '' : regArea }

        <div className=''><p className='columnTitleText'>Accounts in the system:</p>
        {this.props.loadMessage? '': <p>{this.props.loadMessage}</p>}</div>
        {this.props.allProfilesContent.map((item, index) => {
          const isThisUserLoggedIn = loggedInUserId===item.id;
          return <ProfileItem key={index}
            userid={item.id}
            username={item.username}
            loginProfile={item.loginProfile}
            
            userExtraDatas={ isThisUserLoggedIn ? 
              this.props.loggedUser : '' }

            cardOnFocus={this.props.actCardFocus===item.id}
            cardNeedToInactivate={ (!isThisUserLoggedIn && loggedInUserId) }

            funcCardFocus={this.props.funcCartInFocus}
            funcLoginProc={this.handleUserLogin}
            funcLogoutProc={this.handleUserLogout}
            funcCardRemoval={this.props.funcCardRemoval}
          />
          })
        }
    </div>
    )
  }
}

export default ProfileList
