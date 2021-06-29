import React from 'react'
import { waitFor, fireEvent, screen, render } from '@testing-library/react'
import RegisterForm from '../RegisterForm'
import '@testing-library/jest-dom/extend-expect'
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

        //start register, filling input
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

        //finsih registration, analyze reg method calling
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

        //start registration, filling the form
        userEvent.click(screen.getByText('Registration').parentElement)
        fillInInputAndRevise(screen, 'Username*:', regInput.username)
        fillInInputAndRevise(screen, 'Password*:', regInput.password)
        fillInInputAndRevise(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInputAndRevise(screen, 'Firstname*:', regInput.firstName)

        //finish reg, analyze reg method calling
        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        await waitFor(()=>{
            expect(funcToReg).toHaveBeenCalledTimes(1)
        })
        unmount()
    })
})

describe('Registring issue tests', ()=>{
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

        //start registring, fill up the form
        userEvent.click(screen.getByText('Registration').parentElement)
        fillInInput(screen, 'Username*:', regInput.username)
        fillInInput(screen, 'Password*:', regInput.password)
        fillInInput(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInput(screen, 'Firstname*:', regInput.firstName)
        fillInInput(screen, 'Lastname:', regInput.lastName)
        fillInInput(screen, 'Age:', regInput.age)
        fillInInput(screen, 'Occupation:', regInput.occupation)

        //finish registrate, analyze errors
        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        expect(await screen.findByText('Password confirmation is not matching!')).toBeInTheDocument()
        expect(funcToReg).toHaveBeenCalledTimes(0)

        const errorMsgs = screen.getByTestId('regErrors')
        expect(errorMsgs.firstChild).toHaveClass('msgLine')
        expect(errorMsgs.getElementsByTagName('span').length).toBe(1)
        expect(errorMsgs.getElementsByTagName('span')[0])
            .toHaveTextContent('Password confirmation is not matching!')
        expect(errorMsgs.getElementsByTagName('a').length).toBe(1)
        expect(errorMsgs.getElementsByTagName('a')[0])
            .toHaveAttribute('href', '#password_repeat')


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

        //start registration, filling the form
        userEvent.click(screen.getByText('Registration').parentElement)
        fillInInput(screen, 'Username*:', regInput.username)
        fillInInput(screen, 'Password*:', regInput.password)
        fillInInput(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInput(screen, 'Firstname*:', regInput.firstName)
        fillInInput(screen, 'Lastname:', regInput.lastName)
        fillInInput(screen, 'Age:', regInput.age)
        fillInInput(screen, 'Occupation:', regInput.occupation)

        //finish registration, analyze errors
        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        expect(await screen.findByText('Password is not acceptable!')).toBeInTheDocument()
        expect(funcToReg).toHaveBeenCalledTimes(0)

        const errorMsgs = screen.getByTestId('regErrors')
        expect(errorMsgs.firstChild).toHaveClass('msgLine')
        expect(errorMsgs.getElementsByTagName('span').length).toBe(1)
        expect(errorMsgs.getElementsByTagName('span')[0])
            .toHaveTextContent('Password is not acceptable!')
        expect(errorMsgs.getElementsByTagName('a').length).toBe(1)
        expect(errorMsgs.getElementsByTagName('a')[0])
            .toHaveAttribute('href', '#password')


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

        //start registration, filling th form
        userEvent.click(screen.getByText('Registration').parentElement)
        fillInInput(screen, 'Username*:', regInput.username)
        fillInInput(screen, 'Password*:', regInput.password)
        fillInInput(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInput(screen, 'Firstname*:', regInput.firstName)
        fillInInput(screen, 'Lastname:', regInput.lastName)
        fillInInput(screen, 'Age:', regInput.age)
        fillInInput(screen, 'Occupation:', regInput.occupation)

        //finish register, find errormessage
        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)

        expect(await screen.findByText(`Username is not acceptable! ${regInput.username}`))
            .toBeInTheDocument()
        expect(funcToReg).toHaveBeenCalledTimes(0)

        //analyze the errormessaging datas
        const errorMsgs = screen.getByTestId('regErrors')
        expect(errorMsgs.firstChild).toHaveClass('msgLine')
        expect(errorMsgs.getElementsByTagName('span').length).toBe(1)
        expect(errorMsgs.getElementsByTagName('span')[0])
            .toHaveTextContent('Username is not acceptable! ' + regInput.username)
        expect(errorMsgs.getElementsByTagName('a').length).toBe(1)
        expect(errorMsgs.getElementsByTagName('a')[0])
            .toHaveAttribute('href', '#username')

        
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

        //start registration, filling the form
        userEvent.click(screen.getByText('Registration').parentElement)
        fillInInput(screen, 'Username*:', regInput.username)
        fillInInput(screen, 'Password*:', regInput.password)
        fillInInput(screen, 'Password again*:', regInput.passwordRepeat)
        fillInInput(screen, 'Firstname*:', regInput.firstName)
        fillInInput(screen, 'Lastname:', regInput.lastName)
        fillInInput(screen, 'Age:', regInput.age)
        fillInInput(screen, 'Occupation:', regInput.occupation)

        //finish registration, analyze error contennt
        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        expect(await screen.findByText(`${regInput.age} as age is not proper!`)).toBeInTheDocument()
        expect(funcToReg).toHaveBeenCalledTimes(0)

        const errorMsgs = screen.getByTestId('regErrors')
        expect(errorMsgs.firstChild).toHaveClass('msgLine')
        expect(errorMsgs.getElementsByTagName('span').length).toBe(1)
        expect(errorMsgs.getElementsByTagName('span')[0])
            .toHaveTextContent(`${regInput.age} as age is not proper!`)
        expect(errorMsgs.getElementsByTagName('a').length).toBe(1)
        expect(errorMsgs.getElementsByTagName('a')[0])
            .toHaveAttribute('href', '#age')


        unmount()
    })
    test('Not proper inputs at fields 5 - all input empty', async ()=>{

        const funcToReg = jest.fn()

        const comp = <RegisterForm
            funcRegister={funcToReg}
        />

        const {container, debug, unmount} = render(comp)

        //start registration, without filling anything
        userEvent.click(screen.getByText('Registration').parentElement)

        //finish registration, analyze error contennt
        const regBtn = screen.getByRole('button')
        userEvent.click(regBtn)
        expect(await screen.findByText('Username is not acceptable!')).toBeInTheDocument()
        expect(screen.getByText('Password is not acceptable!')).toBeInTheDocument()
        expect(screen.getByText('Firstname is not acceptable!')).toBeInTheDocument()

        const errorMsgs = screen.getByTestId('regErrors')
        expect(errorMsgs.firstChild).toHaveClass('msgLine')
        expect(errorMsgs.getElementsByTagName('span').length).toBe(3)
        expect(errorMsgs.getElementsByTagName('span')[0])
            .toHaveTextContent(`Username is not acceptable!`)
        expect(errorMsgs.getElementsByTagName('span')[1])
            .toHaveTextContent('Password is not acceptable!')
        expect(errorMsgs.getElementsByTagName('span')[2])
            .toHaveTextContent('Firstname is not acceptable!')
        expect(errorMsgs.getElementsByTagName('a').length).toBe(3)
        expect(errorMsgs.getElementsByTagName('a')[0])
            .toHaveAttribute('href', '#username')
        expect(errorMsgs.getElementsByTagName('a')[1])
            .toHaveAttribute('href', '#password')
        expect(errorMsgs.getElementsByTagName('a')[2])
            .toHaveAttribute('href', '#first_name')
        expect(funcToReg).toHaveBeenCalledTimes(0)

        unmount()
    })
})
