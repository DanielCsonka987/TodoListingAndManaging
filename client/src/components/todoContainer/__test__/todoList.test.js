import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import TodoList from '../TodoList'

const datas = [
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

const todoMessage1 = {
    ident: -1,
    msg: 'Text to test this testcase'
}
const todoMessage2 = {
    ident: '1234567890abcdef12345678',
    msg: 'Test text to a single todo'
}

describe('Todo list testing', ()=>{
    test('List structure testing', async ()=>{
        const save = jest.fn()
        const state = jest.fn()
        const note = jest.fn()
        const remove = jest.fn()

        const list1 = <TodoList 
            userid='1234567890fedcba01123456'
            todoContent={datas}
            todoListMessage={todoMessage1}
            funcTodoSave={save}
            funcStatusEdit={state}
            funcNoteEdit={note}
            funcTodoRemove={remove}
        />
        const list2 = <TodoList 
            userid='1234567890fedcba01123456'
            todoContent={datas}
            todoListMessage={todoMessage2}
            funcTodoSave={save}
            funcStatusEdit={state}
            funcNoteEdit={note}
            funcTodoRemove={remove}
        />
        const { unmount, rerender } = render(list1)
        const allTodoTask = screen.getAllByText('Task:')
        expect(allTodoTask.length).toBe(2)
        expect(screen.getByText(todoMessage1.msg)).toBeInTheDocument()
        expect(screen.getByText(todoMessage1.msg).parentElement.parentElement).toHaveClass('todoInputForMsg')

        rerender(list2)
        expect(await screen.findByText(todoMessage2.msg)).toBeInTheDocument()
        
        expect(screen.getByText(todoMessage2.msg).parentElement.parentElement).toHaveClass('cardArea')
        unmount()
    })
})