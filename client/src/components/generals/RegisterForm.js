import React, {Component} from 'react';
import FormInputUnit from './FormInputUnit.js';
import { regInputRevise } from '../../utils/inputRevise.js';

class RegisterForm extends Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleRegisterClick = this.handleRegisterClick.bind(this)
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

  async handleRegisterClick(){
    try{
      await regInputRevise(this.state)
      console.log('Its not error')
      //this.props.funcRegister(this.state)
      
    }catch(err){
      console.log('Its error')
      this.setState({registerMessage: err})
    }
  }

  render(){

    let errormessages = '';
    if(this.state.registerMessage.length > 0){
      errormessages = this.state.registerMessage.map((item, index)=>{
        return <div className=''>
          <p className=''>item.msg</p><a href={`#${item.field}`}>Jump there!</a>
        </div>
      })
    }else{
      errormessages = this.props.regServMsg
    }

    //const errormessages= this.state.registerMessage;
    return (
      <div>
        <p className='cardTitle'>Filling the fields with * are required!</p>
        <FormInputUnit
          label='Username*:'
          type='text' name='username' id='username'
          value={this.state.username}
          funcChange={this.handleChange}
        >
          It must be at least 4, at most 40 characters long,
            no symbols or space!
        </FormInputUnit>

        <FormInputUnit
          label='Password*:'
          type='password' name='password' id='password'
          value={this.state.password}
          funcChange={this.handleChange}
        >
          It must be at least 4, at most 40 characters long, 
            all characters permitted!
        </FormInputUnit>

        <FormInputUnit
          label='Password again*:'
          type='password' name='password_repeat' id='password_repeat'
          value={this.state.passpassword_repeatword}
          funcChange={this.handleChange}
        >
          It must be the same as in the password field!
        </FormInputUnit>

        <FormInputUnit
          label='Firstname*:'
          type='text' name='first_name' id='first_name'
          value={this.state.first_name}
          funcChange={this.handleChange}
        >
          It should be some characters, at most 80!
        </FormInputUnit>
        <FormInputUnit
          label='Lastname:'
          type='text' name='last_name' id='last_name'
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
          type='text' name='occupation' id='occupation'
          value={this.state.occupation}
          funcChange={this.handleChange}
        >
          Not mandatory!
        </FormInputUnit>


        <p className='cardErrorMessage'>{errormessages}</p>

        <div className='userButtons'>
          <button onClick={this.handleRegisterClick}>
            Register</button>
        </div>
      </div>
    )
  }
}

export default RegisterForm
