import React, {Component} from 'react';

class DetailsLoggedIn extends Component{
  constructor(props){
    super(props);
    this.state={
      userName: '',
      userAge: '',
      userOccupation: '',
    }
  }

  render(){
    return(
      <div>
        <p className='userDetail'>Fullname: {this.state.userName}</p>
        <p className='userDetail'>Age: {this.state.userAge}</p>
        <p className='userDetail'>Occupation: {this.state.userOccupation}</p>
        <p className='userDetail userPwdLine'> New password: <input type='password' onChange={this.registerPwd}/>
        </p>
        <p className='cardErrorMessage'>{this.state.userError}</p>
        <div className='userButtons'>
          <button onClick={this.props.funcPwdChange.bind(this, this.state)}>Change password</button>
          <button onClick={this.props.funcProfDel.bind(this, this.state)}>Delete accout</button>
          <button onClick={this.props.funcLogOut.bind(this, this.state)}>Logout</button>
        </div>
      </div>
    )
  }
}

export default DetailsLoggedIn
