import React, { Component } from 'react';
import ProfileItem from './ProfileItem.js';

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

    return (
      <div className='profileList'>
        <p className='titleText'>Accounts in the system:</p>
        {this.props.loadMessage? '': <p>{this.props.loadMessage}</p>}
        {this.props.allProfilesContent.map((item, index) => {
        const loggedId = typeof this.props.loggedUser === 'object' ?
          this.props.loggedUser.id : '';
         
          return <ProfileItem key={index}
            userid={item.id}
            username={item.username}
            loginProfile={item.loginProfile}
            
            userExtraDatas={ loggedId===item.id? 
              this.props.loggedUser : '' }

            cardOnFocus={this.props.actCardFocus===item.id}
            cardLoggedIn={loggedId !== ''}

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
