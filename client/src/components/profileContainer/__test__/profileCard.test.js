import React from 'react'
import { waitFor, fireEvent, screen, render } from '@testing-library/react'
import ProfileItem from '../ProfileItem'
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event'
import { text } from 'body-parser';

global.fetch = jest.fn()

const logInput = {
    userid: '1',
    username: 'SomeOne',
    password: '123Test',
    password2: 'StgTestPwd',
    password3: 'Test123Pwd', 
    pwdBad1: 'f',
    pwdBad2: 't'
}

const logServerInput = {
    first_name: 'NoOne',
    last_name: 'someOne',
    changePwdDelAccUrl: 'stg/toManage',
    logoutUrl: 'stg/toLogout'
}

const fetchAnswer = ( needResolve, statusNum, textJSON)=>{

    if (needResolve){
        return Promise.resolve({
            status: statusNum,
            text: ()=>{ return Promise.resolve(
                JSON.stringify( textJSON )
            )}
        })
    }else{
        return Promise.reject({
            status: statusNum,
            text: ()=>{ return Promise.resolve(
                JSON.stringify( textJSON )
            )}
        })
    }
}

describe('Profile item component test - success screen', ()=>{
    test('Basic logged out state initial structural test', async ()=>{
        const funcOnFocus = jest.fn()
        const comp = <ProfileItem 
            userid=''
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus=''
            funcCardFocus={funcOnFocus}
        />
        const compUpd = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            funcCardFocus={funcOnFocus}

        />
        const { rerender, debug, unmount} = render(comp)

        const userTileHeader = screen.queryByText(logInput.username).parentElement
        expect(userTileHeader).toBeInTheDocument()
        expect(screen.queryByLabelText('Password:')).not.toBeInTheDocument()
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
        userEvent.click(userTileHeader)
        expect(funcOnFocus).toHaveBeenCalledTimes(1)
        rerender(compUpd)
        await waitFor(()=>{
            const theInput = screen.queryByLabelText('Password:')
            const theBtn = screen.queryByRole('button')
            const theBtnText = screen.queryByText('Login')
            expect(theInput).toBeInTheDocument()
            expect(theBtn).toBeInTheDocument()
            expect(theBtnText).toBeInTheDocument()
        })
        unmount()
    })
    test('Proper login-logout process, proper server answer', async ()=>{
        
        fetch.mockImplementationOnce( ()=>{
            return fetchAnswer(true, 200, {
                status: 'success',
                report: {
                    value: 'true'
                },
                message: 'Login done!'
            })
        })

        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn(
            (apiMsg, text)=>{
            expect(apiMsg).toBe('true')
            expect(text).toBe('login')
        })
        const funcLogout = jest.fn((useridToLogout)=>{
            expect(useridToLogout).toBe(logInput.userid)
        })
        const compStart = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus=''
            funcCardFocus={funcOnFocus}
        />
        const compUpdFocus = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
        />
        const compUpdLogged = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            userExtraDatas={ logServerInput }
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
            funcLogoutProc={funcLogout}
        />
        const { rerender, debug, unmount} = render(compStart)

        //open user card
        const userTileHeader = screen.getByText(logInput.username).parentElement
        userEvent.click(userTileHeader)
        rerender(compUpdFocus)

        //select input, write pwd
        const theInput = screen.getByLabelText('Password:')
        userEvent.type(theInput, logInput.password)
        expect(await screen.findByLabelText('Password:')).toHaveValue(logInput.password)

        //login
        const theBtnLogin = screen.getByRole('button')            
        userEvent.click(theBtnLogin)
        await waitFor( ()=>{
            expect(funcLogin).toHaveBeenCalledTimes(1)
        })
        rerender(compUpdLogged)
        fetch.mockImplementationOnce( ()=>{
            return fetchAnswer(true, 200, {
                status: 'success',
                report: {
                    value: '121212121212121212121212'   //not important, not in used
                },
                message: 'Logout done!'
            })
        })

        //revise logged in state
        expect(await screen.findByText('Change password')).toBeInTheDocument()
        expect(screen.getByText('Delete account')).toBeInTheDocument()

        //logout
        const theBtnLogout = screen.getByText('Logout')
        userEvent.click(theBtnLogout)
        await waitFor(()=>{
            expect(funcLogout).toHaveBeenCalledTimes(1)
        })
        unmount()
    })

    test('Login, change password', async ()=>{

        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn()

        const compUpdLogged = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            userExtraDatas={ logServerInput }
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
        />
        const { unmount } = render(compUpdLogged)

        //find and click pwd change btn, validat form and controller existence
        userEvent.click(screen.getByText('Change password'))
        expect(await screen.findByLabelText('Old password:')).toBeInTheDocument()
        expect(screen.getByLabelText('New password:')).toBeInTheDocument()
        expect(screen.getByLabelText('Password again:')).toBeInTheDocument()
        expect(screen.getByText('Change password')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()

        //fill the form to change pwd - confirm inputs are there
        userEvent.type(screen.getByLabelText('Old password:'), logInput.password)
        userEvent.type(screen.getByLabelText('New password:'), logInput.password)
        userEvent.type(screen.getByLabelText('Password again:'), logInput.password)
        const allInput = await screen.findAllByDisplayValue(logInput.password)
        expect(allInput.length).toBe(3)

        //execute pwd change, find server confirm message
        fetch.mockImplementationOnce( ()=>{
            return fetchAnswer(true, 200, {
                report: {
                    value: 'true'
                },
                message: 'Password changed!'
            })
        })
        userEvent.click(screen.getByText('Change password'))
        expect(await screen.findByText('Password changed!')).toBeInTheDocument()
        unmount()
    })

    test('Login, password change, cancel it', async ()=>{

        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn()
        const compUpdLogged = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            userExtraDatas={{
                first_name: 'NoOne',
                last_name: 'someOne',
                changePwdDelAccUrl: 'stg/toManage'
            }}
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
        />
        const { debug, unmount } = render(compUpdLogged)

        //start to change pwd
        userEvent.click(screen.getByText('Change password'))
        await waitFor(()=>{
            expect(screen.queryByLabelText('Old password:')).toBeInTheDocument()
        })
        expect(screen.getByLabelText('New password:')).toBeInTheDocument()
        expect(screen.getByLabelText('Password again:')).toBeInTheDocument()
        expect(screen.getByText('Change password')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()

        //cancelation and revision of normal state
        userEvent.click(screen.getByText('Cancel'))
        await waitFor(()=>{
            expect(screen.queryByLabelText('Old password:')).not.toBeInTheDocument()
        })
        expect(screen.queryByLabelText('New password:')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('Password again:')).not.toBeInTheDocument()
        expect(screen.getByText('Change password')).toBeInTheDocument()
        expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
        unmount()
    })

    

    test('Login, delete account', async ()=>{

        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn()
        const funcDel = jest.fn()

        const compUpdLogged = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            userExtraDatas={{
                first_name: 'NoOne',
                last_name: 'someOne'
            }}
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
            funcCardRemoval={funcDel}
        />
        const { debug, unmount } = render(compUpdLogged)

        //start delete, find input form
        const btnDel = screen.getByText('Delete account')
        userEvent.click(btnDel)
        expect(await screen.findByLabelText('Password:')).toBeInTheDocument()
        expect(screen.getByText('Delete account')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()

        userEvent.type(screen.getByLabelText('Password:'), logInput.password)
        userEvent.click(screen.getByText('Delete account'))
        await waitFor(()=>{
            expect(funcDel).toHaveBeenCalledTimes(1)
        })
        unmount()
    })

    test('Login, delete acccount, canceled', async ()=>{
        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn()
        const funcDel = jest.fn()
        const compUpdLogged = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            userExtraDatas={{
                first_name: 'NoOne',
                last_name: 'someOne'
            }}
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
            funcCardRemoval={funcDel}
        />
        const { debug, unmount } = render(compUpdLogged)

        //start deletion
        const btnDel = screen.getByText('Delete account')
        expect(btnDel).toBeInTheDocument()
        userEvent.click(btnDel)

        // revise the input forms are there
        expect(await screen.findByLabelText('Password:')).toBeInTheDocument()
        expect(screen.getByText('Delete account')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()

        // cancelation
        userEvent.click(screen.getByText('Cancel'))

        // identif no inputs there
        await waitFor(()=>{
            expect(screen.queryByLabelText('Password:')).not.toBeInTheDocument()
        })
        expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
        expect(screen.getByText('Delete account')).toBeInTheDocument()

        expect(funcDel).toHaveBeenCalledTimes(0)
        unmount()
    })
})

describe('Profile item componenet tests - fail screen', ()=>{
  
    test('Login process, falied server response', async ()=>{
        fetch.mockImplementationOnce( ()=>{
            return fetchAnswer(false, 400, {
                status: 'failed',
                report: {
                    value: 'Stg went really wrong!'
                },
                message: 'Login failed!'
            }) 
        })
        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn(
            (apiMsg, text)=>{
            expect(apiMsg).toBe('true')
            expect(text).toBe('login')
        })
        const comp = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus=''
            funcCardFocus={funcOnFocus}
        />
        const compUpdFocus = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
        />

        const { debug, rerender, unmount } = render(comp)
        const userTileHeader = screen.getByText(logInput.username).parentElement
        userEvent.click(userTileHeader)
        rerender(compUpdFocus)

        //give pwd input and login
        const theInput = screen.getByLabelText('Password:')
        userEvent.type(theInput, logInput.password)
        const theBtn = screen.getByRole('button')            
        userEvent.click(theBtn)

        //revise the error message
        expect(await screen.findByText('Login failed!')).toBeInTheDocument()
        unmount()
    })
    
    test('Delete account, server issue - no related url given', async ()=>{
        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn()
        const funcDel = jest.fn()
        const compUpdLogged = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            userExtraDatas={{
                first_name: 'NoOne',
                last_name: 'someOne'
            }}
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
            funcCardRemoval={funcDel}
        />
        const { debug, unmount } = render(compUpdLogged)

        //find del btn and revise inputs are there
        const btnDel = screen.getByText('Delete account')
        userEvent.click(btnDel)
        expect(screen.getByLabelText('Password:')).toBeInTheDocument()
        expect(screen.getByText('Delete account')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()

        //give password
        userEvent.type(screen.getByLabelText('Password:'), logInput.password)
        userEvent.click(screen.getByText('Delete account'))
        await waitFor(()=>{
            expect(funcDel).toHaveBeenCalledTimes(0)
        })
        unmount()
    })

    test('Delete account, front validate issue', async()=>{
        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn()
        const funcDel = jest.fn()
        const compUpdLogged = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            userExtraDatas={{
                first_name: 'NoOne',
                last_name: 'someOne'
            }}
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
            funcCardRemoval={funcDel}
        />
        const { debug, unmount } = render(compUpdLogged)

        //start deletion, input appearance
        const btnDel = screen.getByText('Delete account')
        userEvent.click(btnDel)
        expect(await screen.findByLabelText('Password:')).toBeInTheDocument()
        expect(screen.getByText('Delete account')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()
        
        //give wrong pwd, read back
        userEvent.type(screen.getByLabelText('Password:'), logInput.pwdBad1)
        expect(await screen.findByDisplayValue(logInput.pwdBad1))

        userEvent.click(screen.getByText('Delete account'))

        //find error message, inputs are there
        expect(await screen.findByText('Password is not acceptable!')).toBeInTheDocument()
        expect(screen.getByLabelText('Password:')).toBeInTheDocument()
        expect(screen.getByText('Delete account')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()

        expect(funcDel).toHaveBeenCalledTimes(0)
        
        unmount()
    })

    test('Password change, front validation issue 1, old and new incorrect', async ()=>{
        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn()
        const compUpdLogged = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            userExtraDatas={{
                first_name: 'NoOne',
                last_name: 'someOne',
                changePwdDelAccUrl: 'stg/toManage'
            }}
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
        />
        const { debug, unmount } = render(compUpdLogged)

        //start pwd change, revise inputs are there
        userEvent.click(screen.getByText('Change password'))
        expect(await screen.findByLabelText('Old password:')).toBeInTheDocument()
        expect(screen.getByLabelText('New password:')).toBeInTheDocument()
        expect(screen.getByLabelText('Password again:')).toBeInTheDocument()
        expect(screen.getByText('Change password')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()

        //giving bad pwd inputs, read back
        userEvent.type(screen.getByLabelText('Old password:'), logInput.pwdBad1)
        userEvent.type(screen.getByLabelText('New password:'), logInput.pwdBad2)
        userEvent.type(screen.getByLabelText('Password again:'), logInput.pwdBad2)
        expect(await screen.findByDisplayValue(logInput.pwdBad1)).toBeInTheDocument()
        expect(screen.getAllByDisplayValue(logInput.pwdBad2).length).toBe(2)

        //attempt finish pwd change, find error messages
        userEvent.click(screen.getByText('Change password'))
        expect(await screen.findByText('Previous password is not acceptable!')).toBeInTheDocument()
        expect(screen.getByText('New password is not acceptable!')).toBeInTheDocument()
        unmount()
    })
    
    test('Password change, front validation issue 2, new pwd and confrim difference', async ()=>{
        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn()
        const compUpdLogged = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            userExtraDatas={{
                first_name: 'NoOne',
                last_name: 'someOne',
                changePwdDelAccUrl: 'stg/toManage'
            }}
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
        />
        const { debug, unmount } = render(compUpdLogged)

        //start pwd change, revise inputs are there
        userEvent.click(screen.getByText('Change password'))
        expect(await screen.findByLabelText('Old password:')).toBeInTheDocument()
        expect(screen.getByLabelText('New password:')).toBeInTheDocument()
        expect(screen.getByLabelText('Password again:')).toBeInTheDocument()
        expect(screen.getByText('Change password')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()

        //giving bad pwd inputs, read back
        userEvent.type(screen.getByLabelText('Old password:'), logInput.password)
        userEvent.type(screen.getByLabelText('New password:'), logInput.password2)
        userEvent.type(screen.getByLabelText('Password again:'), logInput.password3)
        expect(await screen.findByDisplayValue(logInput.password)).toBeInTheDocument()
        expect(screen.getByDisplayValue(logInput.password2)).toBeInTheDocument()
        expect(screen.getByDisplayValue(logInput.password3)).toBeInTheDocument()

        //attempt finish change, revise errormessage appearance
        userEvent.click(screen.getByText('Change password'))
        expect(await screen.findByText('New passwords are not matching!')).toBeInTheDocument()
        unmount()
    })
})