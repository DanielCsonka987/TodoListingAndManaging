import './styles/modernLayout.css';
import './styles/subElementsLayout.css';
import './styles/olderLayout.css';
import './styles/fashion.css'
import React, {Component, Fragment} from 'react';

import AbourContent from './components/generals/AboutContent.js'
import Header from './components/generals/Header'
import ErrorHandler from './components/generals/ErrorHandler.js'
import ShowMessages from './components/generals/ShowMessages';
import { doAjaxSending, smblRegisDatas, smblProfDeletDatas } from './utils/apiMessenger.js';

import ProfileItem from './components/profileContainer/ProfileItem.js';
import RegisterForm from './components/profileContainer/RegisterForm.js'
import TodoList from './components/todoContainer/TodoList.js';

class App extends Component {
  constructor(props){
    super()
    this.handleCardFocus = this.handleCardFocus.bind(this)
    this.handleAPIError = this.handleAPIError.bind(this)

    this.handleLoginProc = this.handleLoginProc.bind(this);
    this.handleLogoutProc = this.handleLogoutProc.bind(this);

    this.readBackSessionStoreage = this.readBackSessionStoreage.bind(this)
    this.fillInSessionStore = this.fillInSessionStore.bind(this)
    this.emptySessionStore = this.emptySessionStore.bind(this)

    this.registerProfProc = this.registerProfProc.bind(this);
    this.removeProfProc = this.removeProfProc.bind(this);
    //this.updateProfileTodos = this.updateProfileTodos.bind(this)
    this.state = {
      profiles: '',
      profileColumnMsg: '',
      profileAreaMsg: '',
      registerAreaMsg: '',
      cardOnFocusId: -1,
    
      loggedUser: ''
    }
  }
  async componentDidMount(){
    try{
      const systemProfiles = await doAjaxSending('/profile/', 'GET', '');
      if(systemProfiles.status === 'failed' || systemProfiles.report.value.length === 0){
        this.setState({profiles: [] });
        this.setState({ 
          profileColumnMsg: { type: 'norm', msg: systemProfiles.message }
        })
      }else{
        this.setState({profiles: systemProfiles.report.value });
        
        // REVISE LOGGED IN STATUS (at expl. page reload) AND REGENERATE STATUS IN NEED
        const loggingRevisionMsg = await doAjaxSending('/profile/revise', 'GET', '');
        if(loggingRevisionMsg.status === 'success'){
          this.handleLoginProc(loggingRevisionMsg, 'reload')
        }else{
          this.handleLogoutProc(true, systemProfiles.message);
        }
      }
    }catch(err){
      this.handleAPIError(err)
    }
  }

  async registerProfProc(datas){
    try{
      const ajaxBody = smblRegisDatas(datas);
      const profRegRes = await doAjaxSending('/profile/register', 'POST', ajaxBody)
      if(profRegRes.status === 'success'){
        const newUserToList = {
          id: profRegRes.report.value.id,
          username: datas.username,
          loginProfile: profRegRes.report.value.loginUrl
        }
        this.setState({
          profiles: [...this.state.profiles, newUserToList],
          cardOnFocusId: profRegRes.report.value.id,
          loggedUser: profRegRes.report.value,
          profileColumnMsg: {
            type: 'norm',
            msg: profRegRes.message,
          },
          registerAreaMsg: ''
        })
      }
    }catch(errRemote){
      this.handleAPIError(errRemote)
    }
  }
  async removeProfProc(pwd, profid){
    try{
      const ajaxBody = smblProfDeletDatas(pwd)
      const profDelRes = await doAjaxSending(this.state.loggedUser.changePwdDelAccUrl,
        'DELETE', ajaxBody)
      if(profDelRes.status === 'success'){
        this.setState({
          profiles: this.state.profiles.filter(p=>p.id!==profid)
        })
        this.setState({ 
          profileColumnMsg: { type: 'norm', msg: profDelRes.message, },
          loggedUser: '',
          cardOnFocusId: -1
        })
        this.emptySessionStore();
      }
    }catch(errRemote){
      this.handleAPIError(errRemote)
    }
  }

  componentDidCatch(error, info){
    console.log(error)
    console.log(info)
  }

