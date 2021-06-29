import React from 'react'
import { render, waitFor, screen, findByText } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import TodoList from '../TodoList'

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
                )
            }
        })
    }else{

    }
}

let datas = {
    createNewTodo: '/profile/123/todos/',
    todos: [
        {
            id: '1234567890abcdef12345678',
            task: 'Finish this app',
            priority: '9',
            status: 'Proceeding',
            notation: 'Too long developing time',
            start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
            update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
            notationChangeUrl: 'todo/123/note',
            statusChangeUrl: 'todo/123/status',
            removingUrl: 'todo/123'
        },
        {
            id: '1234567890abcdef87654321',
            task: 'Study javascript more agile',
            priority: '6',
            status: 'Proceeding',
            notation: 'Too lasy you are',
            start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
            update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
            notationChangeUrl: 'todo/123/note',
            statusChangeUrl: 'todo/123/status',
            removingUrl: 'todo/123'
        }
    ]
}

const newTodo = {
    id: '012345abcdef67890abcdef0',
    task: 'Finish the testing here!',
    priority: '6',
    status: 'Proceeding',
    notation: 'Not far from the finish...',
    start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
    update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
    notationChangeUrl: 'todo/987/note',
    statusChangeUrl: 'todo/987/status',
    removingUrl: 'todo/987'
}

global.fetch = jest.fn()

