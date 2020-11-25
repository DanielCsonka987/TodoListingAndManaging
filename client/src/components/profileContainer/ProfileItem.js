import React, { Component } from 'react';
// import LoggedInInput from 'LoggedInInput.js';
// import LoggedOutImput from 'LoggedOutImput.js';


class ProfileItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: this.props.username,
      // userFullname: props.fullname,
      // userAge: props.age,
      // userOccupation: props.occupation,
      // userManagePath: props.manageProfile,
      // userLogoutPath: props.logoutProfile,

      userLoginPath: this.props.loginPath,
      typedPassword: '',

      userLoggedIn: this.props.loginState,
      userError: ''
    }
  }

  registerPwd(event){
    const {value} = event.target;
    this.setState( { typedPassword: value })
  }


  render(){
    return (
      <div className='profileItem'>
        <p>Username: <span className='profUsername'>{this.state.username}</span></p>

        { this.state.loginState ?
          <div>
            <p className='userDetail'>Fullname: {this.state.userName}</p>
            <p className='userDetail'>Age: {this.state.userAge}</p>
            <p className='userDetail'>Occupation: {this.state.userOccupation}</p>
            <p classNAme='userDetail userPwdLine'> New password: <input type='password' onChange={this.registerPwd}/>
            </p>
            <p classname='userError'>{this.state.userError}</p>
            <div className='userButtons'>
              <button onClick={this.props.funcPwdChange.bind(this, this.state)}>Change password</button>
              <button onClick={this.props.funcProfDel.bind(this, this.state)}>Delete accout</button>
              <button onClick={this.props.funcLogOut.bind(this, this.state)}>Logout</button>
            </div>
          </div>
        :
        <div>
          <p className='userDetail userPwdLine'>Password: <input type='password' onChange={this.registerPwd} />
          </p>
          <p classname='userError'>{this.state.userError}</p>
          <div className='userButtons'>
            <button onClick={this.props.funcLogin.bind(this, this.state)}>Login</button>
          </div>
        </div>
        }

      </div>
    )
  }
}

export default ProfileItem
