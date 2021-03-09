import './styles/layout.css';
import './styles/fashion.css'
import React, {Component} from 'react';
import ProfileList from './components/profileContainer/ProfileList.js';
import TodoList from './components/todoContainer/TodoList.js';
import AbourContent from './components/generals/AboutContent.js'
import Header from './components/generals/Header'
import ErrorHandler from './components/generals/ErrorHandler.js'

import interpretSessionStore from './utils/interpretSessionStore'
import interpretProblems from './utils/interpretProblems'
import { doAjaxSending, 
  smblRegisDatas, smblProfDeletDatas, smblNewTodoDatas, smblStateChangeTodoDatas, 
  smblNotationChangeTodoDatas } from './utils/apiMessenger.js';

class App extends Component {
  constructor(props){
    super()
    this.handleCardFocus = this.handleCardFocus.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleAPIError = this.handleAPIError.bind(this)
    
    this.registerProfProc = this.registerProfProc.bind(this);
    this.removeProfProc = this.removeProfProc.bind(this);

    this.handleLoginProc = this.handleLoginProc.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.todoAdditionProc = this.todoAdditionProc.bind(this)
    this.todoStatusChangeProc = this.todoStatusChangeProc.bind(this);
    this.todoNoteChangeProc = this.todoNoteChangeProc.bind(this);
    this.todoRemoveProc = this.todoRemoveProc.bind(this)
    this.todoStateChangeProcess = this.todoStateChangeProcess.bind(this)


    this.state = {
      loadMessage: '',
      registerServerMessage: '',
      todoMessage: {ident: -1, msg: ''},
      
      cardOnFocusId: -1,

      loggedUser: '',
      profiles: [],
      todos: ''
    }
  }
  
