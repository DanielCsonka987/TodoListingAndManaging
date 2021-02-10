import { React, Component} from 'react'
import { todoInputRevise } from '../../utils/inputRevise'
import FormInputUnit from '../generals/FormInputUnit'

class TodoInput extends Component{
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleTodoSave = this.handleTodoSave.bind(this)
        this.state = {
            userid: props.userid,
            todoMessage: '',
            task: '',
            priority: 0,
            notation: ''
        }
    }
    handleChange(event){
        const { name, value } = event.target;
        this.setState({ [name]: value })
    }
    handleTodoSave(){
        todoInputRevise(this.state)
        .then(()=>{
            this.props.funcTodoSave(this.state);
            this.setState({
                task: '',
                priority: 0,
                notation: ''
            })
        })
        .catch(error=>{
            this.setState({ todoMessage: error})
        })
    }

    render(){

        return(
            <div className='todoInput'>
                <FormInputUnit classes=''
                    id='task' label='Task:*'
                    type='text' name='task' 
                    value={this.state.task}
                    funcChange={this.handleChange}
                >
                    It must be at most 150 character. Required!
                </FormInputUnit>
                <FormInputUnit classes=''
                    id='prior' label='Priority:*'
                    type='number' name='priority' 
                    value={this.state.prioirty}
                    funcChange={this.handleChange}
                >
                    It must be between 1-10 value. Required!
                </FormInputUnit>
                <FormInputUnit classes=''
                    id='note' label='Notation:*'
                    type='text' name='notation' 
                    value={this.state.notation}
                    funcChange={this.handleChange}
                >
                    If you define this, it must be 150 character!
                </FormInputUnit>
                <p>{this.state.todoMessage}</p>
                <button onClick={this.handleTodoSave}>Save</button>
            </div>
        )
    }
    
}

export default TodoInput