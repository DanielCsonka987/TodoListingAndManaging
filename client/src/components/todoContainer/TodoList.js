import { React, Component } from 'react'
import TodoItem from './TodoItem.js'

class TodoList extends Component{
    constructor(props){
        super(props)
    }

    render(){

        return (
            <div className='todoList'>
                <p className='titleText'>Your requested tasks:</p>
                {this.props.todoContent.report.map((item)=>{
                    return <TodoItem 
                    
                    />
                })}
            </div>
        )
    }
}

export default TodoList