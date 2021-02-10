import './App.css';
import React, {Component} from 'react';
import RegisterForm from './components/generals/RegisterForm.js'
import ProfileList from './components/profileContainer/ProfileList.js';
import TodoList from './components/todoContainer/TodoList.js';
import AbourContent from './components/generals/AboutContent.js'
import ErrorHandler from './components/generals/ErrorHandler.js'

import { doAjaxSending, 
  smblRegisDatas, smblProfDeletDatas, smblNewTodoDatas,
  smblStateChangeTodoDatas, smblNotationChangeTodoDatas  } from './utils/apiMessenger.js';

class App extends Component {
  constructor(props){
    super()
    this.handleCardFocus = this.handleCardFocus.bind(this)
    this.saveDatasToLocalSession = this.saveDatasToLocalSession.bind(this)
    this.removeLocalSession = this.removeLocalSession.bind(this)
    
    this.registerProfProc = this.registerProfProc.bind(this);
    this.removeProfProc = this.removeProfProc.bind(this);

    this.handleLoginProc = this.handleLoginProc.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.todoAdditionProc = this.todoAdditionProc.bind(this)
    this.todoStatusChangeProc = this.todoStatusChangeProc.bind(this);
    this.todoNoteChangeProc = this.todoNoteChangeProc.bind(this);
    this.todoRemoveProc = this.todoRemoveProc.bind(this)
    this.removeTodoFromList = this.removeTodoFromList.bind(this)
    this.addTodoToList = this.addTodoToList.bind(this)
    this.changeTodoMessage = this.changeTodoMessage.bind(this);

    this.state = {
      loadMessage: '',
      loggedUser: '',
      profiles: [],

      cardOnFocusId: -1,

      todoMessage: {ident: '', msg: ''},
      todos: ''
    }
  }

  async componentDidMount(){
    try{
      const systemProfiles = await doAjaxSending('/api', 'GET', '');
      if(systemProfiles.report.length === 0){
        this.setState({ loadMessage: systemProfiles.message})
      }else{
        this.setState({profiles: systemProfiles.report });

        // REVISE LOGGED IN STATUS AND REGENERATE IN NEED
        const profLogIdRev = await doAjaxSending('/api/revise', 'GET', '');
        if(profLogIdRev.report.loggedInState){
          const userDet = await {
            id: sessionStorage.getItem('profId'),
            fullname: sessionStorage.getItem('profFullname'),
            age: sessionStorage.getItem('profAge'),
            occupation: sessionStorage.getItem('profOccup'),
            manageProfile: sessionStorage.getItem('profManage'),
            logoutProfile: sessionStorage.getItem('profLogout'),
            getAddTodos: sessionStorage.getItem('profTodos')
          }
          if(userDet.id === profLogIdRev.report.getUserId){
            const refreshTodos = await doAjaxSending(userDet.getAddTodos, 'GET', '')
            this.setState({
              cardOnFocusId: userDet.id,
              loggedUser: userDet,
              todos: refreshTodos.report
            });
          } else{
            this.handleLogout()
          }
        }
      }
      
    }catch(err){
      if(err){
        this.setState({ loadMessage: err.message })
      }else{
        this.setState({ loadMessage: 'No server online!' })
      }
    }
  }
  handleCardFocus(userid){
    if(this.state.loggedUser === ''){
      this.setState({ 
        cardOnFocusId: userid === this.state.cardOnFocusId?
         '' : userid})
    }
  }

  // LOGIN-OUT EVENTS, PROCESSES //
  handleLoginProc(user, todos){
    this.setState({
      loggedUser: user,
      todos: todos,
      todoMessage: {ident: -1, msg: 'Content loaded!'}
    })
    this.saveDatasToLocalSession(user);
  }
  handleLogout(){
    this.setState({
      loggedUser: '',
      todos: '',
      todoMessage: {ident: '', msg: ''},
    })
    this.removeLocalSession()
  }
  saveDatasToLocalSession(datas){
    sessionStorage.setItem('profId', datas.id);
    sessionStorage.setItem('profFullname', datas.fullname)
    sessionStorage.setItem('profAge', datas.age)
    sessionStorage.setItem('profOccup', datas.occupation)
    sessionStorage.setItem('profManage', datas.manageProfile)
    sessionStorage.setItem('profLogout', datas.logoutProfile)
    sessionStorage.setItem('profTodos', datas.getAddTodos)

  }
  removeLocalSession(){
    sessionStorage.removeItem('profId')
    sessionStorage.removeItem('profFullname')
    sessionStorage.removeItem('profAge')
    sessionStorage.removeItem('profOccup')
    sessionStorage.removeItem('profManage')
    sessionStorage.removeItem('profLogout')
    sessionStorage.removeItem('profTodos')
  }