  componentDidCatch(error, info){
    console.log(error)
    console.log(info)
  }
  handleInputChange(event){
    const { name, value } = event.target;
    this.setState({ [name]: value})
  }
  handleAPIError(err){
    interpretProblems(err, 'loadMessage', this.handleInputChange)
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

          //APP STATE RESTORATION - details of LoggedInUser restoration
          await interpretSessionStore(profLogIdRev.report,
             'loggedUser', this.handleInputChange)

          if(this.state.loggedUser.id === profLogIdRev.report.getUserId){
            const refreshTodos = await doAjaxSending(
              this.state.loggedUser.getAddTodos, 'GET', '')

            this.setState({
              cardOnFocusId: profLogIdRev.report.getUserId,
              todos: refreshTodos.report
            })
          }else{  // NO MATCH BETWEEN ID OF COOKIE AND SESSION
            this.handleLogout();
          }
        }
      }
      
    }catch(err){
      this.handleAPIError(err)
    }
  }
  handleCardFocus(userid){
    if(this.state.loggedUser === ''){
      this.setState({ 
        cardOnFocusId: userid === this.state.cardOnFocusId?
         '' : userid})
    }
    // ProfileItem / TodoItem messages needs to be ersed!

  }

  // LOGIN-OUT EVENTS, PROCESSES //
  async handleLoginProc(user, todos){
    this.setState({
      loggedUser: user,
      todos: todos,
      todoMessage: {ident: -1, msg: 'Content loaded!'}
    })
    interpretSessionStore(user);
  }
  async handleLogout(){
    this.setState({
      loggedUser: '',
      todos: '',
      todoMessage: {ident: '', msg: ''},
    })
    interpretSessionStore();
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
          id: profRegRes.report.id,
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
          todos: {},
          registerServerMessage: ''
        })
        await interpretSessionStore(loginUserInfos);
      }
    }catch(err){
      this.handleAPIError(err)
    }
  }
  async removeProfProc(pwd, profid){
    try{
      const ajaxBody = smblProfDeletDatas(pwd)
      const profDelRes = await doAjaxSending(this.state.loggedUser.manageProfile,
        'DELETE', ajaxBody)
      if(profDelRes.report.profile){
        this.setState({ 
          profiles: [...this.state.profiles.filter(p=>p.id!==profid)],
          loadMessage: profDelRes.message,
          loggedUser: ''
        })
        await interpretSessionStore();
      }
    }catch(err){
      this.handleAPIError(err)
    }
  }


  // TODO EVENTs, PROCESSES //
  async todoAdditionProc(todoDatas){
    try{
      const ajaxBody = smblNewTodoDatas(todoDatas)
      const todoRegRes = await doAjaxSending(
        this.state.loggedUser.getAddTodos,
        'POST', ajaxBody)
      if(todoRegRes){
        this.todoStateChangeProcess(1, todoRegRes.report, todoRegRes.message)
      }
    }catch(err){
      interpretProblems(err, 'todoMessage', this.handleInputChange)
    }
  }
  async todoStatusChangeProc(url, value){
    try{
      const ajaxBody = smblStateChangeTodoDatas(value);
      const ajaxTodoStatusRes = await doAjaxSending(url, 'PUT', ajaxBody)
      const todoUnderProcRes = this.state.todos.filter(item=>
        item.id === ajaxTodoStatusRes.report.todo);
      if(todoUnderProcRes){
        todoUnderProcRes[0].status = ajaxTodoStatusRes.report.outcome;
        this.todoStateChangeProcess(0, todoUnderProcRes[0], 
          ajaxTodoStatusRes.message)
      }
    }catch(err){
      interpretProblems(err, 'todoMessage', this.handleInputChange)
    }
  }
  async todoNoteChangeProc(url, todoDatas){
    try{
      const ajaxBody = smblNotationChangeTodoDatas(todoDatas);
      const ajaxTodoNoteRes = await doAjaxSending(url, 'PUT', ajaxBody)
      const todoUnderProcRes = this.state.todos.filter(item=>
        item.id === ajaxTodoNoteRes.report.todo)
      if(todoUnderProcRes){
        todoUnderProcRes[0].notation = ajaxTodoNoteRes.report.outcome;
        this.todoStateChangeProcess(0, todoUnderProcRes[0],
           ajaxTodoNoteRes.message)
      }
    }catch(err){
      interpretProblems(err, 'todoMessage', this.handleInputChange)
    }
  }
  async todoRemoveProc(url, todoId){
    try{
      const ajaxTodoDeleteRes = await doAjaxSending(url, 'DELETE', '');
      if(ajaxTodoDeleteRes.report.todo){
        this.todoStateChangeProcess(-1, { id: todoId }, ajaxTodoDeleteRes.message)
      }
    }catch(err){
      interpretProblems(err, 'todoMessage', this.handleInputChange)
    }
  }

  // -1 removal, 0 replace, 1 addition
  async todoStateChangeProcess(process, content, msg){
    const msgId = process >-1 ? content.id : -1
    if(process === 0 || process === -1){
      await this.setState({
        todos: [...this.state.todos.filter(item=>item.id !== content.id)]
      })
    }
    if(process === 0 || process === 1){
      await this.setState({
        todos: [...this.state.todos, content]
      })
    }
    await this.setState({
      todoMessage: { 
        ident: msgId ? msgId : -1, 
        msg: msg }
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
      
      sideAreaContent = <AbourContent />
    }
 
    return (
      <div className="appContainer">
        <Header />
        <main className='mainApp'>
          <ErrorHandler location='main area' >

            <ErrorHandler location='profile area'>
              <ProfileList
                loadMessage={this.state.loadMessage}
                allProfilesContent={this.state.profiles}
                loggedUser={this.state.loggedUser}
                regServMsg={this.state.registerServerMessage}

                actCardFocus={this.state.cardOnFocusId}
                funcCartInFocus={this.handleCardFocus}
                funcRegister={this.registerProfProc}

                funcCardRemoval = {this.removeProfProc}
                funcLogin = {this.handleLoginProc}
                funcLogout = {this.handleLogout}
              />
              { sideAreaContent }
            </ErrorHandler>
          </ErrorHandler>
        </main>
        <footer className='footerApp blackBackgr'>

        </footer>
      </div>
    );
  }
}

export default App;
