import { React, Component } from 'react'
import ShowMessages from '../generals/ShowMessages'
import ButtonWithIcon from '../generals/ButtonWithIcon'
import FormTextareaUnit from '../generals/FormTextareaUnit'
import FormInputUnit from '../generals/FormInputUnit'

import { todoInputRevise } from '../../utils/inputRevise'
import { doAjaxSending, smblNewTodoDatas } from '../../utils/apiMessenger.js';

class TodoInput extends Component{
    constructor(props){
        super(props)
        this.handleAPIError = this.handleAPIError.bind(this)
        this.handleToogleArea = this.handleToogleArea.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleTodoSave = this.handleTodoSave.bind(this)
        this.setInputsAndValuesBlank = this.setInputsAndValuesBlank.bind(this)
        this.state = {
            addInputShowToggle: false,
            task: '',
            priority: 0,
            notation: '',
            todoInputMsg: ''
        }
    }
    handleInputChange(event){
        const { name, value } = event.target;
        this.setState({ [name]: value })
    }
    handleAPIError(err){
        this.setState({
            todoInputMsg:  { 
                type: 'warn',
                msg: err.name.includes('Validate')? err.errorFields : err.message
            }
        })
    }
    async handleTodoSave(){
        try{
            await todoInputRevise(this.state)
            const ajaxBody = smblNewTodoDatas(this.state)
            const todoRegRes = await doAjaxSending(this.props.createNewTodoUrl, 'POST', ajaxBody)
            if(todoRegRes.status=== 'success'){
                this.props.funcTodoSave(todoRegRes.report.value, todoRegRes.message)
                this.setInputsAndValuesBlank(false)
            }else{
                this.setState({
                    todoInputMsg: {type: 'warn', msg: todoRegRes.message }
                })
            }
        }catch(err){
            this.handleAPIError(err);
        }
    }

    handleToogleArea(){
        this.setInputsAndValuesBlank(true)
    }
    setInputsAndValuesBlank(isItUserTriggered){
        if(isItUserTriggered){
            this.setState({
                addInputShowToggle: !this.state.addInputShowToggle,
                todoInputMsg: '',
                task: '',
                notation: '',
                priority: 0
            })
        }else{
            this.setState({
                task: '',
                priority: 0,
                notation: '',
                todoInputMsg: '',
                addInputShowToggle: false
            })
        }
    }

    render(){
        const errorMessage = <ShowMessages messageContent={this.state.todoInputMsg
        } />
        let todoInputContent = ''
        let todoInputClass = ''
        if(this.state.addInputShowToggle){
            todoInputClass += 'contentSetCenter'
            todoInputContent = 
            <>
                <FormTextareaUnit classes='todoInputForTask'
                    id='task' label='Task:*'
                    name='task' maxCharLength={'150'}
                    value={this.state.task}
                    funcChange={this.handleInputChange}
                >
                    It must be at most 150 character. Required!
                </FormTextareaUnit>
                <FormTextareaUnit classes='todoInputForNote'
                    id='notation' label='Notation:'
                    name='notation' maxCharLength={'150'}
                    value={this.state.notation} 
                    funcChange={this.handleInputChange}
                >
                    If you define this, it must be max 150 character!
                </FormTextareaUnit>
                <FormInputUnit classes='todoInputForPrior'
                    id='priority' label='Priority:*'
                    type='number' name='priority' numberMinMax={[ 1, 10 ]}
                    value={this.state.priority}
                    funcChange={this.handleInputChange}
                    >
                    It must be between 1-10 value. Required!
                </FormInputUnit>
                <div className='smallButtonGroupWrapper todoInputForBtn'>
                    <ButtonWithIcon sizing= 'small' iconDef='create'
                        wrapperBlockClasses='btnCreate' 
                        funcClickActivity={this.handleTodoSave}
                        >Save</ButtonWithIcon>
                    <ButtonWithIcon sizing= 'small' iconDef='cancel'
                        wrapperBlockClasses='btnBack' 
                        funcClickActivity={this.handleToogleArea}
                        >Remove input area</ButtonWithIcon>
                </div>
                <div className='todoInputForMsg'> { errorMessage }  </div>

            </>
        }else{
            todoInputClass += 'buttonGroupWrapper'
            todoInputContent = <>
                <ButtonWithIcon sizing= 'big' classes='todoInputBtn'
                    wrapperBlockClasses='btnCreate' iconDef='create'
                    funcClickActivity={this.handleToogleArea}
                    >Add new activity</ButtonWithIcon>
            </>
        }

        return(
            <section className={'todoInput cardAreaEdge cardAreaPadding ' + todoInputClass}
                data-testid='todoInputToTest'>
                { todoInputContent }
            </section>
        )
    }
    
}

export default TodoInput