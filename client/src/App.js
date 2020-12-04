import './App.css';
import React, {Component} from 'react';
import Register from './components/generals/RegisterForm.js'
import ProfileList from './components/profileContainer/ProfileList.js';
import TodoList from './components/todoContainer/TodoList.js';
import apiConn from './utils/apiCommunicator.js';
import userInputRevise from './utils/reviseFormContent.js';

class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedInUser: '',
      profiles: [],
      todos: [],
      loadingMessage: ''
    }
  }

  componentDidMount(){
    apiConn('/api', 'GET', '')
    .then(res=>{
      this.setState({profiles: res.report, loadingMessage: res.message});
      // console.log(this.state.profiles);
    })
    .catch(err=>{
      this.setState({ loadingMessage: err.message +'Site fail at initialization!'})
    })
  }

  loginProc(event){

  }
  logoutProc(){

  }

  registerProc(datas, event ){
    userInputRevise.registerInput(datas)
    .then(ajaxBody=>{
      apiConn('/api/register', 'POST', ajaxBody)
      .then(res=>{
        console.log(res);
      })
      .catch(err=>{

      });
    })
    .catch(errorMesage=>{
      datas.informMessge = errorMesage;
      console.log('Error at reviser: ' +errorMesage)
    })

  }
  profileUpdate(){

  }
  profileDelete(){

  }

  createTodo(){

  }
  updateTodo(){

  }
  deleteTodo(){

  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
        <aside className='profiles'>
          <Register
            funcRegister={this.registerProc}
          />
          <ProfileList
            funcLogin={this.loginProc}
            funcLogout={this.logoutProc}
            funcChangePwd={this.profileUpdate}
            funcDelAccount={this.profileDelete}

            isLoggedIn={this.state.loggedInUser}
            loadMessage={this.state.loadingMessage}
            profileContent={this.state.profiles}
          />
        </aside>
        <aside className='todos'>
        { this.state.loggedInUser?
            <TodoList
              funcNewTodo={this.createTodo}
              funcUpdateTodo={this.updateTodo}
              funcDeleteTodo={this.deleteTodo}

              todoContent={this.state.todos}
            /> : ''
        }
        </aside>
        <aside className='about'>
        </aside>
        <footer></footer>
      </div>
    );
  }
}

export default App;
