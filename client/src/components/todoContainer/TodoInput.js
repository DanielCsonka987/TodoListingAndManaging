import { React, Component} from 'react'
import FormInputUnit from '../generals/FormInputUnit'
import ShowMessages from '../generals/ShowMessages'

import { todoInputRevise } from '../../utils/inputRevise'
import interpretError from '../../utils/interpretProblems'


class TodoInput extends Component{
    constructor(props){
        super(props)
        this.handleAPIError = this.handleAPIError.bind(this)

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleTodoSave = this.handleTodoSave.bind(this)
        this.state = {
            userid: props.userid,

            task: '',
            priority: 0,
            notation: '',
            todoLocalSaveMessage: ''
        }
    }
    handleInputChange(event){
        const { name, value } = event.target;
        this.setState({ [name]: value })
    }
    handleAPIError(err){
        interpretError(err, 'todoLocalSaveMessage', this.handleInputChange)
    }
    async handleTodoSave(){
        try{
            await todoInputRevise(this.state)
            this.props.funcTodoSave(this.state)
            this.setState({
                task: '',
                priority: 0,
                notation: '',
                todoLocalSaveMessage: ''
            })
        }catch(err){
            this.handleAPIError(err);
        }
    }

    render(){
        const errorMessage = <ShowMessages messageContent={
            this.state.todoLocalSaveMessage || this.props.todoSaveMessage
        } />
        return(
            <div className='todoInput'>
                <FormInputUnit classes=''
                    id='task' label='Task:*'
                    type='text' name='task' 
                    value={this.state.task}
                    funcChange={this.handleInputChange}
                >
                    It must be at most 150 character. Required!
                </FormInputUnit>
                <FormInputUnit classes=''
                    id='priority' label='Priority:*'
                    type='number' name='priority' 
                    value={this.state.prioirty}
                    funcChange={this.handleInputChange}
                >
                    It must be between 1-10 value. Required!
                </FormInputUnit>
                <FormInputUnit classes=''
                    id='notation' label='Notation:*'
                    type='text' name='notation' 
                    value={this.state.notation}
                    funcChange={this.handleInputChange}
                >
                    If you define this, it must be 150 character!
                </FormInputUnit>
                { errorMessage }
                <button className='btnCreate' onClick={this.handleTodoSave}>Save</button>
            </div>
        )
    }
    
}

export default TodoInput