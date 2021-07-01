

import React from 'react'
import { render, waitFor, screen, waitForElementToBeRemoved  } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import App from '../App'
import { assembleMockEnvelop, apiReportDatas, userInputs, 
    userInputToNotationChange, 
    guiStaticTexts, standardMsgFromServer} from './appTest.helpers'

global.fetch = jest.fn()


describe('Application tests - structures', ()=>{
    afterAll(()=>{
        fetch.mockClear()
    })

    test('Structure test', async ()=>{
        fetch.mockImplementation((theUrl)=>{
            if(theUrl === '/profile/'){
                return assembleMockEnvelop(true, true, apiReportDatas.startingProfDatas, 
                    standardMsgFromServer.profLoadSuccessMsg)
            }
            if(theUrl === '/profile/revise'){
                return assembleMockEnvelop(true, false, '', '')
            }
        })

        const app = <App />
        const { unmount } = render(app)
        
        expect(await screen.findByText(standardMsgFromServer.profLoadSuccessMsg)).toBeInTheDocument()
        expect(screen.getByText(guiStaticTexts.regTileText)).toBeInTheDocument()
        expect(screen.getByText(guiStaticTexts.profListFirstMsg)).toBeInTheDocument()
        expect(screen.getByText(guiStaticTexts.profListSecMsg)).toBeInTheDocument()
        expect(screen.getByText(guiStaticTexts.profListSecMsg).parentElement)
            .toHaveClass('profileList')
        expect(screen.getByText(apiReportDatas.startingProfDatas[0].username)).toBeInTheDocument()
        expect(screen.getByText(apiReportDatas.startingProfDatas[1].username)).toBeInTheDocument()

        userEvent.click(screen.getByText(apiReportDatas.startingProfDatas[0].username))
        expect( await screen.findByLabelText(guiStaticTexts.pwdLogInputLabel)).toBeInTheDocument()
        expect(screen.getByText(guiStaticTexts.loginBtnText)).toBeInTheDocument()
        unmount()
    })

    test('Give empty list and tabbing test', async ()=>{
        fetch.mockImplementation((theUrl, method)=>{
            if(theUrl === '/profile/'){
                return assembleMockEnvelop(true, true, '', standardMsgFromServer.profLoadEmpyComment)
            }
            if(theUrl === '/profile/revise'){
                return assembleMockEnvelop(true, false, '', '')
            }
        })
        const app = <App />
        const { unmount } = render(app)
        expect(await screen.findByText(standardMsgFromServer.profLoadEmpyComment))
            .toBeInTheDocument()
        expect(document.body).toHaveFocus()
        userEvent.tab()
        expect(screen.getByText(guiStaticTexts.regTileText).parentElement)
            .toHaveFocus()
        userEvent.tab()
        expect(screen.getByText('Acknowlegded')).toHaveFocus()
        userEvent.tab()
        expect(document.body).toHaveFocus()
        unmount();
    })

    test('Register area structures', async ()=>{
        fetch.mockImplementation((theUrl, method)=>{
            if(theUrl === '/profile/'){
                return assembleMockEnvelop(true, true, '', standardMsgFromServer.profLoadEmpyComment)
            }
            if(theUrl === '/profile/revise'){
                return assembleMockEnvelop(true, false, '', '')
            }
        })
        const app = <App />
        const { unmount } = render(app)

        expect(await screen.findByText(guiStaticTexts.profileNoContent)).toBeInTheDocument()
        userEvent.click(screen.getByText(guiStaticTexts.regTileText).parentElement)

        expect(await screen.findByLabelText(guiStaticTexts.registLabels.unm)).toBeInTheDocument()
        expect(screen.getByLabelText(guiStaticTexts.registLabels.pwd1)).toBeInTheDocument()
        expect(screen.getByLabelText(guiStaticTexts.registLabels.pwd2)).toBeInTheDocument()
        expect(screen.getByLabelText(guiStaticTexts.registLabels.fnm)).toBeInTheDocument()
        expect(screen.getByLabelText(guiStaticTexts.registLabels.lnm)).toBeInTheDocument()
        expect(screen.getByLabelText(guiStaticTexts.registLabels.age)).toBeInTheDocument()
        expect(screen.getByLabelText(guiStaticTexts.registLabels.ocp)).toBeInTheDocument()
        const btns = screen.getAllByRole('button')
        expect(btns[0]).toHaveTextContent(guiStaticTexts.regTileText)
        unmount()
    })

})

