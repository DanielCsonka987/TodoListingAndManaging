import { React, Component } from 'react'

import DetailsNotationArea from './DetailsNotationArea'
import DetailsDeleteArea from './DetailsDeletArea'
import TodoDateContent from './TodoDateContent'
import ShowMessages from '../generals/ShowMessages'

import { todoNotationInputRevise } from '../../utils/inputRevise'
import interpretError from '../../utils/interpretProblems'

class TodoItem extends Component{
  constructor(props){
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleModeSwitch = this.handleModeSwitch.bind(this)
    this.handleModifyNote = this.handleModifyNote.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.state = {
      isItEditMode: false,
      isItDeleteMode: false,

      todoId: this.props.todoDatas.id,
      todoChangeNoteUrl: this.props.todoDatas.updateNotation,
      todoChangeStatusUrl: this.props.todoDatas.updateStatus,
      todoDeleteThisUrl: this.props.todoDatas.deleteTodo,

      todoMessage: '',
      notation: '',
      status: (this.props.todoDatas.status==='Finished')
    }
  }
  handleInputChange(event){
    const { name } = event.target
    if(name === 'status'){
      const checked = event.target.checked
      this.props.funcStatusEdit(this.state.todoChangeStatusUrl, checked);
      this.setState({ [name]: checked })
    }else{
      const {value} = event.target;
      this.setState({   [name]: value })
    }
  }
  handleModeSwitch(event){
    const { name } = event.target;
    if(name==='forNotation'){
      this.setState({
        notation: this.props.todoDatas.notation,
        isItEditMode: !this.state.isItEditMode
      })
    }
    if(name==='forDeletion'){
      this.setState({
        isItDeleteMode: !this.state.isItDeleteMode
      })
    }
  }
  handleClickDelete(){
    this.props.funcTodoRemove(this.state.todoDeleteThisUrl, this.state.todoId)
    this.setState({ todoMessage: '' })
  }
  async handleModifyNote(){
    try{
      await todoNotationInputRevise(this.state.notation)
      this.props.funcNoteEdit(this.state.todoChangeNoteUrl, this.state.notation);
      this.handleModeSwitch({ target: { name: 'forNotation' } });
    }catch(err){
      interpretError(err, 'todoMessage', this.handleInputChange);
      this.handleModeSwitch({ target: { name: 'forNotation' } });
      this.setState({ todoMessage: '' })
  }
  }


  render(){
    return (
      <div className='todoItemWidth cardArea'>
        <p className='todoItemDetail'>
          <span>Task: {this.props.todoDatas.task}</span>
        </p>
        <DetailsNotationArea notation={this.props.todoDatas.notation} 
          notationAreaMode={this.state.isItEditMode} noteValue={this.state.notation}
          funcExecNotify={this.handleModifyNote} funcModeSwitch={this.handleModeSwitch}
          funcChangeNotation={this.handleInputChange}
        />
        <div className='todoItemDetail'>
          <TodoDateContent dateContent={this.props.todoDatas.start}>Start:</TodoDateContent>
          <TodoDateContent dateContent={this.props.todoDatas.update}>Update:</TodoDateContent>
        </div>
        <div className='todoItemDetail'>
          <span className='todoItemLeft'>Priority: {this.props.todoDatas.priority}</span>
          <span className='todoItemRight'>Status: {this.props.todoDatas.status}</span>
          <input type='checkbox' name='status' checked={this.state.status} 
            onChange={this.handleInputChange} />
        </div>
        <DetailsDeleteArea deleteAreaMode={this.state.isItDeleteMode} 
          funcExecDelete={this.handleClickDelete} funcModeSwitch={this.handleModeSwitch}
        />
        <ShowMessages messageContent={this.props.messageFromAbove? 
          this.props.messageFromAbove : this.state.todoMessage}
        />
      </div>
    )
  }
}

export default TodoItem