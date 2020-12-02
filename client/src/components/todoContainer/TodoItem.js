const React, { Component } from 'react';

class TodoItem extends Component{
  constructor(props){
    super(props);
    this.state = {
      task: this.props.task,
      notation: this.props.notation,
      priority: this.props.prioroty,
      status: this.props.status,
      startDate: this.props.start,
      updateDate: this.props.update,
    }
  }

  changeConent(event){
    const {name, value} = event.target;
  }

  render(){
    return(
      <div className='todoItem'>
        <p className='todoItemDetail'>
          <span>Task: {this.state.task}</span>
        </p>
        <p className='todoItemDetail'>
          <span className=''>Notation: {this.state.notation}</span>
          <button className='todoChange'></button>
        </p>
        <p className='todoItemDetail'>
          <span className='todoItemLeft'>Start: {this.state.startDate}</span>
          <span className='todoItemRight'>Last update: {this.state.updateDate}}</span>
        </p>
        <p className='todoItemDetail'>
          <span className='todoItemLeft'>Priority: {this.state.priority}</span>
          <span className='todoItemRight'>Status: </span>
          <span className='todoChange'>
          <button className='todoChange'></button>
          </span>
        </p>
      </div>
    )
  }
}
