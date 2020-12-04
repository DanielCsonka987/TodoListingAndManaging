import React, { Component } from 'react';
import ProfileItem from './ProfileItem.js';

class ProfileList extends Component {
  constructor(props){
    super(props);
  }

  manageDelAcc(){

  }


  render() {
    return (
      <div>
      <p>Accounts in the system:</p>
      {this.props.loadMessage? '': <p>{this.props.loadMessage}</p>}
      {this.props.profileContent.map((item) => {
        return <ProfileItem key={item.id}
          funcLogin={this.props.funcLogin}
          funcLogout={this.props.funcLogut}
          funcChangePwd={this.props.funcChangePwd}
          funcDelAccount={this.manageDelAcc}

          username={item.username}
          userLoginPath={item.loginProfile}
        />
      })
      }
    </div>
    )
  }
}

export default ProfileList
