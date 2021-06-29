import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import TodoInput from '../TodoInput'
import renderer from 'react-test-renderer';

global.fetch = jest.fn()
const assembleMockEnvelop = (sts1, sts2, values, msg)=>{
    if(sts1){
        return Promise.resolve({
            status: 200,
            text: ()=>{
                return Promise.resolve(
                    JSON.stringify({
                        status: sts2? 'success' : 'failed',
                        report: {
                            value: values
                        },
                        message: msg
                        
                })
            )}
        })
    }else{
        return Promise.reject({
            status: 400,
            text: ()=>{
                return Promise.resolve(
                    JSON.stringify({
                        status: 'failed',
                        report: {
                            value: values
                        },
                        message: msg
                        
                    })
                )}
        })
    }
}

const todoInputDatas ={
    task: 'Study lots of web techs',
    taskBad: 'You should do some real effort to make sure, this application be really good, useful, shiny and popular on the web, so you may colud get sponsores, who give you banner-advertisements!',
    priority: '7',
    notation: 'Useful they are',
    notationBad: 'Tooooo long notation, testing stg that really not too often happening this system, but if its happening i made the requirements of this site, so blame me for this!'
}
const todoSaveFeedback = {
    id: '0987654321abcdef87654321',
    task: 'Study lots of web techs',
    priority: '7',
    notation: 'Useful they are',
    start: 'sometime',
    update: 'sometime',
    notationChangeUrl: '/profile/1234/todo/5678/notation',
    statusChangeUrl: '/profile/1234/todo/5678/status',
    removingUrl: 'profile/1234/todo/5678'
}
const createTodoUrl = '/profile/1234/todo/'

describe('Todo input area tests', ()=>{


    test('Registring structure and process test, minimal good input', async ()=>{
        fetch.mockImplementationOnce((path)=>{
            if(path === createTodoUrl){
                return assembleMockEnvelop(true, true, todoSaveFeedback, 'Creation done!')
            }
        })

        const funcSave = jest.fn()
        const comp = <TodoInput 
            createNewTodoUrl={createTodoUrl}
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)

        //open todo reg area, revise input form is there
        userEvent.click(screen.getByText('Add new activity').parentElement)
        const taskArea = await screen.findByLabelText('Task:*')
        const priorArea = screen.getByLabelText('Priority:*')
        expect(screen.getByLabelText('Notation:')).toBeInTheDocument()
        expect(screen.queryByText('Add new activity')).not.toBeInTheDocument()

        //fill the form, read back and sending
        userEvent.type(taskArea, todoInputDatas.task)
        userEvent.type(priorArea, todoInputDatas.priority)
        expect(await screen.findByDisplayValue(todoInputDatas.task)).toBeInTheDocument()
        expect(screen.getByDisplayValue('0'+ todoInputDatas.priority)).toBeInTheDocument()
        const allBtn = await screen.findAllByRole('button')
        userEvent.click(allBtn[0])

        //analyze the response
        await waitFor(()=>{
            expect(funcSave).toHaveBeenCalledTimes(1)
        })
        expect(screen.queryByText('Creation done!')).not.toBeInTheDocument()
        expect(funcSave.mock.calls[0][1]).toBe('Creation done!')
        unmount()
    })


    
    test('Registring process test, with notation', async ()=>{
        fetch.mockImplementationOnce((path)=>{
            if(path === '/profile/1234/todo/'){
                return assembleMockEnvelop(true, true, todoSaveFeedback, 'Creation done!')
            }
        })
        const funcSave = jest.fn()
        const comp = <TodoInput 
            createNewTodoUrl={createTodoUrl}
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)

        //open reg area, fill todo details and revise is there
        userEvent.click(screen.getByText('Add new activity').parentElement)
        expect(await screen.findByLabelText('Task:*')).toBeInTheDocument()
        userEvent.type(screen.getByLabelText('Task:*'), todoInputDatas.task)
        userEvent.type(screen.getByLabelText('Priority:*'), todoInputDatas.priority)
        userEvent.type(screen.getByLabelText('Notation:'), todoInputDatas.notation)
        expect(await screen.findByDisplayValue(todoInputDatas.task)).toBeInTheDocument()
        expect(screen.getByDisplayValue('0'+ todoInputDatas.priority)).toBeInTheDocument()
        expect(screen.getByDisplayValue(todoInputDatas.notation)).toBeInTheDocument()

        //sending it, analyze response
        const allBtn = await screen.findAllByRole('button')
        userEvent.click(allBtn[0])
        await waitFor(()=>{
            expect(funcSave).toHaveBeenCalledTimes(1)
        })

        expect(screen.queryByText('Creation done!')).not.toBeInTheDocument()
        expect(funcSave.mock.calls[0][1]).toBe('Creation done!')
        unmount()
    })



    test('Start registering, but close it before sending it', async ()=>{
        const funcSave = jest.fn()
        const comp = <TodoInput 
            createNewTodoUrl={createTodoUrl}
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)

        //open reg area, fill todo details
        userEvent.click(screen.getByText('Add new activity').parentElement)
        expect(await screen.findByLabelText('Task:*')).toBeInTheDocument()
        userEvent.type(screen.getByLabelText('Task:*'), todoInputDatas.task)
        userEvent.type(screen.getByLabelText('Priority:*'), todoInputDatas.priority)
        userEvent.type(screen.getByLabelText('Notation:'), todoInputDatas.notation)
        expect(await screen.findByDisplayValue(todoInputDatas.task)).toBeInTheDocument()
        expect(screen.getByDisplayValue('0'+ todoInputDatas.priority)).toBeInTheDocument()
        expect(screen.getByDisplayValue(todoInputDatas.notation)).toBeInTheDocument()

        //find cancel btn, close the area
        const allBtn = screen.getAllByRole('button')
        userEvent.click(allBtn[1])

        //reopen the area again, revise the inputs are empty
        expect(await screen.findByText('Add new activity')).toBeInTheDocument()
        userEvent.click(screen.getByText('Add new activity').parentElement)
        expect(await screen.findByLabelText('Task:*')).toHaveValue('')
        expect(screen.getByLabelText('Priority:*')).toHaveValue(0)
        expect(screen.getByLabelText('Notation:')).toHaveValue('')
        unmount()
    })
})