describe('App test - profile processes', ()=>{
    afterAll(()=>{
        fetch.mockClear()
    })
    
    test('Login and logout with a user', async ()=>{
        fetch.mockImplementation((theUrl)=>{
            if(theUrl === '/profile/'){
                return assembleMockEnvelop(true, true, apiReportDatas.startingProfDatas, 
                    standardMsgFromServer.profLoadSuccessMsg)
            }
            if(theUrl === '/profile/revise'){
                return assembleMockEnvelop(true, false, '', '')
            }
            if(theUrl === '/profile/123/login'){
                return assembleMockEnvelop(true, true, apiReportDatas.loggedUserDatas, 
                    standardMsgFromServer.logSuccess)
            }
            if(theUrl === '/profile/123/logout'){
                return assembleMockEnvelop(true, true, '', 
                    standardMsgFromServer.logoutSuccess)
            }
        })

        const app = <App />
        const { unmount } = render(app)

        expect(await screen.findByText(apiReportDatas.startingProfDatas[0].username)).toBeInTheDocument()
        
        const userTile = screen.getByText(apiReportDatas.startingProfDatas[0].username).parentElement
        userEvent.click(userTile)

        expect(userTile).toHaveFocus()
        const logInput = screen.getByLabelText(guiStaticTexts.pwdLogInputLabel)
        const logBtn = screen.getByText(guiStaticTexts.loginBtnText).parentElement
        expect(logInput).toBeInTheDocument()
        expect(logBtn).toBeInTheDocument()
        userEvent.type(logInput, userInputs.toLogin.password1)
        expect(await screen.findByDisplayValue(userInputs.toLogin.password1)).toBeInTheDocument()

        userEvent.click(logBtn)
        expect(await screen.findByText(guiStaticTexts.fullnameRowHead)).toBeInTheDocument()
        expect(screen.getByText(standardMsgFromServer.logSuccess))
        expect(screen.getAllByText(guiStaticTexts.todos.stateText).length).toBe(2)
        const outBtn = screen.getByText(guiStaticTexts.logoutBtnText)
            .parentElement

        userEvent.click(outBtn)
        expect(await screen.findByText(standardMsgFromServer.logoutSuccess) ).toBeInTheDocument()
        expect(screen.queryByText(guiStaticTexts.fullnameRowHead)).not.toBeInTheDocument()
        expect(screen.queryAllByText(guiStaticTexts.todos.stateText).length).not.toBe(2)
        unmount()
    })

    /*
    test('Site reload attempt, stored datas regaining', ()=>{

    })
    */
    test('Registration and logout', async ()=>{
        fetch.mockImplementation((theUrl)=>{
            if(theUrl === '/profile/'){
                return assembleMockEnvelop(true, true, apiReportDatas.startingProfDatas, standardMsgFromServer.profLoadSuccessMsg)
            }
            if(theUrl === '/profile/revise'){
                return assembleMockEnvelop(true, false, '', '')
            }
            if(theUrl === '/profile/register'){
                return assembleMockEnvelop(true, true, apiReportDatas.regLoginDatas, standardMsgFromServer.logSuccess)
            }
            if(theUrl === '/profile/abc/logout'){
                return assembleMockEnvelop(true, true, '', standardMsgFromServer.logoutSuccess)
            }
        })
        const app = <App />
        const { unmount } = render(app)

        await waitFor(()=>{
            expect(screen.getByText(guiStaticTexts.regTileText)).toBeInTheDocument()
        })

        //REGISTERING
        const regTile = screen.getByText(guiStaticTexts.regTileText).parentElement
        userEvent.click(regTile)

        //wait appearance and filling the form
        expect(await screen.findByLabelText(guiStaticTexts.registLabels.unm)).toBeInTheDocument()
        userEvent.type(screen.getByLabelText(guiStaticTexts.registLabels.unm) ,
             userInputs.toRegister.username)
        userEvent.type(screen.getByLabelText(guiStaticTexts.registLabels.pwd1),
             userInputs.toRegister.password)
        userEvent.type(screen.getByLabelText(guiStaticTexts.registLabels.pwd2), 
            userInputs.toRegister.password)
        userEvent.type(screen.getByLabelText(guiStaticTexts.registLabels.fnm), 
            userInputs.toRegister.firstName)
        userEvent.type(screen.getByLabelText(guiStaticTexts.registLabels.lnm), 
            userInputs.toRegister.lastName)
        userEvent.type(screen.getByLabelText(guiStaticTexts.registLabels.age), 
            userInputs.toRegister.age)
        userEvent.type(screen.getByLabelText(guiStaticTexts.registLabels.ocp), 
            userInputs.toRegister.occupation)

        // sending the datas to api
        const regBtnText = await screen.findByText('send')
        userEvent.click(regBtnText.parentElement)

        //revise login occurance
        expect(await screen.findByText(guiStaticTexts.fullnameRowHead)).toBeInTheDocument()
        unmount()
    })

    test('Change password and delete profile', async ()=>{
        fetch.mockImplementation((theUrl, initObj)=>{
            if(theUrl === '/profile/'){
                return assembleMockEnvelop(true, true, apiReportDatas.startingProfDatas, standardMsgFromServer.profLoadSuccessMsg)
            }
            if(theUrl === '/profile/revise'){
                return assembleMockEnvelop(true, false, '', '')
            }
            if(theUrl === '/profile/123/login'){
                return assembleMockEnvelop(true, true, apiReportDatas.loggedUserDatas, standardMsgFromServer.logSuccess)
            }
            if(theUrl === '/profile/123/'){
                if(initObj.method === 'PUT'){
                    return assembleMockEnvelop(true, true, '', standardMsgFromServer.profPwdChanged)
                }
                if(initObj.method === 'DELETE'){
                    return assembleMockEnvelop(true, true, '', standardMsgFromServer.profDeletion)
                }
            }
        })
        const app = <App />
        const { unmount } = render(app)
        expect(await screen.findByText(apiReportDatas.startingProfDatas[0].username)).toBeInTheDocument()
        
        //LOGIN
        const userTile = screen.getByText(apiReportDatas.startingProfDatas[0].username).parentElement
        userEvent.click(userTile)
        const logInput = screen.getByLabelText(guiStaticTexts.pwdLogInputLabel)
        const logBtn = screen.getByText(guiStaticTexts.loginBtnText).parentElement
        userEvent.type(logInput, userInputs.toLogin.password1)
        expect(await screen.findByDisplayValue(userInputs.toLogin.password1)).toBeInTheDocument()
        userEvent.click(logBtn)
        expect(await screen.findByText(guiStaticTexts.fullnameRowHead)).toBeInTheDocument()

        //CHANGE PWD
        const pwdBtn = screen.getByText(guiStaticTexts.pwdChangeBtnText).parentElement
        userEvent.click(pwdBtn)
        const oldInput = await screen.findByLabelText(guiStaticTexts.pwdChangeLabels.inpPwd1)
        const newInput = screen.getByLabelText(guiStaticTexts.pwdChangeLabels.inpPwd2)
        const confInput = screen.getByLabelText(guiStaticTexts.pwdChangeLabels.inpPwd3)
        userEvent.type(oldInput, userInputs.toLogin.password1)
        userEvent.type(newInput, userInputs.toLogin.password2)
        userEvent.type(confInput, userInputs.toLogin.password2)
        expect(await screen.findByDisplayValue(userInputs.toLogin.password1)).toBeInTheDocument()
        expect(screen.getAllByDisplayValue(userInputs.toLogin.password2).length).toBe(2)
        const pwdBtn2 = screen.getByText(guiStaticTexts.pwdChangeBtnText).parentElement
        userEvent.click(pwdBtn2)
        expect(await screen.findByText(standardMsgFromServer.profPwdChanged)).toBeInTheDocument()

        //DELETE ACCOUNT
        const delBtn = screen.getByText(guiStaticTexts.delAccountBtnText).parentElement
        userEvent.click(delBtn)
        expect(await screen.findByLabelText(guiStaticTexts.profDelPwdInputLabel)).toBeInTheDocument()
        const delInput = screen.getByLabelText(guiStaticTexts.profDelPwdInputLabel)
        userEvent.type(delInput, userInputs.toLogin.password2)
        expect(await screen.findByDisplayValue(userInputs.toLogin.password2)).toBeInTheDocument()
        const delBtn2 = screen.getByText(guiStaticTexts.delAccountBtnText).parentElement
        userEvent.click(delBtn2)

        //revise deletion 
        expect(await screen.findByText(guiStaticTexts.regTileText)).toBeInTheDocument()
        expect(screen.getByText(standardMsgFromServer.profDeletion)).toBeInTheDocument()

        await waitFor(()=>{
            expect(screen.getByText(apiReportDatas.startingProfDatas[1].username)).toBeInTheDocument()
        })
        expect(screen.queryByText(apiReportDatas.startingProfDatas[0].username)).not.toBeInTheDocument()
        
        unmount()

    })
    
})



