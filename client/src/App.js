import './styles/modernLayout.css';
import './styles/olderLayout.css';
import './styles/fashion.css'
import React, {Component} from 'react';
import ProfileList from './components/profileContainer/ProfileList.js';
import TodoList from './components/todoContainer/TodoList.js';
import AbourContent from './components/generals/AboutContent.js'
import Header from './components/generals/Header'
import ErrorHandler from './components/generals/ErrorHandler.js'

import { doAjaxSending, 
  smblRegisDatas, smblProfDeletDatas, smblNewTodoDatas, smblStateChangeTodoDatas, 
  smblNotationChangeTodoDatas } from './utils/apiMessenger.js';

class App extends Component {
  constructor(props){
    super()
    this.handleCardFocus = this.handleCardFocus.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleAPIError = this.handleAPIError.bind(this)
    this.handleTodoError = this.handleTodoError.bind(this)

    this.handleLoginProc = this.handleLoginProc.bind(this);
    this.handleLogoutProc = this.handleLogoutProc.bind(this);

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
      profiles: [],
      loggedUser: ''
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
    this.setState({
      loadMessage:  err.name.includes('Validate')?
        err.errorFields : err.message
    })
  }
  handleTodoError(todoid, err){
    this.setState({
      todoListMessage: { ident: todoid, msg: err.message }
    })
  }
  async componentDidMount(){
    try{
      const systemProfiles = await doAjaxSending('/profile/', 'GET', '');
      if(systemProfiles.status === 'failed' || systemProfiles.report.value.length === 0){
        this.setState({ loadMessage: systemProfiles.message})
      }else{
        this.setState({profiles: systemProfiles.report.value });

      // REVISE LOGGED IN STATUS (at expl. page reload) AND REGENERATE STATUS IN NEED
        const loggingRevisionMsg = await doAjaxSending('/profile/revise', 'GET', '');
        if(loggingRevisionMsg.status === 'success'){
          const userDet = await this.readBackSessionStoreage()
          userDet.todos = loggingRevisionMsg.report.value
          this.handleCardFocus(userDet.id)
          this.handleLoginProc(userDet, 'reload')
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
  async handleLoginProc(user, procMode){
    this.setState({
      loggedUser: user,
      todoListMessage: {ident: -1, msg: 'Content loaded!'}
    })
    if(procMode === 'login'){
      await this.fillInSessionStore(user);
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
      if(profRegRes.status === 'success'){
        const newUserToList = {
          username: datas.username,
          loginProfile: profRegRes.report.value.loginUrl
        }
        this.setState({
          profiles: [...this.state.profiles, newUserToList],
          cardOnFocusId: newUserToList.id,
          loggedUser: profRegRes.report.value,
          todos: {},
          registerServerMessage: ''
        })

      }
    }catch(errRemote){
      this.handleAPIError(errRemote)
    }
  }
  async removeProfProc(pwd, profid){
    try{
      const ajaxBody = smblProfDeletDatas(pwd)
      const profDelRes = await doAjaxSending(this.state.loggedUser.manageProfile,
        'DELETE', ajaxBody)
      if(profDelRes.report.status === 'success'){
        this.setState({ 
          profiles: [...this.state.profiles.filter(p=>p.id!==profid)],
          loadMessage: profDelRes.message,
          loggedUser: ''
        })
        this.emptySessionStore();
      }
    }catch(errRemote){
      this.handleAPIError(errRemote)
    }
  }

  readBackSessionStoreage(){
    return {
      id: sessionStorage.getItem('profId'),
      firstName: sessionStorage.getItem('profFullname'),
      lastName: sessionStorage.getItem(''),
      age: sessionStorage.getItem('profAge'),
      occupation: sessionStorage.getItem('profOccup'),
      manageProfUrl: sessionStorage.getItem('profManage'),
      logoutUrl: sessionStorage.getItem('profLogout')
    }
  }
  fillInSessionStore(datas){
    console.log(datas)
    sessionStorage.setItem('profId', datas.id)
    sessionStorage.setItem('profFullname', datas.first_name + ' ' + datas.last_name)
    sessionStorage.setItem('profAge', datas.age)
    sessionStorage.setItem('profOccup', datas.occupation)
    sessionStorage.setItem('profSetTodo', datas.createNewTodo)
    sessionStorage.setItem('profManage', datas.changPwdDelAccUrl)
    sessionStorage.setItem('profLogout', datas.logoutUrl)
  }
  emptySessionStore(){
    sessionStorage.removeItem('profId')
    sessionStorage.removeItem('profFullname')
    sessionStorage.removeItem('profAge')
    sessionStorage.removeItem('profOccup')
    sessionStorage.removeItem('profSetTodo')
    sessionStorage.removeItem('profManage')
    sessionStorage.removeItem('profLogout')
  }










  // TODO EVENTs, PROCESSES //
  async todoAdditionProc(todoDatas){
    try{
      const ajaxBody = smblNewTodoDatas(todoDatas)
      const todoRegRes = await doAjaxSending(
        this.state.loggedUser.createNewTodo, 'POST', ajaxBody)
      if(todoRegRes){
        this.todoStateChangeProcess(1, todoRegRes.report.value, todoRegRes)
      }
    }catch(err){
      this.handleTodoError(err, -1)
    }
  }
  async todoStatusChangeProc(url, newValue, todoid){
    try{
      const ajaxBody = smblStateChangeTodoDatas(newValue);
      const ajaxTodoStatusRes = await doAjaxSending(url, 'PUT', ajaxBody)
      if(ajaxTodoStatusRes.status === 'success'){
        const todoUnderProcRes = this.state.loggedUser.todos.filter(item=> item.id === todoid);
        todoUnderProcRes[0].status = newValue;
        todoUnderProcRes[0].update = new Date(ajaxTodoStatusRes.report.value)
        this.todoStateChangeProcess(0, todoUnderProcRes[0], ajaxTodoStatusRes)
      }
    }catch(err){
      this.handleTodoError(err, todoid)

      
    }
  }
  async todoNoteChangeProc(url, value, todoid){
    try{
      const ajaxBody = smblNotationChangeTodoDatas(value);
      const ajaxTodoNoteRes = await doAjaxSending(url, 'PUT', ajaxBody)
      const todoUnderProcRes = this.state.loggedUser.todos.filter(item=> item.id === todoid)
      if(todoUnderProcRes.status === 'success'){
        todoUnderProcRes[0].notation = value;
        todoUnderProcRes[0].update = new Date(todoUnderProcRes.report.value)
        this.todoStateChangeProcess(0, todoUnderProcRes[0], ajaxTodoNoteRes)
      }
    }catch(err){
      this.handleTodoError(err, todoid)
    }
  }
  async todoRemoveProc(url, todoid){
    try{
      const ajaxTodoDeleteRes = await doAjaxSending(url, 'DELETE', '');
      if(ajaxTodoDeleteRes.status === 'success'){
        this.todoStateChangeProcess(-1, { id: todoid }, ajaxTodoDeleteRes)
      }
    }catch(err){
      this.handleTodoError(err, todoid)
    }
  }

  // -1 removal, 0 replace, 1 addition
  async todoStateChangeProcess(process, contentToChange, servMsg){

    if(process === 0 || process === -1){  //removing todo from array
      await this.setState({
        todos: [...this.state.loggedUser.todos.filter(item=>item.id !== contentToChange.id)]
      })
    }
    if(process === 0 || process === 1){   //inserting todo to array
      await this.setState({
        todos: [...this.state.loggedUser.todos, contentToChange]
      })
    }
    await this.setState({
      todoListMessage: { 
        ident: process === -1 ? -1 : contentToChange.id,
        msg: servMsg.message }
    })
  }


  render(){
    let sideAreaContent = '';
    if(typeof this.state.loggedUser === 'object'){

      sideAreaContent = <TodoList
        userid={this.state.loggedUser.id}
        todoContent={this.state.loggedUser.todos}
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