describe('Todo input area test - faults', ()=>{

    test('Registring structure and process test, no input', async ()=>{
        fetch.mockImplementationOnce((path)=>{
            if(path === '/profile/1234/todo/'){
                return assembleMockEnvelop(true, true, '', 'No message required!')
            }
        })
        const funcSave = jest.fn()
        const comp = <TodoInput 
            createNewTodoUrl={createTodoUrl}
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)

        //open todo reg area, sending without input
        userEvent.click(screen.getByText('Add new activity').parentElement)
        const allBtn = await screen.findAllByRole('button')
        userEvent.click(allBtn[0])

        //analyze the error msg-s
        await waitFor(()=>{
            expect(funcSave).toHaveBeenCalledTimes(0)
        })
        expect(screen.queryByText('No message required!')).not.toBeInTheDocument()
        const errorTask = screen.getByText('A task title required!')
        expect(errorTask).toBeInTheDocument()
        expect(errorTask).toHaveClass('errorText')
        expect(errorTask.parentElement).toHaveClass('msgLine')

        const errorPrior = screen.getByText('A priority is needed in range from 1 to 10!')
        expect(errorPrior).toBeInTheDocument()
        expect(errorPrior.parentElement).toHaveClass('msgLine')
        expect(errorPrior).toHaveClass('errorText')
        unmount()
    })

    //with the new textarea config makes this difficult to test
    /*
    test('Registring process test, with too long notation', async ()=>{
        const funcSave = jest.fn()
        const comp = <TodoInput 
            createNewTodoUrl={createTodoUrl}
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)
        const compTree = renderer.create(comp)

        //open input area
        userEvent.click(screen.getByText('Add new activity').parentElement)

        //fill the form
        userEvent.type(screen.getByLabelText('Task:*'), todoInputDatas.task)
        userEvent.type(screen.getByLabelText('Priority:*'), todoInputDatas.priority)
        userEvent.type(screen.getByLabelText('Notation:'), todoInputDatas.notationBad)
        expect(await screen.findByDisplayValue(todoInputDatas.task)).toBeInTheDocument();
        expect(screen.getByDisplayValue('0'+todoInputDatas.priority)).toBeInTheDocument();

        //finish todo reg, error analyze - server msg not appeareas, but validator's
        const allBtn = await screen.findAllByRole('button')
        userEvent.click(allBtn[0])
        await waitFor(()=>{
            expect(funcSave).toHaveBeenCalledTimes(0)
        })

        expect(screen.queryByText('Api error! Server is not responding!')).not.toBeInTheDocument()

        const errorPrior = screen.getByText('Too long notation text!')
        expect(errorPrior).toBeInTheDocument()
        expect(errorPrior.parentElement).toHaveClass('msgLine')
        expect(errorPrior).toHaveClass('errorText')
        unmount()
    })

    test('Registring process test, with too long task', async ()=>{
        const funcSave = jest.fn()
        const comp = <TodoInput 
            createNewTodoUrl={createTodoUrl}
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)

        //open input area, fill the form
        userEvent.click(screen.getByText('Add new activity').parentElement)
        userEvent.type(screen.getByLabelText('Task:*'), todoInputDatas.taskBad)
        userEvent.type(screen.getByLabelText('Priority:*'), todoInputDatas.priority)
        userEvent.type(screen.getByLabelText('Notation:'), todoInputDatas.notation)
        expect(await screen.findByDisplayValue(todoInputDatas.notation)).toBeInTheDocument();
        expect(screen.getByDisplayValue('0'+todoInputDatas.priority)).toBeInTheDocument();

        //finish todo reg, error analyze - server msg not appeareas, but validator's
        const allBtn = await screen.findAllByRole('button')
        userEvent.click(allBtn[0])
        await waitFor(()=>{
            expect(funcSave).toHaveBeenCalledTimes(0)
        })

        expect(screen.queryByText('Api error! Server is not responding!')).not.toBeInTheDocument()

        const errorPrior = screen.getByText('Too long task text!')
        expect(errorPrior).toBeInTheDocument()
        expect(errorPrior.parentElement).toHaveClass('msgLine')
        expect(errorPrior).toHaveClass('errorText')
        unmount()
    })
*/
    test('Registring process test, server errormessage', async ()=>{
        fetch.mockImplementationOnce((path)=>{
            if(path === '/profile/1234/todo/'){
                return assembleMockEnvelop(true, false, '', 'Todo not permitted!')
            }
        })
        const funcSave = jest.fn()
        const comp = <TodoInput 
            createNewTodoUrl={createTodoUrl}
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)

        //start todo saving, fill the form
        userEvent.click(screen.getByText('Add new activity').parentElement)
        expect(await screen.findByLabelText('Task:*')).toBeInTheDocument()
        userEvent.type(screen.getByLabelText('Task:*'), todoInputDatas.task)
        userEvent.type(screen.getByLabelText('Priority:*'), todoInputDatas.priority)
        userEvent.type(screen.getByLabelText('Notation:'), todoInputDatas.notation)
        expect(await screen.findByDisplayValue(todoInputDatas.task)).toBeInTheDocument()
        expect(screen.getByDisplayValue('0'+ todoInputDatas.priority)).toBeInTheDocument()
        expect(screen.getByDisplayValue(todoInputDatas.notation)).toBeInTheDocument()

        //sending, analyze errors - values are still there
        const allBtn = await screen.findAllByRole('button')
        userEvent.click(allBtn[0])

        expect(await screen.findByDisplayValue(todoInputDatas.task)).toBeInTheDocument()
        expect(screen.getByDisplayValue('0'+ todoInputDatas.priority)).toBeInTheDocument()
        expect(screen.getByDisplayValue(todoInputDatas.notation)).toBeInTheDocument()
        expect(screen.getByText('Todo not permitted!')).toBeInTheDocument()
        unmount()

    })
})