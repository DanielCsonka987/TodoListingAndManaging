import { React, Component } from 'react'
import TodoItem from './TodoItem.js'
import TodoInput from './TodoInput'

class TodoList extends Component{
    render(){

        const message = this.props.todoMessage;
        let todos = '';
        let todoAmount = 0;
        if( typeof this.props.todoContent === 'object'){
            if(this.props.todoContent.length > 0){
                todoAmount = this.props.todoContent.length;
                todos = this.props.todoContent.map((item, index)=>{
                    return <TodoItem key={index}
                        todoDatas={item}
                        todoMessage={this.props.todoMessage}
                        funcNoteEdit={this.props.funcNoteEdit}
                        funcStatusEdit={this.props.funcStatusEdit}
                        funcTodoRemove={this.props.funcTodoRemove}
                    />
                })
            }else{
                todos = <div>No content to show!</div>
            }
        }else{
            todos = <div>Error occured!</div>
        }

        return (
            <div className='todoList'>
                <div className='todoDetails'>
                    <p className='titleText'>Your requested tasks:</p>
                    <p className='descriptText'>
                        Amount: {todoAmount}
                    </p>
                </div>
                <TodoInput 
                    userid={this.props.userid}
                    funcTodoSave={this.props.funcTodoSave}
                />
                { todos }
            </div>
        )
    }
}

export default TodoList