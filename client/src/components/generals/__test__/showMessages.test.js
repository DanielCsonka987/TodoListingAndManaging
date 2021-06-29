import React from 'react'
import { waitFor, fireEvent, screen, render } from '@testing-library/react'
import ShowMessages from '../ShowMessages'
import { expect as chaiExpect } from 'chai'
import renderer from 'react-test-renderer';

describe('Message definitions', ()=>{
    test('Accidenty undefined message', ()=>{
        const apiMessage = ''
        const comp = <ShowMessages 
            messageContent = { apiMessage }
        />
        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()
        const { unmount, container, debug } = render(comp)
        expect( container ).toBeEmptyDOMElement()
        unmount()
    })

    test('Proper type/msg container with string error message', ()=>{
        const apiMessage = { type: 'warn', msg: 'Server error, no such content!' }
        const comp = <ShowMessages 
            messageContent = { apiMessage }
        />
        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()
        const { unmount, container, debug } = render(comp)
        
        //div extraction
        const msgDiv = container.firstChild
        expect(msgDiv).toBeInTheDocument()
        expect(msgDiv).toHaveClass('msgLine')

        //span extraction
        const msgParag = msgDiv.firstChild
        expect(msgParag).toHaveClass('errorText')
        expect(msgParag).toHaveTextContent(apiMessage.msg)
        unmount()
    })

    test('Proper type/msg container with array of problems, from the front validator', ()=>{
        const revisMessages = 
        {
            type: 'warn',
            msg: [
                { field: 'first_name', message: 'Too long firstname!' },
                { field: 'password', message: 'Too short password text!' },
                { field: 'password_repeat', message: 'Not correct password confirmation!' }
            ]
        }

        const comp = <ShowMessages 
            messageContent = { revisMessages }
        />
        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()
        const { unmount, container, debug } = render(comp)

        // div-s extraction
        const errDivs = container.getElementsByTagName('div')
        chaiExpect(errDivs).to.have.lengthOf(3)
        
        //div-s revisions, span-textcontent and anchor-href
        const firstDiv = errDivs[0]
        expect(firstDiv).not.toBeEmptyDOMElement()
        expect(firstDiv.firstChild).toHaveClass('errorText')
        expect(firstDiv.firstChild).toHaveTextContent(revisMessages.msg[0].message)
        chaiExpect(firstDiv.lastChild.href).to.have.string(revisMessages.msg[0].field)
        
        const secErrDiv = errDivs[1]
        expect(secErrDiv).not.toBeEmptyDOMElement()
        expect(secErrDiv.firstChild).toHaveClass('errorText')
        expect(secErrDiv.firstChild).toHaveTextContent(revisMessages.msg[1].message)
        chaiExpect(secErrDiv.lastChild.href).to.have.string(revisMessages.msg[1].field)
        
        const thrdErrDiv = errDivs[2]
        expect(thrdErrDiv).not.toBeEmptyDOMElement()
        expect(thrdErrDiv.firstChild).toHaveClass('errorText')
        expect(thrdErrDiv.firstChild).toHaveTextContent(revisMessages.msg[2].message)
        chaiExpect(thrdErrDiv.lastChild.href).to.have.string(revisMessages.msg[2].field)
        
        //anchors revision
        const iconTags = screen.getAllByText('arrow_back')
        chaiExpect(iconTags).to.have.lengthOf(3)
        expect(iconTags[0]).toHaveClass('material-icons')
        expect(iconTags[1]).toHaveClass('material-icons')
        expect(iconTags[2]).toHaveClass('material-icons')

        unmount()
    })

    
    test('Proper type/msg container with normal string message', ()=>{
        const apiMessage = { type: 'norm', msg: 'You have updated your account!' }
        const comp = <ShowMessages 
            messageContent = { apiMessage }
        />
        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()
        const { unmount, container, debug } = render(comp)

        //single div extract and revise
        const msgDiv = container.firstChild
        expect(msgDiv).toHaveClass('msgLine')

        //span extract and revise
        const msgParag = msgDiv.firstChild
        expect(msgParag).toHaveClass('msgText')
        expect(msgParag).toHaveTextContent(apiMessage.msg)
        unmount()
    })

    test('Proper type/msg container with server error msg', ()=>{
        const apiMessage = { 
            type: 'warn', 
            msg: [
                {
                    field: 'password',
                    message: 'You should give the proper password!' 
                }
            ]
        }
        const comp = <ShowMessages 
            messageContent = { apiMessage }
        />
        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()
        const { unmount, container, debug } = render(comp)

        //div container extraction
        const errDivs = container.getElementsByTagName('div')
        expect(errDivs[0]).toHaveClass('msgLine')
        chaiExpect(errDivs).to.have.lengthOf(1)

        const msgParag = errDivs[0].firstChild
        expect(msgParag).toHaveClass('errorText')
        expect(msgParag).toHaveTextContent(apiMessage.msg[0].message)
        chaiExpect(errDivs[0].lastChild.href).to.have.string(apiMessage.msg[0].field)
        unmount()
    })

})