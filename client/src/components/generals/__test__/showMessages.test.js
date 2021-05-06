import React from 'react'
import { waitFor, fireEvent, screen, render } from '@testing-library/react'
import ShowMessages from '../ShowMessages'
import { expect as chaiExpect } from 'chai'
import renderer from 'react-test-renderer';

describe('Message definitions', ()=>{
    test('Accidenty undefined message', ()=>{
        const apiMessage = ''
        const comp = <ShowMessages 
            messageContent = { undefined }
        />
        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()
        
        const { unmount, container, debug } = render(comp)
        expect( container ).toBeEmptyDOMElement()
        unmount()
    })

    test('Simple string message', ()=>{
        const apiMessage = 'Server error, no such content!'
        const comp = <ShowMessages 
            messageContent = { apiMessage }
        />
        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()
        
        const { unmount, container, debug } = render(comp)
        const msgDiv = container.firstChild
        expect(msgDiv).toBeInTheDocument()
        expect(msgDiv).toHaveClass('errorLine')

        const msgParag = msgDiv.firstChild
        expect(msgParag).toHaveClass('errorText')
        expect(msgParag).toHaveTextContent(apiMessage)
        unmount()
    })

    test('Array of problems, from the front validator', ()=>{
        const revisMessages = [
            { field: 'first_name', message: 'Too long firstname!' },
            { field: 'password', message: 'Too short password text!' },
            { field: 'password_repeat', message: 'Not correct password confirmation!' }
        ]
        const comp = <ShowMessages 
            messageContent = { revisMessages }
        />
        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()

        const { unmount, container, debug } = render(comp)
        const msgDiv = container.firstChild
        expect(msgDiv).toBeInTheDocument()
        const errDivs = container.getElementsByTagName('div')
        chaiExpect(errDivs).to.have.lengthOf(3)
        
        const firstDiv = errDivs[0]
        expect(firstDiv).not.toBeEmptyDOMElement()
        expect(firstDiv.firstChild).toHaveClass('errorText')
        expect(firstDiv.firstChild).toHaveTextContent(revisMessages[0].message)
        chaiExpect(firstDiv.lastChild.href).to.have.string(revisMessages[0].field)
        
        const secErrDiv = errDivs[1]
        expect(secErrDiv).not.toBeEmptyDOMElement()
        expect(secErrDiv.firstChild).toHaveClass('errorText')
        expect(secErrDiv.firstChild).toHaveTextContent(revisMessages[1].message)
        chaiExpect(secErrDiv.lastChild.href).to.have.string(revisMessages[1].field)
        
        const thrdErrDiv = errDivs[2]
        expect(thrdErrDiv).not.toBeEmptyDOMElement()
        expect(thrdErrDiv.firstChild).toHaveClass('errorText')
        expect(thrdErrDiv.firstChild).toHaveTextContent(revisMessages[2].message)
        chaiExpect(thrdErrDiv.lastChild.href).to.have.string(revisMessages[2].field)
        
        const iconTags = screen.getAllByText('arrow_back')
        chaiExpect(iconTags).to.have.lengthOf(3)
        expect(iconTags[0]).toHaveClass('material-icons')
        expect(iconTags[1]).toHaveClass('material-icons')
        expect(iconTags[2]).toHaveClass('material-icons')

        unmount()
    })
})