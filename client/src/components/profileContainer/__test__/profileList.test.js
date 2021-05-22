import React from 'react'
import { waitFor, fireEvent, screen, render, queryAllByText } from '@testing-library/react'
import ProfileList from '../ProfileList'
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event'
import { text } from 'body-parser';

describe('Profile list test', ()=>{
    let datas = [
        {
            id: '12345678901234567890abcd',
            username: 'JohnDoe',
            loginUrl: 'stg/123'
        },
        {
            id: '09876543210987654321dbca',
            username: 'stgEasy',
            loginUrl: 'stg/456'
        }
    ]
    const addData = {
        id: 'abcd0123456789abcdef1234',
        username: 'somebody',
        password: 'test001_',
        loginUrl: 'stg/789'
    }
    const loggedDatas = {
        first_name: 'Joyie',
        last_name: 'McKey',
        fullname: 'Joyie McKey',
        age: '14',
        occupation: 'Student',
        createNewTodo: 'todo/123',
        changePwdDelAccUrl: 'prof/123',
        logoutUrl: 'logout/123'
    }
    test('Load in the list, choose a profile', async ()=>{
        const cardFocusing = jest.fn()
        const profList1 = <ProfileList  
            actCardFocus='-1'
            funcCartInFocus={cardFocusing}
            loggedUser=''
            loadMessage='Profiles loaded in!'
            allProfilesContent={datas}
        />
        const profList2 = <ProfileList  
            actCardFocus={datas[0].id}
            funcCartInFocus={cardFocusing}
            loggedUser=''
            loadMessage={'Profiles loaded in!'}
            allProfilesContent={datas}
        />
        const { unmount, rerender } = render(profList1)
        expect(screen.getByText('Profiles loaded in!')).toBeInTheDocument()
        expect(screen.getByText(datas[0].username)).toBeInTheDocument()
        expect(screen.getByText(datas[1].username)).toBeInTheDocument()
        expect( screen.queryByLabelText('Password:')).not.toBeInTheDocument()
        expect(screen.queryByText('Login')).not.toBeInTheDocument()

        userEvent.click(screen.getByText(datas[0].username))
        expect(cardFocusing).toHaveBeenCalledTimes(1)
        rerender(profList2)
        expect( await screen.findByLabelText('Password:')).toBeInTheDocument()
        expect(screen.getByText('Login')).toBeInTheDocument()
        unmount()
    })

    test('Let empty the list', ()=>{
        const cardFocusing = jest.fn()
        const profList1 = <ProfileList  
            actCardFocus='-1'
            funcCartInFocus={cardFocusing}
            loggedUser=''
            loadMessage={'Profiles loaded in!'}
            allProfilesContent={[]}

        />
        const { unmount } = render(profList1)

        expect(screen.getByText('Profiles loaded in!')).toBeInTheDocument()
        expect(document.body).toHaveFocus()
        userEvent.tab()
        expect(screen.getByText('Registration').parentElement).toHaveFocus()
        userEvent.tab()
        expect(document.body).toHaveFocus()
        unmount();
    })

    test('Add new profile to list, login process', async ()=>{
        const cardFocusing = jest.fn()
        const funcReg = jest.fn()
        const profList1 = <ProfileList  
            actCardFocus='-1'
            funcCartInFocus={cardFocusing}
            funcRegister={funcReg}
            loggedUser=''
            loadMessage={'Profiles loaded in!'}
            allProfilesContent={[]}
        />
        const { unmount, rerender } = render(profList1)

        const tileReg = screen.getByText('Registration')
        userEvent.click(tileReg)
        userEvent.type(await screen.findByLabelText('Username*:'), addData.username)
        userEvent.type(screen.getByLabelText('Password*:'), addData.password)
        userEvent.type(screen.getByLabelText('Password again*:'), addData.password)
        userEvent.type(screen.getByLabelText('Firstname*:'), loggedDatas.first_name)
        const btnReg = screen.getByRole('button')
        userEvent.click(btnReg)
        await waitFor(()=>{
            expect(funcReg).toHaveBeenCalledTimes(1)
        })

        const profList2 = <ProfileList  
            actCardFocus={addData.id}
            funcCartInFocus={cardFocusing}
            funcRegister={funcReg}
            loggedUser={ { ...loggedDatas, ...addData} }
            loadMessage={'Profiles loaded in!'}
            allProfilesContent={[ addData ]}
        />
        rerender(profList2)

        expect(await screen.findByText('Fullname:')).toBeInTheDocument()
        expect(screen.queryByText('Registration')).not.toBeInTheDocument()
        expect(await screen.findByText( 
            loggedDatas.first_name + ' ' + loggedDatas.last_name 
            ) ).toBeInTheDocument()
        unmount()
    })

    test('Remove a profile from list', async ()=>{
        const cardFocusing = jest.fn()
        const funcDel = jest.fn()
        const profList2 = <ProfileList  
            actCardFocus={addData.id}
            funcCartInFocus={cardFocusing}
            funcCardRemoval={funcDel}
            loggedUser={ { ...loggedDatas, ...addData} }
            loadMessage={'Profiles loaded in!'}
            allProfilesContent={[ ...datas, addData ]}
        />

        const { unmount } = render(profList2)

        const btnDel = screen.getByText('Delete account').parentElement.parentElement
        userEvent.click(btnDel)
        userEvent.type(await screen.findByLabelText('Password:'), addData.password)
        const btnDelFinal = screen.getByText('Delete account').parentElement.parentElement
        userEvent.click(btnDelFinal)
        await waitFor(()=>{
            expect(funcDel).toHaveBeenCalledTimes(1)
        })
        unmount()
    })
})