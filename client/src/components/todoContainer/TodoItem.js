import { React, Component } from 'react'

import DetailsNotationArea from './DetailsNotationArea'
import DetailsDeleteArea from './DetailsDeletArea'
import DetailsStatusArea from './DetailsStatusArea'
import TodoDateContent from './TodoDateContent'
import ShowMessages from '../generals/ShowMessages'

import { todoNotationInputRevise } from '../../utils/inputRevise'
import interpretError from '../../utils/interpretProblems'

class TodoItem extends Component{
  constructor(props){
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleModeSwitch = this.handleModeSwitch.bind(this)
    this.handleModifyNote = this.handleModifyNote.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.state = {
      componentMode: 'normal',
      todoMessage: '',
      notation: '',
      status:  this.props.todoDatas.status === 'Finished'
    }
  }
  handleInputChange(event){
    const { name, value } = event.target;
    this.setState({   [name]: value })
  }
  handleStatusChange(state){
    this.props.funcStatusEdit(this.props.todoDatas.updateStatus, 
      !this.state.status)
  }
  handleModeSwitch(event){
    if(this.state.componentMode === 'normal'){
      const { value } = event.target.attributes['name'];
      if(value==='forNotation'){
        this.setState({
          notation: this.props.todoDatas.notation,
          componentMode: 'notationChange'
        })
      }
      if(value==='forDeletion'){
        this.setState({
          todoMessage: 'Do you really delete this?',
          componentMode: 'deleteConfirm'
        })
      }
    }else{
      this.setState({ componentMode: 'normal', todoMessage: '' })
    }
  }
  handleClickDelete(){
    this.props.funcTodoRemove(this.props.todoDatas.deleteTodo, this.props.todoDatas.id)
    this.setState({ todoMessage: '' })
  }
  async handleModifyNote(){
    try{
      await todoNotationInputRevise(this.state.notation)
      this.props.funcNoteEdit(this.props.todoDatas.updateNotation, this.state.notation);
      this.setState({ todoMessage: '' })
    }catch(err){
      interpretError(err, 'todoMessage', this.handleInputChange);
    }
  }


  render(){
    return (
      <div className='todoItemWidth cardArea'>

        <div className='todoItemCardAreas'>
          <span className={'todoItemCardAras dataLabelMarking'}>
            Task:</span>
          <span> {this.props.todoDatas.task}</span>
          <DetailsNotationArea notation={this.props.todoDatas.notation} 
            notationAreaMode={this.state.componentMode} noteValue={this.state.notation}
            funcExecNotify={this.handleModifyNote} funcModeSwitch={this.handleModeSwitch}
            funcChangeNotation={this.handleInputChange}
          />
          <span className={'todoItemCardAreas'} >
            <span className='dataLabelMarking'>Priority: </span> 
            <span>{this.props.todoDatas.priority}</span>
          </span>
        </div>

        <TodoDateContent 
          dateContent={this.props.todoDatas.start}
        >Start:</TodoDateContent>
        <TodoDateContent 
          dateContent={this.props.todoDatas.update}
        >Update:</TodoDateContent>

        <div className='wrapperRowAllCenter'>
          <DetailsStatusArea
            actStatus={this.state.status} actStatusText={this.props.todoDatas.status}
            funcStatusChange={this.handleStatusChange}
          />
          <DetailsDeleteArea 
            deleteAreaMode={this.state.componentMode} 
            funcExecDelete={this.handleClickDelete} funcModeSwitch={this.handleModeSwitch}
          />
        </div>
        <ShowMessages 
          messageContent={this.props.messageFromAbove // from notation change, API errors
            || this.state.todoMessage}
        />
      </div>
    )
  }
}

export default TodoItem