import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import TodoInput from '../TodoInput'

describe('Todo input area tests', ()=>{

    const addData ={
        id: '0987654321abcdef87654321',
        task: 'Study lots of web techs',
        priority: '7',
        notation: 'Useful they are',
        notationBad: 'Tooooo long notation, testing stg that really not too often happening this system, but if its happening i made the requirements of this site, so blame me for this!'
    }

    test('Registring structure and process test, minimal good input', async ()=>{
        const funcSave = jest.fn()
        const comp = <TodoInput 
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)

        const taskArea = screen.getByLabelText('Task:*')
        expect(taskArea).toBeInTheDocument()
        const noteArea = screen.getByLabelText('Notation:')
        expect(noteArea).toBeInTheDocument()
        const priorArea = screen.getByLabelText('Priority:*')
        expect(priorArea).toBeInTheDocument()
        const saveBtn = screen.getByText('Save')
        expect(saveBtn).toBeInTheDocument()

        userEvent.type(taskArea, addData.task)
        userEvent.type(priorArea, addData.priority)
        userEvent.click(await screen.findByText('Save'))
        await waitFor(()=>{
            expect(funcSave).toHaveBeenCalledTimes(1)
        })
        unmount()
    })

    test('Registring structure and process test, no input', async ()=>{
        const funcSave = jest.fn()
        const comp = <TodoInput 
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)

        userEvent.click(await screen.findByText('Save'))
        await waitFor(()=>{
            expect(funcSave).toHaveBeenCalledTimes(0)
        })
        const errorTask = screen.getByText('A task title required!')
        expect(errorTask).toBeInTheDocument()
        expect(errorTask).toHaveClass('errorText')
        expect(errorTask.parentElement).toHaveClass('errorLine')

        const errorPrior = screen.getByText('A priority is needed in range from 1 to 10!')
        expect(errorPrior).toBeInTheDocument()
        expect(errorPrior).toHaveClass('errorText')
        expect(errorPrior.parentElement).toHaveClass('errorLine')
        unmount()
    })
    
    test('Registring process test, with notation', async ()=>{
        const funcSave = jest.fn()
        const comp = <TodoInput 
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)

        userEvent.type(screen.getByLabelText('Task:*'), addData.task)
        userEvent.type(screen.getByLabelText('Priority:*'), addData.priority)
        userEvent.type(screen.getByLabelText('Notation:'), addData.notation)
        userEvent.click(await screen.findByText('Save'))
        await waitFor(()=>{
            expect(funcSave).toHaveBeenCalledTimes(1)
        })
        unmount()
    })

    test('Registring process test, with too long notation', async ()=>{
        const funcSave = jest.fn()
        const comp = <TodoInput 
            funcTodoSave={funcSave}
        />
        const { unmount } = render(comp)

        userEvent.type(screen.getByLabelText('Task:*'), addData.task)
        userEvent.type(screen.getByLabelText('Priority:*'), addData.priority)
        userEvent.type(screen.getByLabelText('Notation:'), addData.notationBad)
        userEvent.click(await screen.findByText('Save'))
        await waitFor(()=>{
            expect(funcSave).toHaveBeenCalledTimes(0)
        })

        const errorPrior = screen.getByText('Too long notation text!')
        expect(errorPrior).toBeInTheDocument()
        expect(errorPrior).toHaveClass('errorText')
        expect(errorPrior.parentElement).toHaveClass('errorLine')
        unmount()
    })
})