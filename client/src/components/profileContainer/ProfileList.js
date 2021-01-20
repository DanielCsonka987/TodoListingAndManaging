import React, { Component } from 'react';
import ProfileItem from './ProfileItem.js';

class ProfileList extends Component {
  constructor(props){
    super(props);

    this.handleCardFocus = this.handleCardFocus.bind(this)
    this.handleUserLogin = this.handleUserLogin.bind(this)
    this.handleUserLogout = this.handleUserLogout.bind(this)

    this.state = {
      cardOnFocus: -1,
      cardLoggedIn: -1
    }
  }

  handleCardFocus(userid){
    this.setState({ cardOnFocus: userid })
  }

  handleUserLogin(userid, todos){
    this.setState({ cardLoggedIn: userid})
    this.props.halndleLoginOccured(todos)
  }
  handleUserLogout(){
    this.setState({cardLoggedIn: -1})
    this.props.halndleLogoutOccured()
  }
  render() {

    return (
      <div className='profileList'>
        <p className='titleText'>Accounts in the system:</p>
        {this.props.loadMessage? '': <p>{this.props.loadMessage}</p>}
        {this.props.allProfilesContent.map((item, index) => {
          
          const isThisInFocus = this.cardOnFocus===item.id
          const isThisLoggedIn = this.cardLoggedIn===item.id
          return <ProfileItem key={index}
            userid={item.id}
            username={item.username}
            loginProfile={item.loginProfile}
            userExtraDatas={ isThisLoggedIn? 
              this.props.loggedInUser: ''}

            cardOnFocus={isThisInFocus}
            cardLoggedIn={isThisLoggedIn}

            funcCardChoosing={this.handleCardFocus}
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
