import React, {Component} from 'react';
import FormInputUnit from './FormInputUnit.js';
import { regInputRevise } from '../../utils/inputRevise.js';

class RegisterForm extends Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.state ={
      username: '',
      password: '',
      password_repeat: '',
      first_name: '',
      last_name: '',
      age: '',
      occupation: '',

      registerMessage: ''
    }
  }

  componentDidCatch(error, info){
    console.log(error)
    console.log(info)
  }

  handleChange(event){
    const {name, value} = event.target;
    this.setState({ [name]: value })
  }

  handleClick(event){
    regInputRevise(this.state)
    .then(()=>{
      this.props.funcRegister(this.state)
    })
    .catch((error)=>{
      this.setState({registerMessage: error})
    })
  }

  render(){

    const errormesage= this.props.profileMessage ||
      this.state.registerMessage;
    //const errormesage= this.state.registerMessage;
    return (
      <div>
        <p className='cardTitle'>Filling the fields with * are required!</p>
        <FormInputUnit
          label='Username*:'
          type='text' name='username' id='usern'
          value={this.state.username}
          funcChange={this.handleChange}
        >
          It must be at least 4, at most 40 characters long,
            no symbols or space!
        </FormInputUnit>

        <FormInputUnit
          label='Password*:'
          type='password' name='password' id='pwd'
          value={this.state.password}
          funcChange={this.handleChange}
        >
          It must be at least 4, at most 40 characters long, 
            all characters permitted!
        </FormInputUnit>

        <FormInputUnit
          label='Password again*:'
          type='password' name='password_repeat' id='repeat'
          value={this.state.passpassword_repeatword}
          funcChange={this.handleChange}
        >
          It must be the same as in the password field!
        </FormInputUnit>

        <FormInputUnit
          label='Firstname*:'
          type='text' name='first_name' id='first'
          value={this.state.first_name}
          funcChange={this.handleChange}
        >
          It should be some characters, at most 80!
        </FormInputUnit>
        <FormInputUnit
          label='Lastname:'
          type='text' name='last_name' id='last'
          value={this.state.last_name}
          funcChange={this.handleChange}
        >
          It should be reasonable number, not mandatory!
        </FormInputUnit>

        <FormInputUnit
          label='Age:'
          type='number' name='age' id='age'
          value={this.state.age}
          funcChange={this.handleChange}
        >
          It should be reasonable number, not mandatory!
        </FormInputUnit>

        <FormInputUnit
          label='Occupation:'
          type='text' name='occupation' id='occup'
          value={this.state.age}
          funcChange={this.handleChange}
        >
          Not mandatory!
        </FormInputUnit>


        <p className='cardErrorMessage'>{errormesage}</p>

        <div className='userButtons'>
          <button onClick={this.handleClick}>
            Register</button>
        </div>
      </div>
    )
  }
}

export default RegisterForm
