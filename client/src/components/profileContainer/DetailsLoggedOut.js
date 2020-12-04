import React, {Component} from 'react';

class DetailsLoggedOut extends Component{
  constructor(props){
    super(props);
    this.state={
      password: ''
    }
  }

  processChange(event){
    const {value} = event.target;
    this.setState({password: value})
  }

  render(){
    return(
      <div>
        <p className='userDetail userPwdLine'>Password: <input type='password' onChange={this.processChange} />
        </p>
        <p className='cardErrorMessage'>{this.state.userError}</p>
        <div className='userButtons'>
          <button onClick={this.props.funcLogin.bind(this)}>Login</button>
        </div>
      </div>
    )
  }
}

export default DetailsLoggedOut
