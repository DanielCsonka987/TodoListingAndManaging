import React from 'react'
import { waitFor, fireEvent, screen, render } from '@testing-library/react'
import RegisterForm from '../RegisterForm'
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { expect as chaiExpect } from 'chai';
import userEvent from '@testing-library/user-event'

const fillInInputAndRevise = (nodes, label, input)=>{
    const seekedInput = nodes.getByLabelText(label)
    userEvent.type(seekedInput, input)
    expect(seekedInput).toHaveValue(input)
}
const fillInInput = (nodes, label, input) =>{
    const seekedInput = nodes.getByLabelText(label)
    userEvent.type(seekedInput, input)
}

describe('Register Component tests', ()=>{

    test('User register process test', async ()=>{
        const regInput = {
            username: 'StgToTest',
            password: 'Test123',
            passwordRepeat: 'Test123',
            firstName: 'Me',
            lastName: 'Here',
            age: '17',
            occupation: 'Freelancer'
        }
        const funcToReg = jest.fn((statesOfReg)=>{
            expect(statesOfReg.username).toBe(regInput.username)
            expect(statesOfReg.password).toBe(regInput.password)
            expect(statesOfReg.password_repeat).toBe(regInput.passwordRepeat)
            expect(statesOfReg.first_name).toBe(regInput.firstName)
            expect(statesOfReg.last_name).toBe(regInput.lastName)
            expect(statesOfReg.agge).toBe(regInput.age)
            expect(statesOfReg.occupation).toBe(regInput.occupation)
        })
        const comp = <RegisterForm
            funcRegister={funcToReg}
        />

        const {container, debug, unmount} = render(comp)

        userEvent.click(screen.getByText('Registration').parentElement)

        fillInInputAndRevise(screen, 'Username*:', regInput.username)
        fillInInputAndRevise(screen, 'Password*:', regInput.password)
        fillInInputAndRevise(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInputAndRevise(screen, 'Firstname*:', regInput.firstName)
        fillInInputAndRevise(screen, 'Lastname:', regInput.lastName)

        const seekedInput = screen.getByLabelText('Age:')
        userEvent.type(seekedInput, regInput.age)
        expect(seekedInput).toHaveValue(17)

        fillInInputAndRevise(screen, 'Occupation:', regInput.occupation)

        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        await waitFor(()=>{
            expect(funcToReg).toHaveBeenCalledTimes(1)
        })
        unmount()
    })

    test('User register process test - minimal inputs', async ()=>{
        const regInput = {
            username: 'StgToTest',
            password: 'Test123',
            passwordRepeat: 'Test123',
            firstName: 'Me'
        }
        const funcToReg = jest.fn((statesOfReg)=>{
            expect(statesOfReg.username).toBe(regInput.username)
            expect(statesOfReg.password).toBe(regInput.password)
            expect(statesOfReg.password_repeat).toBe(regInput.passwordRepeat)
            expect(statesOfReg.first_name).toBe(regInput.firstName)
        })
        const comp = <RegisterForm
            funcRegister={funcToReg}
        />

        const {container, debug, unmount} = render(comp)

        userEvent.click(screen.getByText('Registration').parentElement)

        fillInInputAndRevise(screen, 'Username*:', regInput.username)
        fillInInputAndRevise(screen, 'Password*:', regInput.password)
        fillInInputAndRevise(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInputAndRevise(screen, 'Firstname*:', regInput.firstName)
        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        await waitFor(()=>{
            expect(funcToReg).toHaveBeenCalledTimes(1)
        })
        unmount()
    })

    test('Not proper inputs at fields 1 - diff pwd', async ()=>{
        const regInput = {
            username: 'StgToTest',
            password: 'Test123',
            passwordRepeat: 'Test321',
            firstName: 'Me',
            lastName: 'Here',
            age: '17',
            occupation: 'Freelancer'
        }
        const funcToReg = jest.fn()

        const comp = <RegisterForm
            funcRegister={funcToReg}
        />

        const {container, debug, unmount} = render(comp)

        userEvent.click(screen.getByText('Registration').parentElement)

        fillInInput(screen, 'Username*:', regInput.username)
        fillInInput(screen, 'Password*:', regInput.password)
        fillInInput(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInput(screen, 'Firstname*:', regInput.firstName)
        fillInInput(screen, 'Lastname:', regInput.lastName)
        fillInInput(screen, 'Age:', regInput.age)
        fillInInput(screen, 'Occupation:', regInput.occupation)

        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        await waitFor(()=>{

            const errorMsgs = screen.getByTestId('regErrors')
            expect(errorMsgs.firstChild).toHaveClass('errorLine')
            expect(errorMsgs.getElementsByTagName('span').length).toBe(1)
            expect(errorMsgs.getElementsByTagName('span')[0].textContent)
                .toBe('Password confirmation is not matching!')
            expect(errorMsgs.getElementsByTagName('a').length).toBe(1)
            expect(errorMsgs.getElementsByTagName('a')[0])
                .toHaveAttribute('href', '#password_repeat')

            expect(funcToReg).toHaveBeenCalledTimes(0)
        })
        unmount()
    })

    test('Not proper inputs at fields 2 - short pwd', async ()=>{
        const regInput = {
            username: 'StgToTest',
            password: 'T',
            passwordRepeat: 'T',
            firstName: 'Me',
            lastName: 'Here',
            age: '17',
            occupation: 'Freelancer'
        }
        const funcToReg = jest.fn()

        const comp = <RegisterForm
            funcRegister={funcToReg}
        />

        const {container, debug, unmount} = render(comp)

        userEvent.click(screen.getByText('Registration').parentElement)

        fillInInput(screen, 'Username*:', regInput.username)
        fillInInput(screen, 'Password*:', regInput.password)
        fillInInput(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInput(screen, 'Firstname*:', regInput.firstName)
        fillInInput(screen, 'Lastname:', regInput.lastName)
        fillInInput(screen, 'Age:', regInput.age)
        fillInInput(screen, 'Occupation:', regInput.occupation)

        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        await waitFor(()=>{

            const errorMsgs = screen.getByTestId('regErrors')
            expect(errorMsgs.firstChild).toHaveClass('errorLine')
            expect(errorMsgs.getElementsByTagName('span').length).toBe(1)
            expect(errorMsgs.getElementsByTagName('span')[0].textContent)
                .toBe('Password is not acceptable!')
            expect(errorMsgs.getElementsByTagName('a').length).toBe(1)
            expect(errorMsgs.getElementsByTagName('a')[0])
                .toHaveAttribute('href', '#password')

            expect(funcToReg).toHaveBeenCalledTimes(0)
        })
        unmount()
    })

    test('Not proper inputs at fields 3 - short username', async ()=>{
        const regInput = {
            username: 'Stg',
            password: 'Test123',
            passwordRepeat: 'Test123',
            firstName: 'Me',
            lastName: 'Here',
            age: '17',
            occupation: 'Freelancer'
        }
        const funcToReg = jest.fn()

        const comp = <RegisterForm
            funcRegister={funcToReg}
        />

        const {container, debug, unmount} = render(comp)

        userEvent.click(screen.getByText('Registration').parentElement)

        fillInInput(screen, 'Username*:', regInput.username)
        fillInInput(screen, 'Password*:', regInput.password)
        fillInInput(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInput(screen, 'Firstname*:', regInput.firstName)
        fillInInput(screen, 'Lastname:', regInput.lastName)
        fillInInput(screen, 'Age:', regInput.age)
        fillInInput(screen, 'Occupation:', regInput.occupation)

        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        await waitFor(()=>{

            const errorMsgs = screen.getByTestId('regErrors')
            expect(errorMsgs.firstChild).toHaveClass('errorLine')
            expect(errorMsgs.getElementsByTagName('span').length).toBe(1)
            expect(errorMsgs.getElementsByTagName('span')[0].textContent)
                .toBe('Username is not acceptable! ' + regInput.username)
            expect(errorMsgs.getElementsByTagName('a').length).toBe(1)
            expect(errorMsgs.getElementsByTagName('a')[0])
                .toHaveAttribute('href', '#username')

            expect(funcToReg).toHaveBeenCalledTimes(0)
        })
        unmount()
    })

    test('Not proper inputs at fields 4 - bad age', async ()=>{
        const regInput = {
            username: 'StgToTest',
            password: 'Test123',
            passwordRepeat: 'Test123',
            firstName: 'Me',
            lastName: 'Here',
            age: '-1',
            occupation: 'Freelancer'
        }
        const funcToReg = jest.fn()

        const comp = <RegisterForm
            funcRegister={funcToReg}
        />

        const {container, debug, unmount} = render(comp)

        userEvent.click(screen.getByText('Registration').parentElement)

        fillInInput(screen, 'Username*:', regInput.username)
        fillInInput(screen, 'Password*:', regInput.password)
        fillInInput(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInput(screen, 'Firstname*:', regInput.firstName)
        fillInInput(screen, 'Lastname:', regInput.lastName)
        fillInInput(screen, 'Age:', regInput.age)
        fillInInput(screen, 'Occupation:', regInput.occupation)

        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        await waitFor(()=>{

            const errorMsgs = screen.getByTestId('regErrors')
            expect(errorMsgs.firstChild).toHaveClass('errorLine')
            expect(errorMsgs.getElementsByTagName('span').length).toBe(1)
            expect(errorMsgs.getElementsByTagName('span')[0].textContent)
                .toBe(`${regInput.age} as age is not proper!`)
            expect(errorMsgs.getElementsByTagName('a').length).toBe(1)
            expect(errorMsgs.getElementsByTagName('a')[0])
                .toHaveAttribute('href', '#age')

            expect(funcToReg).toHaveBeenCalledTimes(0)
        })
        unmount()
    })
    test('Not proper inputs at fields 5 - all input empty', async ()=>{

        const funcToReg = jest.fn()

        const comp = <RegisterForm
            funcRegister={funcToReg}
        />

        const {container, debug, unmount} = render(comp)

        userEvent.click(screen.getByText('Registration').parentElement)

        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        await waitFor(()=>{

            const errorMsgs = screen.getByTestId('regErrors')
            expect(errorMsgs.firstChild).toHaveClass('errorLine')
            expect(errorMsgs.getElementsByTagName('span').length).toBe(3)
            expect(errorMsgs.getElementsByTagName('span')[0].textContent)
                .toBe(`Username is not acceptable! `)
            expect(errorMsgs.getElementsByTagName('span')[1].textContent)
                .toBe('Password is not acceptable!')
            expect(errorMsgs.getElementsByTagName('span')[2].textContent)
                .toBe('Firstname is not acceptable!')
            expect(errorMsgs.getElementsByTagName('a').length).toBe(3)
            expect(errorMsgs.getElementsByTagName('a')[0])
                .toHaveAttribute('href', '#username')
            expect(errorMsgs.getElementsByTagName('a')[1])
                .toHaveAttribute('href', '#password')
            expect(errorMsgs.getElementsByTagName('a')[2])
                .toHaveAttribute('href', '#first_name')
            expect(funcToReg).toHaveBeenCalledTimes(0)
        })
        unmount()
    })
})
