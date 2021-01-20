import './App.css';
import React, {Component} from 'react';
import Register from './components/generals/RegisterForm.js'
import ProfileList from './components/profileContainer/ProfileList.js';
import TodoList from './components/todoContainer/TodoList.js';
import AbourContent from ',/generals/AboutContent.js'
import ErrorHandler from './generals/ErrorHandler.js'

import { doAjaxSending, 
  assembleRegisDatas, 
  assembleProfileDeletDatas } from './utils/apiMessenger.js';
import { disconnect } from 'mongoose';

class App extends Component {
  constructor(){
    super()
    this.registerProc = this.registerProc.bind(this)
    this.removalProc = this.removalProc.bind(this)
    this.halndleLoginOccured = this.halndleLoginOccured(this);
    this.halndleLogoutOccured = this.halndleLogoutOccured(this);

    this.state = {
      loadMessage: '',
      aUserLoggedIn: false,
      loggedInUser: { },

      profiles: [],
      todos: {}
    }
  }

  componentDidMount(){
    doAjaxSending('/api', 'GET', '')
    .then(res=>{
      if(res.report.length === 0){
        this.setState({ loadMessage: res.message})
      }else{
        this.setState({profiles: res.report });
      }
    })
    .catch(err=>{
      console.log(err.report)
      this.setState({ loadMessage: err.message })
    })
  }
  halndleLoginOccured(todos){
    this.setState({
      aUserLoggedIn: datas.id,
      loggedInUser: datas,
      todos: todos
    })
  }
  halndleLogoutOccured(){

    // -- remove profile element

    this.setState({
      aUserLoggedIn: false,
      loggedInUser: {},
      todos: {}
    })
  }
  registerProc(datas){
    const ajaxBody = assembleRegisDatas(datas);
    doAjaxSending('/api/register', 'POST', ajaxBody)
    .then(res=>{
      const newUser = {
        id: res.report.id,
        username: datas.username,
        loginProfile: res.report.loginProfile
      }
      // -- adding new user to pool --

      const loginUserInfos ={
        fullname: res.report.fullname,
        age: res.report.age,
        occupation: res.report.occupation,
        manageProfile: res.report.manageProfile,
        logoutProfile: res.report.logoutProfile,
        gettingTodos: res.report.gettingTodos
      }

      this.setState({
        aUserLoggedIn: res.report.id,
        loggedInUser: loginUserInfos,
        todos: {
          message: 'No todos in system yet!'
        }
    })
    })
    .catch(err=>{
      this.setState({registerMessage: err.message});
    });

    
  }
  removalProc(datas){
    const ajaxBody = assembleProfileDeletDatas(datas)
    doAjaxSending(this.state.loggedInUser.manageProfile, 'DELETE', ajaxBody)
    .then(res=>{
      
    // -- user removal at profiles pool --

      this.setState({ 
        loadMessage: res.message,
        aUserLoggedIn: false,
        loggedInUser: {} 
      })
    }).catch(error=>{
      this.setState({ loadMessage: error.message })
    })
  }

  render(){

    let regArea, sideAreaContent = '';
    if(this.state.aUserLoggedIn){
      regArea = 
        <ErrorHandler location='register area'>
          <Register
            funcRegister={this.registerProc}
          />
        </ErrorHandler>
      sideAreaContent = <AbourContent />
    } else {
      sideAreaContent = <TodoList todoContent={this.state.todos} />
    }

    return (
      <div className="App">
        <header className="">
          <p>
            
          </p>
        </header>
        <main className='mainApp'>
          <ErrorHandler location='main area' >
            { regArea }
            <ErrorHandler location='profile area'>
              <ProfileList
                loadMessage={this.state.loadMessage}
                allProfilesContent={this.state.profiles}
                loggedInUser={this.state.loggedInUser}

                funcUserChooseUserCard={this.userChosenUserCard}
              />
              { sideAreaContent }
            </ErrorHandler>
          </ErrorHandler>
        </main>
        <footer>

        </footer>
      </div>
    );
  }
}

export default App;