  // PROFILE EVENTS, PROCESSES //
  async registerProfProc(datas){
    try{
      const ajaxBody = smblRegisDatas(datas);
      const profRegRes = await doAjaxSending('/api/register', 'POST', ajaxBody)
      if(profRegRes){
        const newUserToList = {
          id: profRegRes.report.id,
          username: datas.username,
          loginProfile: profRegRes.report.loginProfile
        }
        const loginUserInfos ={
          fullname: profRegRes.report.fullname,
          age: profRegRes.report.age,
          occupation: profRegRes.report.occupation,
          manageProfile: profRegRes.report.manageProfile,
          logoutProfile: profRegRes.report.logoutProfile,
          getAddTodos: profRegRes.report.getAddTodos
        }
  
        this.setState({
          profiles: [...this.state.profiles, newUserToList],
          cardOnFocusId: newUserToList.id,
          loggedUser: loginUserInfos,
          todos: {}
        })
      }
    }catch(err){
      if(err.involvedId){
        err.involvedId.msg = err.message
        this.setState({registerServerMessage: err.involvedId}); 
      }
      this.setState({registerServerMessage: err.message}); 
    }
  }
  async removeProfProc(pwd, profid){
    try{
      const ajaxBody = smblProfDeletDatas(pwd)
      const profDelRes = await doAjaxSending(this.state.loggedUser.manageProfile,
        'DELETE', ajaxBody)
      if(profDelRes.report.profile){
        this.setState({ 
          profiles: [...this.state.profiles.filter(p=>p.id===profid.id)],
          loadMessage: profDelRes.message,
          loggedUser: ''
        })
      }
    }catch(err){
      if(typeof err === 'string'){
        this.setState({ loadMessage: err.message })
      }else{
        console.log(err)
      }
    }
  }


  // TODO EVENTs, PROCESSES //
  async todoAdditionProc(todoDatas){
    try{
      const ajaxBody = smblNewTodoDatas(todoDatas)
      const todoRegRes = await doAjaxSending(
        this.state.loggedUser.getAddTodos,
        'POST', ajaxBody)
      this.setState({
        todos: [ ...this.state.todos, todoRegRes.report ],
        todoMessage: { ident: '', msg: todoRegRes.message }
      }) 
    }catch(err){
      if(typeof err.message === 'string'){
        this.setState({ todoMessage: err.message })
      }else{
        console.log(err)
      }
    }
  }
  async todoStatusChangeProc(url, todoDatas){
    try{
      const ajaxBody = smblStateChangeTodoDatas(todoDatas);
      const ajaxTodoStatusRes = await doAjaxSending(url, 'PUT', ajaxBody)
      const underProc = this.state.todos.filter(item=>
        item.id === ajaxTodoStatusRes.report.todo);
      if(underProc){
        underProc.status = ajaxTodoStatusRes.report.outcome;
        this.removeTodoFromList(underProc.id)
        this.addTodoToList(underProc, ajaxTodoStatusRes);
      }
      
    }catch(err){
      this.changeTodoMessage(todoDatas.id, 'Error happened!')
    }

  }
  async todoNoteChangeProc(url, todoDatas){
    try{
      const ajaxBody = smblNotationChangeTodoDatas(todoDatas);
      const ajaxTodoNoteRes = await doAjaxSending(url, 'PUT', ajaxBody)
      const underProc = this.state.todos.flter(item=>
        item.id === ajaxTodoNoteRes.report.todo)
      if(underProc){
        underProc.notation = ajaxTodoNoteRes.report.outcome;
        this.removeTodoFromList(underProc.id)
        this.addTodoToList(underProc, ajaxTodoNoteRes);
      }
    }catch(err){
      this.changeTodoMessage(todoDatas.id, 'Error happened!')
    }
  }
  async todoRemoveProc(url, todoid){
    try{
      const ajaxTodoDeleteRes = await doAjaxSending(url, 'DELETE', '');
      if(ajaxTodoDeleteRes.report.todo){
        this.removeTodoFromList(ajaxTodoDeleteRes.report.todo)
        this.changeTodoMessge(ajaxTodoDeleteRes);
      }
    }catch(err){
      this.changeTodoMessage(todoid, 'Error happened!')
    }
  }
  removeTodoFromList(todoid, ajaxResObj){
    this.setState({
      todos: [...this.state.todos.filter(item=>item.id !== todoid)],
      todoMessage: { 
        ident: ajaxResObj.report.todo, 
        msg: ajaxResObj.message 
      } 
    })
  }
  addTodoToList(todo, ajaxResObj){
    this.setState({
      todos: [...this.state.todos, todo],
      todoMessage: { 
        ident: ajaxResObj.report.todo, 
        msg: ajaxResObj.message 
      } 
    })
  }
  changeTodoMessage(id, msg){
    this.setState({
      todoMessage: { ident: id, msg: msg }
    })
  }

  render(){
    let regArea, sideAreaContent = '';
    if(typeof this.state.loggedUser === 'object'){

      sideAreaContent = <TodoList
        userid={this.state.loggedUser.id}
        todoContent={this.state.todos}
        todoMessage={this.state.todoMessage}
        funcTodoSave={this.todoAdditionProc}
        funcStatusEdit={this.todoStatusChangeProc}
        funcNoteEdit={this.todoNoteChangeProc}
        funcTodoRemove={this.todoRemoveProc}
      />
    } else {
      
      regArea = 
        <ErrorHandler location='register area'>
          <RegisterForm
            regServMsg={this.state.registerServerMessage}
            funcRegister={this.registerProfProc}
          />
        </ErrorHandler>
      sideAreaContent = <AbourContent />
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
                loggedUser={this.state.loggedUser}

                actCardFocus={this.state.cardOnFocusId}
                funcCartInFocus={this.handleCardFocus}

                funcCardRemoval = {this.removeProfProc}
                funcLogin = {this.handleLoginProc}
                funcLogout = {this.handleLogout}
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
