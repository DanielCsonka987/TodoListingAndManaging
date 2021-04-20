import './styles/modernLayout.css';
import './styles/olderLayout.css';
import './styles/fashion.css'
import React, {Component} from 'react';
import ProfileList from './components/profileContainer/ProfileList.js';
import TodoList from './components/todoContainer/TodoList.js';
import AbourContent from './components/generals/AboutContent.js'
import Header from './components/generals/Header'
import ErrorHandler from './components/generals/ErrorHandler.js'

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
    
    this.handleLoginProc = this.handleLoginProc.bind(this);
    this.handleLogoutProc = this.handleLogoutProc.bind(this);
    this.handleRelogProc = this.handleRelogProc.bind(this)

    this.readBackSessionStoreage = this.readBackSessionStoreage.bind(this)
    this.fillInSessionStore = this.fillInSessionStore.bind(this)
    this.emptySessionStore = this.emptySessionStore.bind(this)

    this.registerProfProc = this.registerProfProc.bind(this);
    this.removeProfProc = this.removeProfProc.bind(this);

    this.todoAdditionProc = this.todoAdditionProc.bind(this)
    this.todoStatusChangeProc = this.todoStatusChangeProc.bind(this);
    this.todoNoteChangeProc = this.todoNoteChangeProc.bind(this);
    this.todoRemoveProc = this.todoRemoveProc.bind(this)
    this.todoStateChangeProcess = this.todoStateChangeProcess.bind(this)


    this.state = {
      loadMessage: '',
      registerServerMessage: '',
      todoListMessage: {ident: -1, msg: ''},
      
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
      const systemProfiles = await doAjaxSending('/profile/', 'GET', '');
      console.log(systemProfiles)
      
      if(systemProfiles.report.length === 0){
        this.setState({ loadMessage: systemProfiles.message})
      }else{
        this.setState({profiles: systemProfiles.report });

      // REVISE LOGGED IN STATUS (at expl. page reload) AND REGENERATE STATUS IN NEED
        const loggingRevisionMsg = await doAjaxSending('/profile/revise', 'GET', '');
        if(loggingRevisionMsg.status === 'success'){
          const storageId = await sessionStorage.getItem('profId')
          const loggedProfId = loggingRevisionMsg.report;
          if(storageId === loggedProfId){
            this.handleRelogProc(loggedProfId)
          }else{
            this.handleLogoutProc();
          }
        }else{
          this.handleLogoutProc();
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
  async handleRelogProc(loggedUserId){
    try{
      const userDet = await this.readBackSessionStoreage()
      const refreshTodos = await doAjaxSending( userDet.collectTodos, 'GET', '')
      this.handleCardFocus(loggedUserId)
      this.handleLoginProc(userDet, refreshTodos.report, 'reload')
    }catch(err){
      this.handleAPIError(err)
    }
  }

  async handleLoginProc(user, todos, procMode){
    this.setState({
      loggedUser: user,
      todos: todos,
      todoListMessage: {ident: -1, msg: 'Content loaded!'}
    })
    if(procMode === 'login'){
      this.fillInSessionStore(user);
    }
  }
  async handleLogoutProc(){
    this.setState({
      loggedUser: '',
      todos: '',
      todoListMessage: {ident: '', msg: ''},
    })

  }






  // PROFILE EVENTS, PROCESSES //
  async registerProfProc(datas){
    try{
      const ajaxBody = smblRegisDatas(datas);
      const profRegRes = await doAjaxSending('/api/register', 'POST', ajaxBody)
      if(profRegRes){
        const newUserToList = {
          username: datas.username,
          loginProfile: profRegRes.report.loginUrl
        }
        this.setState({
          profiles: [...this.state.profiles, newUserToList],
          cardOnFocusId: newUserToList.id,
          loggedUser: profRegRes.report,
          todos: {},
          registerServerMessage: ''
        })

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
        this.emptySessionStore();
      }
    }catch(err){
      this.handleAPIError(err)
    }
  }

  readBackSessionStoreage(){
    return {
      firstName: sessionStorage.getItem('profFullname'),
      lastName: sessionStorage.getItem(''),
      age: sessionStorage.getItem('profAge'),
      occupation: sessionStorage.getItem('profOccup'),
      manageProfile: sessionStorage.getItem('profManage'),
      logoutProfile: sessionStorage.getItem('profLogout'),
      collectTodos:  sessionStorage.getItem('profTodos')
  }
  }
  fillInSessionStore(datas){
    sessionStorage.setItem('profFullname', datas.first_name + ' ' + datas.last_name)
    sessionStorage.setItem('profAge', datas.age)
    sessionStorage.setItem('profOccup', datas.occupation)
    sessionStorage.setItem('profSetTodo', datas.createNewTodo)
    sessionStorage.setItem('profManage', datas.changPwdDelAccUrl)
    sessionStorage.setItem('profLogout', datas.logoutUrl)
    sessionStorage.setItem('profTodos', datas.collectTodosUrl)
  }
  emptySessionStore(){
    sessionStorage.removeItem('profId')
    sessionStorage.removeItem('profFullname')
    sessionStorage.removeItem('profAge')
    sessionStorage.removeItem('profOccup')
    sessionStorage.removeItem('profSetTodo')
    sessionStorage.removeItem('profManage')
    sessionStorage.removeItem('profLogout')
    sessionStorage.removeItem('profTodos')
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
      interpretProblems(err, 'todoListMessage', this.handleInputChange)
    }
  }
  async todoStatusChangeProc(url, value){
    console.log(`${url}, ${value}`)
    try{
      const ajaxBody = smblStateChangeTodoDatas(value);
      const ajaxTodoStatusRes = await doAjaxSending(url, 'PUT', ajaxBody)
      const todoUnderProcRes = this.state.todos.filter(item=>
        item.id === ajaxTodoStatusRes.report.todo);
      if(todoUnderProcRes){
        console.log(todoUnderProcRes)
        todoUnderProcRes[0].status = ajaxTodoStatusRes.report.outcome;
        this.todoStateChangeProcess(0, todoUnderProcRes[0], 
          ajaxTodoStatusRes.message)
      }
    }catch(err){
      interpretProblems(err, 'todoListMessage', this.handleInputChange)
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
      interpretProblems(err, 'todoListMessage', this.handleInputChange)
    }
  }
  async todoRemoveProc(url, todoId){
    try{
      const ajaxTodoDeleteRes = await doAjaxSending(url, 'DELETE', '');
      if(ajaxTodoDeleteRes.report.todo){
        this.todoStateChangeProcess(-1, { id: todoId }, ajaxTodoDeleteRes.message)
      }
    }catch(err){
      interpretProblems(err, 'todoListMessage', this.handleInputChange)
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
      todoListMessage: { 
        ident: msgId ? msgId : -1, 
        msg: msg }
    })
  }


  render(){
    let sideAreaContent = '';
    if(typeof this.state.loggedUser === 'object'){

      sideAreaContent = <TodoList
        userid={this.state.loggedUser.id}
        todoContent={this.state.todos}
        todoListMessage={this.state.todoListMessage}
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
                funcLogout = {this.handleLogoutProc}
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
