import React, {Component} from 'react';
import FormInputUnit from '../generals/FormInputUnit.js';
import ShowMessages from '../generals/ShowMessages'
import ButtonWithIcon from '../generals/ButtonWithIcon'
import CardTileTextAndContent from '../generals/CardTileTextAndContent'

import interpretProblems from '../../utils/interpretProblems'
import { regInputRevise } from '../../utils/inputRevise.js';

class RegisterForm extends Component{
  constructor(props){
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFormToggle = this.handleFormToggle.bind(this)
    this.handleAPIError = this.handleAPIError.bind(this)
    this.handleRegisterClick = this.handleRegisterClick.bind(this)
    this.state ={
      username: '',
      password: '',
      password_repeat: '',
      first_name: '',
      last_name: '',
      age: '',
      occupation: '',

      registerMessage: '',
      areaVisibilityIsNeeded: false
    }
  }

  componentDidCatch(error, info){
    console.log(error)
    console.log(info)
  }

  handleFormToggle(e){
    if(e.type === 'keypress' && (e.code === 'Space' || e.code === 'Enter')){
      this.setState({ areaVisibilityIsNeeded: !this.state.areaVisibilityIsNeeded })
    }
    if(e.type==='click'){
      this.setState({ areaVisibilityIsNeeded: !this.state.areaVisibilityIsNeeded })
    }
  }

  handleInputChange(event){
    const {name, value} = event.target;
    this.setState({ [name]: value })
  }
  handleAPIError(err){
    interpretProblems(err, 'registerMessage', this.handleInputChange)
  }
  async handleRegisterClick(){
    try{
      await regInputRevise(this.state)
      this.props.funcRegister(this.state)
      this.setState({ 
        username: '',
        password: '',
        password_repeat: '',
        first_name: '',
        last_name: '',
        age: '',
        occupation: '',
        registerMessage: '' 
      })
    }catch(err){
      this.handleAPIError(err)
    }
  }

  render(){

    const errormessages = <ShowMessages 
      messageContent={this.state.registerMessage} />;

    const theRegistrationFrom = <>
        <p className='cardExlpanation'>Filling the fields with * are required!</p>
        <div className='profileInputContainer'>
          <FormInputUnit
            label='Username*:'
            type='text' name='username' id='username'
            value={this.state.username}
            funcChange={this.handleInputChange}
          >
            It must be at least 4, at most 40 characters long,
              no symbols or space!
          </FormInputUnit>

          <FormInputUnit
            label='Password*:'
            type='password' name='password' id='password'
            value={this.state.password}
            funcChange={this.handleInputChange}
          >
            It must be at least 4, at most 40 characters long, 
              all characters permitted!
          </FormInputUnit>

          <FormInputUnit
            label='Password again*:'
            type='password' name='password_repeat' id='password_repeat'
            value={this.state.password_repeat}
            funcChange={this.handleInputChange}
          >
            It must be the same as in the password field!
          </FormInputUnit>

          <FormInputUnit
            label='Firstname*:'
            type='text' name='first_name' id='first_name'
            value={this.state.first_name}
            funcChange={this.handleInputChange}
          >
            It should be some characters, at most 80!
          </FormInputUnit>
          <FormInputUnit
            label='Lastname:'
            type='text' name='last_name' id='last_name'
            value={this.state.last_name}
            funcChange={this.handleInputChange}
          >
            Not mandatory!
          </FormInputUnit>

          <FormInputUnit
            label='Age:'
            type='number' name='age' id='age'
            value={this.state.age}
            funcChange={this.handleInputChange}
          >
            It should be reasonable number, not mandatory!
          </FormInputUnit>

          <FormInputUnit
            label='Occupation:'
            type='text' name='occupation' id='occupation'
            value={this.state.occupation}
            funcChange={this.handleInputChange}
          >
            Not mandatory!
          </FormInputUnit>
        </div>
        <div className='cardErrorMessage'>{errormessages}</div>

        <div className='buttonGroupWrapper'>
          <ButtonWithIcon
            wrapperBlockClasses=' btnCreate'  iconDef='send'
            funcClickActivity={this.handleRegisterClick}
          >Registration</ButtonWithIcon>

        </div>
    </>;

    return (
      <CardTileTextAndContent
        wrapperBlockClasses='wrapperColumnAllCenter'
        wrapperInlineClasses='clickable'
        funcKeyPressActivity={this.handleFormToggle}
        funcClickActivity={this.handleFormToggle}
        tabIndexing='0' iconDef='person_add' tileText='Registration'
      >
        { this.state.areaVisibilityIsNeeded? theRegistrationFrom: '' }
      </CardTileTextAndContent>
    )
  }
}

export default RegisterForm