  handleAPIError(err){
    this.setState({
      profileColumnMsg: {
        type: 'warn',
        msg: err.name.includes('Validate')? err.errorFields : err.message
      } 
    })
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
  async handleLoginProc(respDatas, procMode){
    if(procMode === 'login'){
      this.setState({
        loggedUser: respDatas.report.value,
        profileColumnMsg: '',
        profileAreaMsg: ''
      })
      await this.fillInSessionStore(respDatas.report.value);
    }else{
      const logDatas = await this.readBackSessionStoreage()
      if(logDatas.id){
        logDatas.todos = respDatas.report.value
        this.handleCardFocus(logDatas.id)
        this.setState({ 
          loggedUser: logDatas,
          profileAreaMsg: {id: logDatas.id, messageContent: { type: 'norm', msg: respDatas.message } }
        })
      }else{
        /// COOKIE DELETION NEEDED AT SERVER SIDE /// = NO MORE POSSIBILITY RELOADING
        await doAjaxSending('/profile/logout', 'GET', '')
        this.handleLogoutProc(false, 'Local datas are missing. Please login again!')
      }
    }
  }
  async handleLogoutProc(profid, message){
    this.setState({
      cardOnFocusId: -1,
      profileColumnMsg: { type: profid? 'norm':'warn', msg: message },
      profileAreaMsg: '',
      loggedUser: ''
    })
  }



  readBackSessionStoreage(){
    return {
      id: sessionStorage.getItem('profId'),
      fullname: sessionStorage.getItem('profFullname'),
      age: sessionStorage.getItem('profAge'),
      occupation: sessionStorage.getItem('profOccup'),
      createNewTodo: sessionStorage.getItem('profSetTodo'),
      changePwdDelAccUrl: sessionStorage.getItem('profManage'),
      logoutUrl: sessionStorage.getItem('profLogout')
    }
  }
  fillInSessionStore(datas){
    sessionStorage.setItem('profId', datas.id)
    sessionStorage.setItem('profFullname', datas.fullname)
    sessionStorage.setItem('profAge', datas.age)
    sessionStorage.setItem('profOccup', datas.occupation)
    sessionStorage.setItem('profSetTodo', datas.createNewTodo)
    sessionStorage.setItem('profManage', datas.changePwdDelAccUrl)
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

  render(){
    const regArea = this.state.loggedUser? '' : <>
      <h4 className='columnTitleText'>Accessing for your activity list, login or register an account!</h4>
      <RegisterForm
        regServMsg={this.state.registerAreaMsg}
        funcRegister={this.registerProfProc}
      />
      <h4 className='columnTitleText'>Accounts in the system:</h4>
    </>
    let profileList = ''
    if(typeof this.state.profiles === 'object'){
      profileList = <section  className='profileList' >
        { regArea }
        <ShowMessages messageContent={this.state.profileColumnMsg} ></ShowMessages>
        {this.state.profiles.map((item, index) => {

            const isThisUserLoggedIn = this.state.loggedUser.id === item.id;
            const showThisProfile = isThisUserLoggedIn || !this.state.loggedUser;
            const msgFromAbove = this.state.profileAreaMsg.id === item.id? 
              this.state.profileAreaMsg.messageContent: ''
            if(showThisProfile){
              return <ProfileItem key={item.id}
                userid={item.id}
                username={item.username}
                loginUrl={item.loginUrl}
                userExtraDatas={ isThisUserLoggedIn ? this.state.loggedUser : '' }
                userExtraMessage={ msgFromAbove }

                cardOnFocus={this.state.cardOnFocusId === item.id}
        
                funcCardFocus={this.handleCardFocus}
                funcLoginProc={this.handleLoginProc}
                funcLogoutProc={this.handleLogoutProc}
                funcCardRemoval={this.removeProfProc}
              />
            }else{
              return (<Fragment key={index}></Fragment>)
            }
          })
        }
      </section>
    }else{
      profileList = <section className='profileList' key={'a1'}>
        { regArea } 
        <ShowMessages messageContent={this.state.profileColumnMsg} ></ShowMessages>
        <div className='profileList'></div>
      </section>
    }

    const todoListAndInput = this.state.loggedUser? 
        <TodoList
          createNewTodo={this.state.loggedUser.createNewTodo}
          todoContent={this.state.loggedUser.todos} />
        : ''
        const aboutArea = this.state.loggedUser? '' : <AbourContent />

    return (
      <div className="appContainer">
        <Header />
        <main className='mainApp'>
          <ErrorHandler location='main profiles' >
          { profileList }
          </ErrorHandler>
          <ErrorHandler location='main todos' >
          { todoListAndInput }
          </ErrorHandler>
        { aboutArea }
        </main>
        <footer className='footerApp blackBackgr'>
        { /* Cookie usage user permission is needed!! */ }
        </footer>
      </div>
    )
  }
}

export default App;
