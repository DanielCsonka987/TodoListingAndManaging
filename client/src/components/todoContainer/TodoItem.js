import React,  { Component } from 'react'

import DetailsNotationArea from './DetailsNotationArea'
import DetailsDeleteArea from './DetailsDeletArea'
import DetailsStatusArea from './DetailsStatusArea'
import TodoDateContent from './TodoDateContent'
import ShowMessages from '../generals/ShowMessages'

import { todoNotationInputRevise } from '../../utils/inputRevise'
import { doAjaxSending, smblStateChangeTodoDatas, 
  smblNotationChangeTodoDatas } from '../../utils/apiMessenger.js';

class TodoItem extends Component{
  constructor(props){
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleModeSwitch = this.handleModeSwitch.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)

    this.todoStatusChangeProc = this.todoStatusChangeProc.bind(this);
    this.todoNoteChangeProc = this.todoNoteChangeProc.bind(this);
    this.state = {
      componentMode: 'normal',
      notation: '',
      todoMessage: ''
    }
  }
  async todoStatusChangeProc(){
    try{
      const newValue = this.props.todoDatas.status === 'Finished'? 'false' : 'true'
      const ajaxBody = smblStateChangeTodoDatas(newValue);
      const ajaxTodoStatusRes = await doAjaxSending(
        this.props.todoDatas.statusChangeUrl, 'PUT', ajaxBody)
      if(ajaxTodoStatusRes.status === 'success'){
        const valuToRender = this.props.todoDatas.status === 'Finished'? 'Proceeding' : 'Finished'
        this.props.funcStateChanged(
          this.props.todoDatas.id, 
          valuToRender, this.props.todoDatas.notation, ajaxTodoStatusRes.report.value
        )
      }else{
        this.handleAPIError(ajaxTodoStatusRes)
      }
    }catch(err){
      this.handleAPIError(err)
    }
  }
  async todoNoteChangeProc(){
    try{
        await todoNotationInputRevise(this.state.notation)
        const ajaxBody = smblNotationChangeTodoDatas(this.state.notation);
        const ajaxTodoNoteRes = await doAjaxSending(
          this.props.todoDatas.notationChangeUrl, 'PUT', ajaxBody)
        if(ajaxTodoNoteRes.status === 'success'){
          this.props.funcStateChanged(
            this.props.todoDatas.id, 
            this.props.todoDatas.status, this.state.notation, ajaxTodoNoteRes.report.value
          )
          this.handleModeSwitch({ target: {name: 'forNotation'} })
        }else{
          this.handleAPIError(ajaxTodoNoteRes)
        }
      }catch(err){
        this.handleAPIError(err)
      }
  }

  handleInputChange(event){
    const { name, value } = event.target;
    this.setState({   [name]: value })
  }
  handleAPIError(err){
    this.setState({
      todoMessage:  { type: 'warn', msg: err.name.includes('Validate')? err.errorFields : err.message }
    })
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
          todoMessage: { type: 'warn', msg:'Do you really delete this?'},
          componentMode: 'deleteConfirm'
        })
      }
    }else{
      this.setState({ componentMode: 'normal', todoMessage: '' })
    }
  }
  handleClickDelete(){
    this.props.funcTodoRemove( this.props.todoDatas.removingUrl, this.props.todoDatas.id)
  }

  render(){
    return (
      <article className='todoItem cardAreaEdge cardAreaPadding' data-testid={'todoCard' + this.props.todoDatas.id}>

        <h4 className='todoItemForTask'> {this.props.todoDatas.task}</h4>
        <DetailsDeleteArea 
          deleteAreaMode={this.state.componentMode} 
          funcExecDelete={this.handleClickDelete} funcModeSwitch={this.handleModeSwitch}
        />

        <DetailsNotationArea notation={this.props.todoDatas.notation} 
          notationAreaMode={this.state.componentMode} noteValue={this.state.notation}
          funcExecNotify={this.todoNoteChangeProc} funcModeSwitch={this.handleModeSwitch}
          funcChangeNotation={this.handleInputChange}
        />

        <p className={'todoItemForPrioirty'} >
          <span className='formAndCardLabels'>Priority: </span> 
          <span>{this.props.todoDatas.priority}</span>
        </p>
        <div className={'todoItemForDates'}>
          <TodoDateContent 
            dateContent={this.props.todoDatas.start}
          >Start:</TodoDateContent>
          <TodoDateContent 
            dateContent={this.props.todoDatas.update}
          >Update:</TodoDateContent>
        </div>
        <DetailsStatusArea
          actStatusText={this.props.todoDatas.status}
          funcStatusChange={this.todoStatusChangeProc}
        />

        <ShowMessages 
          messageContent={this.state.todoMessage}  // for local errors
        />
      </article>
    )
  }
}

export default TodoItem