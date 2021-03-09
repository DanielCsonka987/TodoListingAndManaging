import { React, Component } from 'react'
import TodoItem from './TodoItem.js'
import TodoInput from './TodoInput'

class TodoList extends Component{
    render(){

        let messageToSingle = '';
        let messageGlobally = '';
        
        if(this.props.todoMessage.ident === -1){
            messageGlobally = this.props.todoMessage.msg
        }else{
            messageToSingle = this.props.todoMessage
        }

        let todos = '';
        let todoAmount = 0;
        if( typeof this.props.todoContent === 'object'){
            if(this.props.todoContent.length > 0){
                todoAmount = this.props.todoContent.length;
                todos = this.props.todoContent.map((item, index)=>{
                    let msg = '';
                    if(messageToSingle){
                        msg = messageToSingle.ident === item.id? 
                            messageToSingle.msg: '';
                    }
                    return <TodoItem key={index}
                        todoDatas={item}
                        messageFromAbove={ msg }
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
            <div className='todoList wrapperColumnAllCenter'>
                <TodoInput 
                    userid={this.props.userid}
                    todoSaveMessage={messageGlobally}
                    funcTodoSave={this.props.funcTodoSave}
                />
                <div className='todoDetails'>
                    <p className='titleText'>Your requested tasks:</p>
                    <p className='descriptText'>
                        Amount: {todoAmount}
                    </p>
                </div>

                { todos }
            </div>
        )
    }
}

export default TodoList