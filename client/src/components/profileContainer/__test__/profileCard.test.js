import React from 'react'
import { waitFor, fireEvent, screen, render } from '@testing-library/react'
import ProfileItem from '../ProfileItem'
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event'
import { text } from 'body-parser';

global.fetch = jest.fn()

const fetchAnswer = ( needReject, status, textJSON)=>{

    if (needReject){
        return Promise.reject({
            status: status,
            text: ()=>{ return Promise.resolve(
                JSON.stringify( textJSON )
            )}
        })
    }else{
        return Promise.resolve({
            status: status,
            text: ()=>{ return Promise.resolve(
                JSON.stringify( textJSON )
            )}
        })
    }
}

describe('Profile item componenet tests', ()=>{
    const logInput = {
        userid: '1234567890abcdef12345678',
        username: 'forTest12',
        password: 'forTest12',
        pwdBad1: 'f',
        pwdBad2: 't'
    }
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

    test('Login process, falied server response', async ()=>{
        fetch.mockImplementationOnce( ()=>{
            return fetchAnswer(true, 400, {
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
        const theInput = screen.getByLabelText('Password:')
        userEvent.type(theInput, logInput.password)
        const theBtn = screen.getByRole('button')            
        userEvent.click(theBtn)
        await waitFor(()=>{

            expect(screen.queryByText('Login failed!')).toBeInTheDocument()
        })
        unmount()
    })
    
    
    test('Proper login-logout process, proper server answer', async ()=>{
        
        fetch.mockImplementationOnce( ()=>{
            return fetchAnswer(false, 200, {
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
        const compUpdLogged = <ProfileItem 
            userid={logInput.userid}
            username={logInput.username}
            loginUrl='stg'
            cardOnFocus='1'
            userExtraDatas={{
                first_name: 'NoOne',
                last_name: 'someOne',
                logoutUrl: 'stg/toLogout'
            }}
            funcCardFocus={funcOnFocus}
            funcLoginProc={funcLogin}
            funcLogoutProc={funcLogout}
        />
        const { rerender, debug, unmount} = render(comp)
        const userTileHeader = screen.getByText(logInput.username).parentElement
        userEvent.click(userTileHeader)
        rerender(compUpdFocus)
        const theInput = screen.getByLabelText('Password:')
        userEvent.type(theInput, logInput.password)

        const theBtn = screen.getByRole('button')            
        userEvent.click(theBtn)
        await waitFor( ()=>{
            expect(funcLogin).toHaveBeenCalledTimes(1)
        })
        rerender(compUpdLogged)
        fetch.mockImplementationOnce( ()=>{
            return fetchAnswer(false, 200, {
                report: {
                    value: '121212121212121212121212'   //not important, not in used
                },
                message: 'Logout done!'
            })
        })
        await waitFor(()=>{
            expect(screen.queryByText('Change password')).toBeInTheDocument()
            expect(screen.queryByText('Delete account')).toBeInTheDocument()
            const theBtn2 = screen.queryByText('Logout')
            expect(theBtn2).toBeInTheDocument()
            userEvent.click(theBtn2)
            expect(funcLogout).toHaveBeenCalledTimes(1)
        })
        unmount()
    })

    test('Login, change password', async ()=>{
        fetch.mockImplementationOnce( ()=>{
            return fetchAnswer(false, 200, {
                report: {
                    value: 'true'
                },
                message: 'Login done!'
            })
        })

        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn()
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
        const { debug, rerender, unmount } = render(comp)
        userEvent.click(screen.getByText(logInput.username).parentElement)
        rerender(compUpdFocus)
        userEvent.type(screen.getByLabelText('Password:'), logInput.password)
        userEvent.click(screen.getByRole('button') )
        rerender(compUpdLogged)
        userEvent.click(screen.getByText('Change password'))
        await waitFor(()=>{
            expect(screen.queryByLabelText('Old password:')).toBeInTheDocument()
            expect(screen.queryByLabelText('New password:')).toBeInTheDocument()
            expect(screen.queryByLabelText('Password again:')).toBeInTheDocument()
            expect(screen.queryByText('Change password')).toBeInTheDocument()
            expect(screen.queryByText('Cancel')).toBeInTheDocument()
        })
        userEvent.type(screen.getByLabelText('Old password:'), logInput.password)
        userEvent.type(screen.getByLabelText('New password:'), logInput.password)
        userEvent.type(screen.getByLabelText('Password again:'), logInput.password)
        fetch.mockImplementationOnce( ()=>{
            return fetchAnswer(false, 200, {
                report: {
                    value: 'true'
                },
                message: 'Password changed!'
            })
        })
        userEvent.click(screen.getByText('Change password'))
        await waitFor(()=>{
            expect(screen.queryByText('Password changed!')).toBeInTheDocument()
        })

        unmount()
    })

    test('Password change, cancel it', async ()=>{

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
        userEvent.click(screen.getByText('Change password'))
        await waitFor(()=>{
            expect(screen.queryByLabelText('Old password:')).toBeInTheDocument()
            expect(screen.queryByLabelText('New password:')).toBeInTheDocument()
            expect(screen.queryByLabelText('Password again:')).toBeInTheDocument()
            expect(screen.queryByText('Change password')).toBeInTheDocument()
            expect(screen.queryByText('Cancel')).toBeInTheDocument()
        })
        userEvent.click(screen.getByText('Cancel'))
        await waitFor(()=>{
            expect(screen.queryByLabelText('Old password:')).not.toBeInTheDocument()
            expect(screen.queryByLabelText('New password:')).not.toBeInTheDocument()
            expect(screen.queryByLabelText('Password again:')).not.toBeInTheDocument()
            expect(screen.queryByText('Change password')).toBeInTheDocument()
            expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
        })
        unmount()
    })

    test('Password change, front validation issue', async ()=>{
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

        userEvent.click(screen.getByText('Change password'))
        await waitFor(()=>{
            expect(screen.queryByLabelText('Old password:')).toBeInTheDocument()
            expect(screen.queryByLabelText('New password:')).toBeInTheDocument()
            expect(screen.queryByLabelText('Password again:')).toBeInTheDocument()
            expect(screen.queryByText('Change password')).toBeInTheDocument()
            expect(screen.queryByText('Cancel')).toBeInTheDocument()
        })
        
        userEvent.type(screen.getByLabelText('Old password:'), logInput.pwdBad1)
        userEvent.type(screen.getByLabelText('New password:'), logInput.pwdBad1)
        userEvent.type(screen.getByLabelText('Password again:'), logInput.pwdBad2)
        userEvent.click(screen.getByText('Change password'))
        await waitFor(()=>{
            expect(screen.queryByText('Previous password is not acceptable!')).toBeInTheDocument()
            expect(screen.queryByText('New password is not acceptable!')).toBeInTheDocument()
            expect(screen.queryByText('New passwords are not matching!')).toBeInTheDocument()
        })
        unmount()
    })

    test('Login, delete account', async ()=>{
        fetch.mockImplementationOnce( ()=>{
            return fetchAnswer(false, 200, {
                report: {
                    value: 'true'
                },
                message: 'Login done!'
            })
        })
        const funcOnFocus = jest.fn()
        const funcLogin = jest.fn()
        const funcDel = jest.fn()
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
        const { debug, rerender, unmount } = render(comp)
        userEvent.click(screen.getByText(logInput.username).parentElement)
        rerender(compUpdFocus)
        userEvent.type(screen.getByLabelText('Password:'), logInput.password)
        userEvent.click(screen.getByRole('button') )
        rerender(compUpdLogged)

        const btnDel = screen.queryByText('Delete account')
        expect(btnDel).toBeInTheDocument()
        userEvent.click(btnDel)
        await waitFor(()=>{
            expect(screen.queryByLabelText('Password:')).toBeInTheDocument()
            expect(screen.queryByText('Delete account')).toBeInTheDocument()
            expect(screen.queryByText('Cancel')).toBeInTheDocument()

        })
        userEvent.type(screen.getByLabelText('Password:'), logInput.password)
        userEvent.click(screen.getByText('Delete account'))
        await waitFor(()=>{
            expect(funcDel).toHaveBeenCalledTimes(1)
        })
        unmount()
    })
    
    text('Delete acccount, canceled', async ()=>{
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
        const btnDel = screen.queryByText('Delete account')
        expect(btnDel).toBeInTheDocument()
        userEvent.click(btnDel)
        await waitFor(()=>{
            expect(screen.queryByLabelText('Password:')).toBeInTheDocument()
            expect(screen.queryByText('Delete account')).toBeInTheDocument()
            expect(screen.queryByText('Cancel')).toBeInTheDocument()
        })
        userEvent.type(screen.getByLabelText('Password:'), logInput.pwdBad1)
        userEvent.click(screen.getByText('Delete account'))
        await waitFor(()=>{
            expect(screen.queryByLabelText('Password:')).not.toBeInTheDocument()
            expect(screen.queryByText('Delete account')).toBeInTheDocument()
            expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
            expect(funcDel).toHaveBeenCalledTimes(0)
        })
        unmount()
    })

    test('Delete account, server issue - no related url', async ()=>{
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
        const btnDel = screen.queryByText('Delete account')
        expect(btnDel).toBeInTheDocument()
        userEvent.click(btnDel)
        await waitFor(()=>{
            expect(screen.queryByLabelText('Password:')).toBeInTheDocument()
            expect(screen.queryByText('Delete account')).toBeInTheDocument()
            expect(screen.queryByText('Cancel')).toBeInTheDocument()
        })
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
        const btnDel = screen.queryByText('Delete account')
        expect(btnDel).toBeInTheDocument()
        userEvent.click(btnDel)
        await waitFor(()=>{
            expect(screen.queryByLabelText('Password:')).toBeInTheDocument()
            expect(screen.queryByText('Delete account')).toBeInTheDocument()
            expect(screen.queryByText('Cancel')).toBeInTheDocument()
        })
        userEvent.type(screen.getByLabelText('Password:'), logInput.pwdBad1)
        userEvent.click(screen.getByText('Delete account'))
        await waitFor(()=>{
            expect(screen.queryByText('Password is not acceptable!')).toBeInTheDocument()
            expect(funcDel).toHaveBeenCalledTimes(0)
        })
        unmount()
    })
})