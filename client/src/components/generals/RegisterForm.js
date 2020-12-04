import React, {Component} from 'react';

class RegisterForm extends Component{
  constructor(props){
    super(props);
    this.state ={
      username: '',
      password: '',
      password_repeat: '',
      first_name: '',
      last_name: '',
      age: '',
      occupation: '',

      informMessage: ''
    }
  }

  changeProcess(event){
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  componentDidUpdate(prevProps, prevState){

  }

  chamgeErrorMessage(){

  }
  render(){
    return (
      <div>
        <p className='cardTitle'>Filling the fields with * are required!</p>
        <p>Username*:
          <input type='text' name='username'
          onChange={this.changeProcess.bind(this)}
          value={this.state.username} />
          <span className='hiddenInformation'>
          It must be at least 4, at most 40 characters long,
           no symbols or space!</span>
           </p>
        <p>Password*:
          <input type='password' name='password'
          onChange={this.changeProcess.bind(this)}
          value={this.state.password} />
          <span className='hiddenInformation'>
          It must be at least 4, at most 40 characters long,
           all characters permitted!</span>
          </p>
        <p>Password again*:
          <input type='password' name='password_repeat'
           onChange={this.changeProcess.bind(this)}
           value={this.state.password_repeat}/>
           <span className='hiddenInformation'>
           It must be the same as in the password field!</span>
           </p>
        <p>Firstname*:
          <input type='text' name='first_name'
          onChange={this.changeProcess.bind(this)}
          value={this.state.first_name}/>
          <span className='hiddenInformation'>
          It should be some characters, at most 80!</span>
          </p>
        <p>Lastname:
          <input type='text' name='last_name'
          onChange={this.changeProcess.bind(this)}
          value={this.state.last_name}/></p>
        <p>Age:
          <input type='text' name='age'
          onChange={this.changeProcess.bind(this)}
          value={this.state.age}/>
          <span className='hiddenInformation'>
          It should be reasonable number, not mandatory!</span>
          </p>
        <p>Occupation:
          <input type='text' name='occupation'
          onChange={this.changeProcess.bind(this)}
          value={this.state.occupation}/>
          </p>

        {this.state.informMessge? <p className='cardErrorMessage'>
          {this.state.informMessge}</p> : ''}

        <div className='userButtons'>
          <button onClick={this.props.funcRegister.bind(this, this.state)}>
            Register</button>
        </div>
      </div>
    )
  }
}

export default RegisterForm
