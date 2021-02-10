import { React, Component } from 'react'
import FormInputUnit from '../generals/FormInputUnit.js'
import { todoNotationInputRevise } from '../../utils/inputRevise'

class TodoItem extends Component{
  constructor(props){
    super(props);
    this.handleContentChange = this.handleContentChange.bind(this)
    this.state = {
      isItEditMode: false,
      todoMessage: '',
      todoId: this.props.todoDatas.id,
      notation: this.props.todoDatas.notation,
      status: this.props.todoDatas.status === 'Finished'
    }
  }
  handleContentChange(event){
    const {name, value} = event.target;
    if(name === 'status'){
      this.props.funcStatusEdit(value, this.status.todoId);
    }
    this.setState({ [name]: value })
  }
  handleModeSwitch(){
    this.setState({
      isItEditMode: !this.state.isItEditMode
    })
  }
  handleModifyNote(event){
    todoNotationInputRevise(this.state)
    .then(()=>{
      this.props.funcNoteEdit(this.state.notation, this.state.todoid);
      this.setState({ isItEditMode: false })
    })
    .catch(error=>{
      this.setState({todoMessage: error})
    })
  }

  render(){
    const todoNotationArea = this.state.isItEditMode?
      <div>
        <FormInputUnit classes='todoItemDetail'
          id='note' label='Notation:' name='notation'
          type='textarea' value={this.state.notation}
          funcChange={this.handleContentChange}
        >
          You can write at most 150 character!
        </FormInputUnit>
        <button onClick={this.handleModifyNote}></button>
      </div>
      :
      <div className='todoItemDetail'>
        <span className='todoItemCentral'>Notation: {this.props.todoDatas.notation}</span>
        <button className='todoChange' onClick={this.handleModeSwitch}>Edit
        </button>
      </div>

    const messageToShow = this.props.messageFromAbove || this.state.todoMessage

    return (
      <div className='todoItem'>
        <p className='todoItemDetail'>
          <span>Task: {this.props.todoDatas.task}</span>
        </p>
        { todoNotationArea }
        <p className='todoItemDetail'>
          <span className='todoItemLeft'>Start: {this.props.todoDatas.startDate}</span>
          <span className='todoItemRight'>Last update: {this.props.todoDatas.updateDate}}</span>
        </p>
        <div className='todoItemDetail'>
          <span className='todoItemLeft'>Priority: {this.props.todoDatas.priority}</span>
          <span className='todoItemRight'>Status: {this.props.todoDatas.status}</span>
          <FormInputUnit classes='todoItemDetail'
            id='state' label='' name='state'
            type='checkbox' value={this.state.status}
            funcChange={this.handleContentChange}
          />
        </div>
        <p className='todoMessage'>{messageToShow}</p>
      </div>
    )
  }
}

export default TodoItem