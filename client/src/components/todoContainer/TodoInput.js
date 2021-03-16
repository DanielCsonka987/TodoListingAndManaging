import { React, Component} from 'react'
import FormInputUnit from '../generals/FormInputUnit'
import ShowMessages from '../generals/ShowMessages'
import ButtonWithIcon from '../generals/ButtonWithIcon'

import { todoInputRevise } from '../../utils/inputRevise'
import interpretError from '../../utils/interpretProblems'

const todoInputFirstRowLayout={
    width: '100%',
    padding: '1%',

    display: 'grid',
    gridTemplateColumns: '5fr 5fr 3fr',
    gridTemplateRows: '1fr 1fr 1fr auto',
    gridGap: '5px'
}
const todoInputTask = {
    gridColumn: '1/3',
    gridRow: '1'
}
const todoInputNote = {
    gridColumn: '1/3',
    gridRow: '2'
}
const todoInputBtn = {
    gridColumn: '3/4',
    gridRow: '1/3'
}
const todoInputPrior = {
    gridColumn: '2/3',
    gridRow: '3'
}
const todoMessage ={
    gridColumn: '1/4',
    gridRow: '4'

}

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
            <div className='todoItemWidth cardArea wrapperColumnAllCenter' >
                <div style={ todoInputFirstRowLayout } className='todoItemCardAreas' >
                        <FormInputUnit classes='' additWrapperStyles={ todoInputTask }
                            id='task' label='Task:*'
                            type='text' name='task' 
                            value={this.state.task} neededInputWidth={ '70%' }
                            funcChange={this.handleInputChange}
                        >
                            It must be at most 150 character. Required!
                        </FormInputUnit>
                        <FormInputUnit classes='' additWrapperStyles={ todoInputNote }
                            id='notation' label='Notation:'
                            type='text' name='notation' 
                            value={this.state.notation} neededInputWidth={ '70%' }
                            funcChange={this.handleInputChange}
                        >
                            If you define this, it must be max 150 character!
                        </FormInputUnit>
                        <ButtonWithIcon sizing= 'big' additWrapperStyles={ todoInputBtn }
                                wrapperBlockClasses='btnCreate' iconDef='create'
                                funcClickActivity={this.handleTodoSave}
                                >Save</ButtonWithIcon>

                        <FormInputUnit classes='' additWrapperStyles={ todoInputPrior }
                            id='priority' label='Priority:*'
                            type='number' name='priority' numberMinMax={[ 1, 10 ]}
                            value={this.state.prioirty}
                            funcChange={this.handleInputChange}
                        >
                            It must be between 1-10 value. Required!
                        </FormInputUnit>
                    <div style={todoMessage}>   { errorMessage }  </div>
                </div>

            </div>
        )
    }
    
}

export default TodoInput