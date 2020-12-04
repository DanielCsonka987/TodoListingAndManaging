import React, { Component } from 'react';
import DetailsLoggedIn from './DetailsLoggedIn.js';
import DetailsLoggedOut from './DetailsLoggedOut.js';


class ProfileItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: this.props.username,
      userLoginPath: this.props.loginPath,

      // managed by funcLogin-funcLogout
      userFullname: props.fullname,
      userAge: props.age,
      userOccupation: props.occupation,
      userManagePath: props.manageProfile,
      userLogoutPath: props.logoutProfile,
      userError: '',
      userLoggedIn: false,

      userChangePwdPath: '',
      userDeletAccount: ''


    }
  }

  manageLogin(){

  }
  manageLogOut(){

  }
  managePwdChange(){

  }


  render(){
    return (
      <div className='profileItem'>
        <p>Username: <span className='profUsername'>{this.state.username}</span></p>

        { this.state.loginState ?
          <DetailsLoggedIn
            funcLogout={this.manageLogOut}
            funcChangePwd={this.managePwdChange}
            funcDelAccount={this.props.funcDelAccount}
          />
        :
          <DetailsLoggedOut
            funcLogin={this.manageLogin}
          />
        }

      </div>
    )
  }
}

export default ProfileItem
