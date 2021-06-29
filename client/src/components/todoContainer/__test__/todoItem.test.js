import React from 'react'
import { render, waitFor, screen, getByDisplayValue, fireEvent } from '@testing-library/react'
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
}
const todoBadInputs = {
    notationBad: 'Tooooo long notation, testing stg that really not too often happening this system, but if its happening i made the requirements of this site, so blame me for this!'
}
const datasForNoteUpd = {
    id: '1234567890abcdef12345678',
    task: 'Finish this app',
    priority: '9',
    status: 'Proceeding',
    notation: 'New notation, a proper one!',
    start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
    update: 'Thu 30 Aug 2001 09:23:13 GMT+0200 (GMT+02:00)',
}
const datasForStatusUpd ={
    id: '1234567890abcdef12345678',
    task: 'Finish this app',
    priority: '9',
    status: 'Finished',
    notation: 'Too long developing time',
    start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
    update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
    notationChangeUrl: 'todo/123/note',
    statusChangeUrl: 'todo/123/status',
}

global.fetch = jest.fn()

const assembleMockEnvelop = (sts1, sts2, values, msg)=>{
    return Promise.resolve({
        status: sts1? 200 : 400,
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
}

describe('Todo items testing, optimal cases', ()=>{
    test('General structure test', async ()=>{
        const comp = <TodoItem 
            todoDatas={datas}
        />
        expect(document.body).toHaveFocus()

        //upper line = task and delete btn row
        const { unmount } = render(comp)
        expect(screen.getByText(datas.task)).toBeInTheDocument()

        expect(screen.queryByText('Delete this task!')).not.toBeInTheDocument()
        userEvent.tab()
        expect(await screen.findByText('Delete this task!')).toBeInTheDocument()

        //upper-middle line = notation row
        const noteLine = screen.getByText(datas.notation)
        expect(noteLine).toBeInTheDocument()
        expect(noteLine).toHaveClass('todoItemForShowNote')
        expect(noteLine.parentElement).toHaveClass('todoItemForNotation')

        expect(screen.queryByText('Edit this notation!')).not.toBeInTheDocument()
        userEvent.tab()
        expect(await screen.findByText('Edit this notation!')).toBeInTheDocument()

        //middle line = prioirty row
        const priorLine = screen.getByText('Priority:')
        expect(priorLine).toBeInTheDocument()
        expect(priorLine).toHaveClass('formAndCardLabels')
        expect(priorLine.parentElement).toHaveClass('todoItemForPrioirty')
        expect(screen.getByText(datas.priority)).toBeInTheDocument()

        //lower-middle line = dating row
        expect(screen.getByText('Start:')).toBeInTheDocument()
        expect(screen.getByText('Update:')).toBeInTheDocument()

        //lower line = state row
        const statusText = screen.getByText('State:')
        expect(statusText).toBeInTheDocument()
        expect(screen.queryByText('Make this task to done!')).not.toBeInTheDocument()
        userEvent.tab()
        expect(await screen.findByText('Make this task to done!')).toBeInTheDocument()

        userEvent.tab()
        expect(document.body).toHaveFocus()
        unmount()
    })

    test('Notation changing, good input, full execute', async ()=>{
        fetch.mockImplementationOnce(()=>{
            return assembleMockEnvelop(true, true, 
                datasForNoteUpd.update, 'Notation change done!')
        })
        const funcNote = jest.fn()
        const comp = <TodoItem 
            todoDatas={datas}
            funcStateChanged={funcNote}
        />
        const { unmount, rerender } = render(comp)
        expect(screen.getByText(datas.notation)).toBeInTheDocument()
        expect(document.body).toHaveFocus()
        
        //start notation change
        const firstNoteBtn = screen.getByText('edit').parentElement.parentElement
        userEvent.click(firstNoteBtn)

        //find contorlers
        const input = screen.getByLabelText('Notation:')
        expect(input).toHaveValue(datas.notation)
        expect(document.querySelector('.formTextareaCounter'))
        .toHaveTextContent('(Remained 126 from 150)')

        //fill new input
        userEvent.type(input, '{selectall}{del}'+datasForNoteUpd.notation)
        expect(await screen.findByDisplayValue(datasForNoteUpd.notation)).toBeInTheDocument();
        expect(document.querySelector('.formTextareaCounter'))
            .toHaveTextContent('(Remained 123 from 150)')
        expect(input).toHaveFocus()
    
        //testing small btn-s and its tooltips = continue structure analyze
        const acceptNoteBtn = screen.getByText('send').parentElement.parentElement
        userEvent.tab()
        expect(acceptNoteBtn).toHaveFocus()
        expect(screen.getByText('Save the new notation!')).toBeInTheDocument()
        const cancelBtn = screen.getByText('cancel') .parentElement.parentElement
        userEvent.tab()
        expect(cancelBtn).toHaveFocus()
        expect(screen.getByText('Cancel notation editing!')).toBeInTheDocument()

        //execute note change and analyze results
        userEvent.click(acceptNoteBtn)
        await waitFor(()=>{
            expect(funcNote).toHaveBeenCalledTimes(1)
        })
        
        //revise result of changing - no update
        expect(funcNote.mock.calls[0][0]).toBe(datas.id)
        expect(funcNote.mock.calls[0][1]).toBe(datas.status)
        expect(funcNote.mock.calls[0][2]).toBe(datasForNoteUpd.notation)
        expect(funcNote.mock.calls[0][3]).toBe(datasForNoteUpd.update)

        //doing the update
        const compUpd = <TodoItem 
            todoDatas={datasForNoteUpd}
            funcStateChanged={funcNote}
        />
        rerender(compUpd)
        await waitFor(()=>{
            expect(screen.getByText(datasForNoteUpd.notation)).toBeInTheDocument();
        })
        expect(screen.getByText(/^Thu, August 30, 2001/)).toBeInTheDocument()
        unmount()
    })
    
    test('Notation changing, cancelation', async ()=>{
        fetch.mockImplementationOnce(()=>{
            return null;
        })
        const funcNote = jest.fn()
        const comp = <TodoItem 
            todoDatas={datas}
            funcStateChanged={funcNote}
        />
        const { unmount } = render(comp)
    
        //find note change btn, starting it
        const firstNoteBtn = screen.getByText('edit').parentElement.parentElement
        userEvent.click(firstNoteBtn)
        expect(firstNoteBtn).not.toBeInTheDocument()

        //find cancel btn, click, analyze result
        const cancelBtn = screen.getByText('cancel').parentElement.parentElement
        expect(screen.getByDisplayValue(datas.notation)).toBeInTheDocument()
        userEvent.click(cancelBtn)
        expect(await screen.findByText(datas.notation)).toBeInTheDocument()
        expect(fetch).toHaveBeenCalledTimes(0)
        expect(funcNote).toHaveBeenCalledTimes(0)
        expect(screen.getByText('edit')).toBeInTheDocument()
        unmount()

    })


    test('Status change, then again', async ()=>{
        const funcStatus = jest.fn()
        fetch.mockImplementationOnce(()=>{
            return assembleMockEnvelop(true, true, 'Sat Jun 12 2021 10:11:50 GMT+0200 (GMT+02:00)', 'Done!')
        })
        const comp = <TodoItem 
            todoDatas={datas}
            funcStateChanged={funcStatus}
        />
        const comp2 = <TodoItem 
            todoDatas={datasForStatusUpd}
            funcStateChanged={funcStatus}
        />
        const { unmount, rerender } = render(comp)

        // revision of content
        expect(screen.getByText('Proceeding')).toBeInTheDocument()
        const setDone = screen.getByText('done').parentElement.parentElement
        expect(setDone).toHaveClass('btnCreate')

        //make todo done - still no update, but method revision
        userEvent.click(setDone)
        expect(screen.getByText('Proceeding')).toBeInTheDocument()
        await waitFor(()=>{
            expect(funcStatus).toHaveBeenCalledTimes(1)
        })

        //prepare undone process and update component
        fetch.mockImplementationOnce(()=>{
            return assembleMockEnvelop(true, true, 'Sat Jun 22 2021 10:11:50 GMT+0200 (GMT+02:00)', 'Done!')
        })
        rerender(comp2)
        expect(await screen.findByText('Finished')).toBeInTheDocument()

        //find undone btn, using it
        const setUndone = screen.getByText('close').parentElement.parentElement
        expect(setUndone).toHaveClass('btnChange')
        userEvent.click(setUndone)
        await waitFor(()=>{ 
            expect(funcStatus).toHaveBeenCalledTimes(2)
        })

        //rerender again, analyze result
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
            funcTodoRemove={funcDel}
        />

        const { unmount } = render(comp)
        fetch.mockImplementationOnce(()=>{
            return assembleMockEnvelop(true, true, '', 'Done!')
        })
        const del1 = screen.getByText('delete').parentElement.parentElement
        expect(del1).toHaveClass('btnDelete')

        userEvent.click(del1)
        const cancelBtn = screen.getByText('cancel').parentElement.parentElement
        expect(cancelBtn).toHaveClass('btnBack')
        expect(screen.getByText('Do you really delete this?')).toBeInTheDocument()

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

// textarea config makes it difficult to test
/*
describe('Todo item tests - faulty cases', ()=>{
    test('Notation changing, bad input', async ()=>{
        const funcNote = jest.fn()
        const comp = <TodoItem 
            todoDatas={datas}
            funcNoteEdit={funcNote}
        />
        const { unmount } = render(comp)

        const firstNoteBtn = screen.getByText('edit').parentElement.parentElement
        userEvent.click(firstNoteBtn)

        const acceptNoteBtn = screen.getByText('send').parentElement.parentElement
        const cancelBtn = screen.getByText('cancel').parentElement.parentElement
        const input = screen.getByLabelText('Notation:')
        userEvent.type(input, '{selectall}{del}'+todoBadInputs.notationBad)

        userEvent.click(acceptNoteBtn)
        await waitFor(()=>{
            expect(screen.getByText('Too long notation text!')).toBeInTheDocument()
        })
        userEvent.click(cancelBtn)
        expect(await screen.findByText(datas.notation)).toBeInTheDocument()
        unmount()
    })
})
*/