describe('Todo list testing', ()=>{
    test('List structure testing', async ()=>{

        const list = <TodoList 
            todoContent={datas.todos}
            createNewTodo={datas.createNewTodo}
        />
        const { unmount } = render(list)
        const allTodoTask = await screen.findAllByText('State:')
        expect(allTodoTask.length).toBe(2)
        expect(screen.getByText(datas.todos[0].task)).toBeInTheDocument()
        expect(screen.getByText(datas.todos[0].notation)).toBeInTheDocument()
        expect(screen.getByText(datas.todos[1].task)).toBeInTheDocument()
        expect(screen.getByText(datas.todos[1].notation)).toBeInTheDocument()

        //summarising the components
        expect(screen.getAllByRole('button').length).toBe(7)
        expect(screen.getByText('Add new activity')).toBeInTheDocument()
        expect(screen.getAllByText('edit').length).toBe(2)
        expect(screen.getAllByText('delete').length).toBe(2)
        expect(screen.getAllByText('done').length).toBe(2)
        unmount()
    })


    // addition, removal testing needed!
    test('Todo addition', async ()=>{
        fetch.mockImplementationOnce(()=>{
            return assembleMockEnvelop(true, true, newTodo, 'Creation done!')
        })
        const list = <TodoList 
            todoContent={datas.todos}
            createNewTodo={datas.createNewTodo}
        />
        const { unmount } = render(list)

        //measure todo amount, start input area
        const allTodoTask = await screen.findAllByText('State:')
        expect(allTodoTask.length).toBe(2)
        userEvent.click(screen.getByText('Add new activity').parentElement)
        const taskInput = screen.getByLabelText('Task:*')
        const priorInput = screen.getByLabelText('Priority:*')
        const noteInput = screen.getByLabelText('Notation:')

        //fill the form, 
        userEvent.type(taskInput, newTodo.task)
        userEvent.type(priorInput, newTodo.priority)
        userEvent.type(noteInput, newTodo.notation)
        expect(await screen.findByDisplayValue(newTodo.task)).toBeInTheDocument()
        expect(screen.getByDisplayValue('0'+ newTodo.priority)).toBeInTheDocument()
        expect(screen.getByDisplayValue(newTodo.notation)).toBeInTheDocument()

        //sending and analyze result, input area dessappeared
        userEvent.click(screen.getByText('create').parentElement.parentElement)
        await waitFor(()=>{
            expect(screen.getByText(newTodo.task)).toBeInTheDocument()
        })
        expect(screen.getByText(newTodo.notation)).toBeInTheDocument()

        expect(screen.queryByLabelText('Task:*')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('Priority:*')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('Notation:')).not.toBeInTheDocument()

        //new amont of todos in list revised
        expect(screen.getAllByText('State:').length).toBe(3)
        unmount()
    })

    const additNote = ' Stg to find in test...'
    const servStateChange = 'Status change done!'
    const servNoteChange = 'Notation change done!'
    const date1 = 'Sun May 30 2021 20:11:50 GMT+0200 (GMT+02:00)'
    const date2 = 'Mon May 31 2021 20:11:50 GMT+0200 (GMT+02:00)'
    test('Todo modification - notation, status', async ()=>{
        fetch.mockImplementation((path)=>{
            if(path.includes('note')){
                return assembleMockEnvelop(true, true, date1, servNoteChange )
            }
            if(path.includes('status')){
                return assembleMockEnvelop(true, true, date2, servStateChange)
            }
        })
        const list = <TodoList 
            todoContent={datas.todos}
            createNewTodo={datas.createNewTodo}
        />
        const { unmount } = render(list)
        const allTodoTask = await screen.findAllByText('State:')
        expect(allTodoTask.length).toBe(2)

        expect(screen.getByText(datas.todos[0].task)).toBeInTheDocument()

        const note1Btn = screen.getByTestId('todoCard1234567890abcdef12345678')
            .querySelector('.btnChange')
        userEvent.click(note1Btn)
        const inputNote = await screen.findByLabelText('Notation:')
        userEvent.type(inputNote, additNote)
        expect(await screen.findByDisplayValue(datas.todos[0].notation + additNote)).toBeInTheDocument()
        expect(screen.getByText('cancel')).toBeInTheDocument()
        const note2Btn = screen.getByTestId('todoCard1234567890abcdef12345678')
            .querySelector('.btnCreate')
        userEvent.click(note2Btn)

        expect(await screen.findByText(datas.todos[0].notation + additNote)).toBeInTheDocument
        expect(screen.queryByText('send')).not.toBeInTheDocument()
        expect(screen.queryByText('cancel')).not.toBeInTheDocument()
        expect(screen.getByText('Sun, May 30, 2021, 20:11')).toBeInTheDocument()

        expect(screen.getAllByText('Proceeding').length).toBe(2)
        expect(screen.queryAllByText('Finished').length).toBe(0)
        const doneBtn = screen.getByTestId('todoCard1234567890abcdef12345678')
            .querySelector('button[name="forStatus"]')
        userEvent.click(doneBtn)

        expect(await screen.findByText('Finished')).toBeInTheDocument()
        expect(screen.getAllByText('Proceeding').length).toBe(1)
        expect(screen.getByText('Mon, May 31, 2021, 20:11')).toBeInTheDocument()
        
        await waitFor(()=>{
            const undoneBtn = screen.getByTestId('todoCard1234567890abcdef12345678')
                .querySelector('button[name="forStatus"]')
            userEvent.click(undoneBtn)
            expect(screen.getAllByText('Proceeding').length).toBe(2)
            expect(screen.queryAllByText('Finished').length).toBe(0)
        })
        unmount()
        fetch.mockClear()
    })
    
    test('Delet a todo from list', async ()=>{
        fetch.mockImplementationOnce((path)=>{
            if(path.includes('todo/123')){
                return assembleMockEnvelop(true, true, '', 'Deletion done!')
            }
        })

        const list = <TodoList 
            todoContent={datas.todos}
            createNewTodo={datas.createNewTodo}
        />
        const { unmount } = render(list)
        const allTodoTask = await screen.findAllByText('State:')
        expect(allTodoTask.length).toBe(2)

        const del1Btn = screen.getByTestId('todoCard1234567890abcdef12345678').querySelector('.btnDelete')
        userEvent.click(del1Btn)

        expect(screen.getByText('cancel')).toBeInTheDocument()
        expect(screen.getAllByText('State:').length).toBe(2)
        const del2Btn = screen.getByTestId('todoCard1234567890abcdef12345678').querySelector('.btnDelete')
        userEvent.click(del2Btn)

        await waitFor(()=>{
            expect(screen.getAllByText('State:').length).toBe(1)
            expect(screen.queryByText('todoCard1234567890abcdef12345678')).not.toBeInTheDocument()
            expect(screen.queryByText('cancel')).not.toBeInTheDocument()
        })

        unmount()
    })
    
})