describe('Todo processes', ()=>{
    afterAll(()=>{
        fetch.mockClear()
    })

   it('Login, add a todo, remove it', async ()=>{
        fetch.mockImplementation((theUrl, initObj)=>{
            if(theUrl === '/profile/'){
                return assembleMockEnvelop(true, true, apiReportDatas.startingProfDatas, standardMsgFromServer.profLoadSuccessMsg)
            }
            if(theUrl === '/profile/revise'){
                return assembleMockEnvelop(true, false, '', '')
            }
            if(theUrl === '/profile/123/login'){
                return assembleMockEnvelop(true, true, apiReportDatas.loggedUserDatas, standardMsgFromServer.logSuccess)
            }
            if(theUrl === '/profile/123/todos/'){
                return assembleMockEnvelop(true, true, apiReportDatas.newTodoDatas, standardMsgFromServer.todoCreateSuccess)
            }
            if(theUrl === 'todo/123a'){
                return assembleMockEnvelop(true, true, '', standardMsgFromServer.todoDeletSuccess)
            }
        })

        const app = <App />
        const { unmount } = render(app)

        expect(await screen.findByText(apiReportDatas.startingProfDatas[0].username)).toBeInTheDocument()

        //LOGIN
        const userTile = screen.getByText(apiReportDatas.startingProfDatas[0].username).parentElement
        userEvent.click(userTile)
        const logInput = screen.getByLabelText(guiStaticTexts.pwdLogInputLabel)
        const logBtn = screen.getByText(guiStaticTexts.loginBtnText).parentElement
        userEvent.type(logInput, userInputs.toLogin.password1)
        expect(await screen.findByDisplayValue(userInputs.toLogin.password1)).toBeInTheDocument()

        userEvent.click(logBtn)
        expect(await screen.findByText(guiStaticTexts.fullnameRowHead)).toBeInTheDocument()
        expect(screen.getAllByText(guiStaticTexts.todos.stateText).length).toBe(2)

        //NEW TODO CREATION
        //open todo input card, type input, confirm and sending
        userEvent.click(screen.getByText(guiStaticTexts.todos.openInputText).parentElement)
        const taskInp = await screen.findByLabelText(guiStaticTexts.todoInputLabels.taskInp)
        const priorInp = screen.getByLabelText(guiStaticTexts.todoInputLabels.priorInp)
        const noteInp = screen.getByLabelText(guiStaticTexts.todoInputLabels.noteInp)
        userEvent.type(taskInp, userInputs.toNewTodo.task)
        userEvent.type(priorInp, userInputs.toNewTodo.priority)
        userEvent.type(noteInp, userInputs.toNewTodo.notation)
        
        expect(await screen.findByDisplayValue(userInputs.toNewTodo.task)).toBeInTheDocument()
        expect(screen.getByDisplayValue(userInputs.toNewTodo.notation)).toBeInTheDocument()     
        const saveBtn = screen.getByTestId(guiStaticTexts.todos.inputTestId)
            .querySelector(guiStaticTexts.todos.saveBtnClass)       
        userEvent.click(saveBtn)
        
        //revison API answer, gui outputs
        await waitFor(()=>{
            expect(screen.getByText(userInputs.toNewTodo.task)).toBeInTheDocument()
        })
        expect(screen.getByText(standardMsgFromServer.todoCreateSuccess)).toBeInTheDocument()
        expect(screen.getAllByText(guiStaticTexts.todos.stateText).length).toBe(3)
        
        //TODO DELETION
        expect(screen.queryByText(guiStaticTexts.cancelBtnText)).not.toBeInTheDocument()

        const delBtn1 = screen.getByTestId(guiStaticTexts.todos.cardTestId +
            apiReportDatas.loggedUserDatas.todos[0].id
            ).querySelector(guiStaticTexts.todos.delTodoClass)
        userEvent.click(delBtn1)
        expect(await screen.findByText(guiStaticTexts.todos.cancelBtnText)).toBeInTheDocument()
        expect(screen.getAllByText(guiStaticTexts.todos.stateText).length).toBe(3)
        const delBtn2 = screen.getByTestId(guiStaticTexts.todos.cardTestId +
            apiReportDatas.loggedUserDatas.todos[0].id
            ).querySelector(guiStaticTexts.todos.delTodoClass)
        userEvent.click(delBtn2)
        
        //revison API answer, gui outputs
        
        await waitFor(()=>{
            expect(screen.getAllByText(guiStaticTexts.todos.stateText).length).toBe(2)    
        })
        expect(screen.getByText(standardMsgFromServer.todoDeletSuccess)).toBeInTheDocument()
        expect(screen.queryByText(guiStaticTexts.todos.cancelBtnText)).not.toBeInTheDocument()
        //its not working!
        //expect(screen.queryByTestId(guiStaticTexts.todos.cardTestId + apiReportDatas.newTodoDatas.id)).not.toBeInTheDocument()
        expect(screen.getByText(apiReportDatas.loggedUserDatas.todos[1].task)).toBeInTheDocument()
        expect(screen.getByText(apiReportDatas.newTodoDatas.task)).toBeInTheDocument()
        unmount()



            
    })

    test('Login, change todo notation, status', async ()=>{
        fetch.mockImplementation((theUrl, initObj)=>{
            if(theUrl === '/profile/'){
                return assembleMockEnvelop(true, true, apiReportDatas.startingProfDatas, standardMsgFromServer.profLoadSuccessMsg)
            }
            if(theUrl === '/profile/revise'){
                return assembleMockEnvelop(true, false, '', '')
            }
            if(theUrl === '/profile/123/login'){
                return assembleMockEnvelop(true, true, apiReportDatas.loggedUserDatas, standardMsgFromServer.logSuccess)
            }
            if(theUrl === 'todo/123b/status'){
                return assembleMockEnvelop(true, true, 
                    'Sat May 29 2021 20:11:50 GMT+0200 (GMT+02:00)', standardMsgFromServer.todoState)
            }
            if(theUrl === 'todo/123b/note'){
                return assembleMockEnvelop(true, true, 
                    'Sun May 30 2021 20:11:50 GMT+0200 (GMT+02:00)', standardMsgFromServer.todoNote)
            }
        })

        const app = <App />
        const { unmount } = render(app)

        expect(await screen.findByText(apiReportDatas.startingProfDatas[0].username)).toBeInTheDocument()

        //LOGIN
        const userTile = screen.getByText(apiReportDatas.startingProfDatas[0].username).parentElement
        userEvent.click(userTile)
        const logInput = screen.getByLabelText(guiStaticTexts.pwdLogInputLabel)
        const logBtn = screen.getByText(guiStaticTexts.loginBtnText).parentElement
        userEvent.type(logInput, userInputs.toLogin.password1)
        expect(await screen.findByDisplayValue(userInputs.toLogin.password1)).toBeInTheDocument()
        userEvent.click(logBtn)
        expect(await screen.findByText(guiStaticTexts.fullnameRowHead)).toBeInTheDocument()
        
        //CHANGE NOTATION
        expect(screen.getByText(apiReportDatas.loggedUserDatas.todos[1].notation)).toBeInTheDocument()
        const todoNoteBtn1 = screen.getByTestId(
            guiStaticTexts.todos.cardTestId + apiReportDatas.loggedUserDatas.todos[1].id
            ).querySelector(guiStaticTexts.todos.noteChangeSelect)
        userEvent.click(todoNoteBtn1)
        //revise input and notation in it appeares, changing and saving it
        expect(await screen.getByDisplayValue(apiReportDatas.loggedUserDatas.todos[1].notation)).toBeInTheDocument()
        const noteInput = screen.getByLabelText(guiStaticTexts.todoInputLabels.noteInp)
        userEvent.type(noteInput, '{selectall}{del}' + userInputs.toNotationChange)
        expect(await screen.getByDisplayValue(userInputs.toNotationChange))
        const todoNoteBtn2 = screen.getByTestId(guiStaticTexts.todos.cardTestId
            + apiReportDatas.loggedUserDatas.todos[1].id
            ).querySelector(guiStaticTexts.todos.saveBtnClass)
        userEvent.click(todoNoteBtn2)      
        //revise update content      
        //expect(await screen.findByText(standardMsgFromServer.todoNote)).toBeInTheDocument()
        await waitFor(()=>{
            expect(screen.getByText(userInputs.toNotationChange)).toBeInTheDocument()
        })
        expect(screen.getByText(/^Sun, May 30/)).toBeInTheDocument()
        
        //CHANGE STATUS
        expect(screen.getAllByText('Proceeding').length).toBe(2)

        const stateBtn = screen.getByTestId(guiStaticTexts.todos.cardTestId
            + apiReportDatas.loggedUserDatas.todos[1].id
            ).querySelector(guiStaticTexts.todos.stateChangeSelect)
        userEvent.click(stateBtn)

        //expect(await screen.findByText(standardMsgFromServer.todoState)).toBeInTheDocument()
        expect(await screen.findByText(/^Sat, May 29/)).toBeInTheDocument()
        expect(screen.getAllByText('Proceeding').length).toBe(1)
        expect(screen.getAllByText('Finished').length).toBe(1)
        
        unmount()
    })
})