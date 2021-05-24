import React from 'react'
import { render, waitFor, screen, getByDisplayValue } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import TodoItem from '../TodoItem'

const datas = {
        id: '1234567890abcdef12345678',
        task: 'Finish this app',
        priority: '9',
        status: 'Proceeding',
        notation: 'Too long developing time',
        start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
        update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
        notationChangeUrl: 'todo/123/note',
        statusChangeUrl: 'todo/123/status',
        removingUrl: 'todo/123',
        notationGood: 'New notation, a proper one!',
        notationBad: 'Tooooo long notation, testing stg that really not too often happening this system, but if its happening i made the requirements of this site, so blame me for this!'
    }
const datas2 ={
    id: '1234567890abcdef12345678',
    task: 'Finish this app',
    priority: '9',
    status: 'Finished',
    notation: 'Too long developing time',
    start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
    update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
}
describe('Todo items testing', ()=>{
    test('General structure test', async ()=>{
        const comp = <TodoItem 
            todoDatas={datas}
            messageFromAbove = 'Stg to test!'
        />
        //upper line
        const { unmount } = render(comp)
        const taskLine = screen.getByText('Task:')
        expect(taskLine).toBeInTheDocument()
        expect(taskLine).toHaveClass('todoItemCardAras')
        expect(taskLine).toHaveClass('dataLabelMarking')
        expect(taskLine.parentElement).toHaveClass('todoItemCardAreas')
        expect(screen.getByText(datas.task)).toBeInTheDocument()

        //upper-middle line
        const noteLine = screen.getByText('Notation:')
        expect(noteLine).toBeInTheDocument()
        expect(noteLine).toHaveClass('dataLabelMarking')
        expect(noteLine.parentElement).toHaveClass('todoItemForNote')
        expect(screen.getByText(datas.notation)).toBeInTheDocument()

        expect(screen.queryByText('Edit this notation!')).not.toBeInTheDocument()
        userEvent.tab()
        expect(await screen.findByText('Edit this notation!')).toBeInTheDocument()

        //middle line
        const priorLine = screen.getByText('Priority:')
        expect(priorLine).toBeInTheDocument()
        expect(priorLine).toHaveClass('dataLabelMarking')
        expect(priorLine.parentElement).toHaveClass('todoItemCardAreas')
        expect(screen.getByText(datas.priority)).toBeInTheDocument()

        //lower-middle line
        expect(screen.getByText('Start:')).toBeInTheDocument()
        expect(screen.getByText('Update:')).toBeInTheDocument()

        //lower line
        const statusText = screen.getByText('Status:')
        expect(statusText).toBeInTheDocument()
        expect(screen.queryByText('Make this task to done!')).not.toBeInTheDocument()
        userEvent.tab()
        expect(await screen.findByText('Make this task to done!')).toBeInTheDocument()
        expect(screen.queryByText('Delete this task!')).not.toBeInTheDocument()
        userEvent.tab()
        expect(await screen.findByText('Delete this task!')).toBeInTheDocument()

        userEvent.tab()
        expect(document.body).toHaveFocus()
        unmount()
    })

    test('Notation changing, good input, full execute', async ()=>{
        const funcNote = jest.fn()
        const comp = <TodoItem 
            todoDatas={datas}
            messageFromAbove = 'Stg to test!'
            funcNoteEdit={funcNote}
        />
        const { unmount } = render(comp)

        const firstNoteBtn = screen.getByText('edit').parentElement.parentElement
        userEvent.click(firstNoteBtn)

        const cancelBtn = screen.getByText('cancel') .parentElement.parentElement
        const acceptNoteBtn = screen.getByText('send').parentElement.parentElement

        const input = screen.getByLabelText('Notation:')
        expect(input).toHaveValue(datas.notation)
        userEvent.type(input, '{selectall}{del}'+datas.notationGood)
        expect(await screen.findByDisplayValue(datas.notationGood)).toBeInTheDocument();
        userEvent.click(acceptNoteBtn)
        await waitFor(()=>{
            expect(funcNote).toHaveBeenCalledTimes(1)
        })
        unmount()
    })

    test('Notation changing, bad input', async ()=>{
        const funcNote = jest.fn()
        const comp = <TodoItem 
            todoDatas={datas}
            messageFromAbove = 'Stg to test!'
            funcNoteEdit={funcNote}
        />
        const { unmount } = render(comp)

        expect(screen.getByText('Stg to test!')).toBeInTheDocument()
        const firstNoteBtn = screen.getByText('edit').parentElement.parentElement
        userEvent.click(firstNoteBtn)

        const acceptNoteBtn = screen.getByText('send').parentElement.parentElement
        const cancelBtn = screen.getByText('cancel').parentElement.parentElement
        const input = screen.getByLabelText('Notation:')
        userEvent.type(input, '{selectall}{del}'+datas.notationBad)

        userEvent.click(acceptNoteBtn)
        await waitFor(()=>{
            expect(screen.getByText('Too long notation text!')).toBeInTheDocument()
        })
        userEvent.click(cancelBtn)
        expect(await screen.findByText(datas.notation)).toBeInTheDocument()
        expect(funcNote).toHaveBeenCalledTimes(0)
        unmount()
    })
    
    test('Notation changing, cancelation', async ()=>{
        const funcNote = jest.fn()
        const comp = <TodoItem 
            todoDatas={datas}
            messageFromAbove = 'Stg to test!'
            funcNoteEdit={funcNote}
        />
        const { unmount } = render(comp)
    
        const firstNoteBtn = screen.getByText('edit').parentElement.parentElement
        userEvent.click(firstNoteBtn)
    
        const cancelBtn = screen.getByText('cancel').parentElement.parentElement
        expect(screen.getByDisplayValue(datas.notation)).toBeInTheDocument()
    
        userEvent.click(cancelBtn)
        expect(await screen.findByText(datas.notation)).toBeInTheDocument()
        expect(funcNote).toHaveBeenCalledTimes(0)
    
        unmount()

    })

    test('Status change, then again', async ()=>{
        const funcStatus = jest.fn()
        const comp = <TodoItem 
            todoDatas={datas}
            messageFromAbove = 'Stg to test!'
            funcStatusEdit={funcStatus}
        />
        const comp2 = <TodoItem 
            todoDatas={datas2}
            messageFromAbove = 'Stg to test!'
            funcStatusEdit={funcStatus}
        />
        const { unmount, rerender } = render(comp)

        expect(screen.getByText('Proceeding')).toBeInTheDocument()
        const setDone = screen.getByText('done').parentElement.parentElement
        expect(setDone).toHaveClass('btnCreate')
        userEvent.click(setDone)
        await waitFor(()=>{
            expect(funcStatus).toHaveBeenCalledTimes(1)
        })

        rerender(comp2)
        expect(await screen.findByText('Finished')).toBeInTheDocument()
        const setUndone = screen.getByText('close').parentElement.parentElement
        expect(setUndone).toHaveClass('btnChange')
        userEvent.click(setUndone)
        await waitFor(()=>{
            expect(funcStatus).toHaveBeenCalledTimes(2)
        })

        rerender(comp)
        expect(await screen.findByText('Proceeding')).toBeInTheDocument()
        const setDone2 = screen.getByText('done').parentElement.parentElement
        expect(setDone2).toHaveClass('btnCreate')
        unmount()
    })

    test('Deletion, accepted', async ()=>{
        const funcDel = jest.fn()
        const comp = <TodoItem 
            todoDatas={datas}
            messageFromAbove = 'Stg to test!'
            funcTodoRemove={funcDel}
        />

        const { unmount } = render(comp)

        const del1 = screen.getByText('delete').parentElement.parentElement
        expect(del1).toHaveClass('btnDelete')

        userEvent.click(del1)
        const cancelBtn = screen.getByText('cancel').parentElement.parentElement
        expect(cancelBtn).toHaveClass('btnBack')
        const del2 = screen.getByText('delete').parentElement.parentElement
        expect(del2).toHaveClass('btnDelete')

        userEvent.click(del2)
        expect(funcDel).toHaveBeenCalledTimes(1)
        unmount()
    })

    test('Deletion, cancelled', ()=>{
        const funcDel = jest.fn()
        const comp = <TodoItem 
            todoDatas={datas}
            messageFromAbove = 'Stg to test!'
            funcTodoRemove={funcDel}
        />

        const { unmount } = render(comp)

        const del1 = screen.getByText('delete').parentElement.parentElement
        expect(del1).toHaveClass('btnDelete')

        userEvent.click(del1)
        const cancelBtn = screen.getByText('cancel').parentElement.parentElement

        userEvent.click(cancelBtn)
        expect(funcDel).toHaveBeenCalledTimes(0)
        unmount()
    })
})