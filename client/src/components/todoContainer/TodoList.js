import React, { Component, Fragment } from 'react'
import TodoItem from './TodoItem.js'
import TodoInput from './TodoInput'
import ErrorHandler from '../generals/ErrorHandler'
import ShowMessages from '../generals/ShowMessages.js'
import { doAjaxSending } from '../../utils/apiMessenger'

class TodoList extends Component{
    constructor(props){
        super()
        this.todoAdditionProc = this.todoAdditionProc.bind(this)
        this.todoRemoveProc = this.todoRemoveProc.bind(this)
        this.todoChangeStateProc = this.todoChangeStateProc.bind(this)
        this.handleApiError = this.handleApiError.bind(this)
        this.isMountedVal = 0;
        this.state = {
            todos: props.todoContent,
            todoGeneralMessage: ''
        }
    }
    componentDidMount(){
		this.isMountedVal = 1;
	}
    componentWillUnmount(){
		this.isMountedVal = 0;
	}
    // TODO EVENTs, PROCESSES //
    todoAdditionProc(todoDatas, msgFromServer){
        try{
            this.setState({
                todos: [...this.state.todos, todoDatas],
                todoGeneralMessage: { type: 'norm', msg: msgFromServer }
            })
        }catch(err){
            this.handleApiError(err)
        }
    }
    
    async todoRemoveProc(url, todoid){
        try{
            const ajaxTodoDeleteRes = await doAjaxSending(url, 'DELETE', '');
            if(ajaxTodoDeleteRes.status === 'success'){
                //this.props.updateTodos(todoid)
                if(this.isMountedVal){
                    this.setState({
                        todos: this.state.todos.filter(item=>item.id !== todoid),
                        todoGeneralMessage: {type:'norm', msg: ajaxTodoDeleteRes.message }
                    })
                }
            }
        }catch(err){
            this.handleApiError(err)
        }
    }

    todoChangeStateProc(todoid, status2, notation2, update2){
        this.setState({
            todos: this.state.todos.map(item => {
                if(item.id === todoid){
                    const updated = item
                    updated.status = status2
                    updated.notation = notation2
                    updated.update= update2
                    return updated
                }
                return item
            })
        })
    }

    handleApiError(err){
        console.log(err)
        this.setState({
            todoGeneralMessage: { type: 'warn', msg: err.message }
        })

    }

    render(){
        let todosToRender = '';
        let todoAmount = 0;
        
        if( typeof this.state.todos === 'object'){
            if(this.state.todos.length > 0){
                todoAmount = this.state.todos.length;
                todosToRender = this.state.todos.map((item, index)=>{
                    if(!item.id) { return <Fragment></Fragment>}
                    return (
                        <ErrorHandler key={item.id} location={`TodoItem ${item.id}`}>
                            <TodoItem key={item.id}
                                todoDatas={item}
                                funcStateChanged={this.todoChangeStateProc}
                                funcTodoRemove={this.todoRemoveProc}
                            />
                        </ErrorHandler>
                    )
                }).sort((item1, item2) => item1.key < item2.key)
            }else{
                todosToRender = <div>No content to show!</div>
            }
        }else{
            todosToRender = <div>Error occured!</div>
        }

        return (
            <Fragment>
                <TodoInput 
                    createNewTodoUrl={this.props.createNewTodo}
                    funcTodoSave={this.todoAdditionProc}
                />
                <section className='todoList' >
                    <div className='todoInfoArea'>
                        <h3 className='titleText'>Your requested activities: {todoAmount} item</h3>
                        <ShowMessages messageContent={this.state.todoGeneralMessage} />
                    </div>
                    <div className='todoCardArea'>
                        { todosToRender }
                    </div>
                </section>
            </Fragment>
        )
    }
}

export default TodoList