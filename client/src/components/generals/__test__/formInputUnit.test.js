import React from 'react'
import { waitFor, fireEvent, screen, render } from '@testing-library/react'
import FormInputUnit from '../FormInputUnit'
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { expect as chaiExpect } from 'chai';
import userEvent from '@testing-library/user-event'

describe('Form input test', ()=>{
    test('Component set to textbox without popup bubble', async ()=>{
        const changeFunc = jest.fn()
        const enterFunc = jest.fn()
        const comp = <FormInputUnit
            label='Username area' classes='stgNoticable'
            type='text' name='username' id='unameLabelBound'
            value='stg' funcChange={changeFunc} funcHitEnter={enterFunc}
        >
        </FormInputUnit>

        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()

        const { container, unmount, debug } = render(comp)

        const itemOuterContainer = container.firstChild
        expect(itemOuterContainer).toHaveClass('stgNoticable')

        const theInputItem1 = screen.getByDisplayValue('stg')
        const theInputItem2 = screen.getByLabelText('Username area')
        expect(theInputItem1).toBe(theInputItem2)
        expect(theInputItem1).toHaveAttribute('name', 'username')
        expect(theInputItem1).toHaveAttribute('type', 'text')
        expect(theInputItem1).toHaveAttribute('id', 'unameLabelBound')

        const emptyBubble = itemOuterContainer.lastChild
        expect(emptyBubble).toHaveTextContent('')
        
        fireEvent.change(theInputItem2, { target: { value: 'different' } })
        await waitFor(()=>{
            expect(changeFunc.mock.calls.length).toBe(1)
        })

        /*fireEvent.keyPress(theInputItem1, { key: 'Enter', code: 'Enter' })
        await waitFor(()=>{
            expect(enterFunc.mock.calls.length).toBe(1)
        })*/
        userEvent.type(theInputItem1, 'another')
        expect(enterFunc.mock.calls.length).toBe(7)

        unmount()

    })

    test('Component set to textbox with little popup bubble', async ()=>{
        const changeFunc = jest.fn()
        const enterFunc = jest.fn()
        const bubbleText = 'Test text to test this'
        const comp = <FormInputUnit
            label='Username area' classes='stgNoticable'
            type='textbox' name='username' id='unameLabelBound'
            value='stg' funcChange={changeFunc} funcHitEnter={enterFunc}
        >
            {bubbleText}
        </FormInputUnit>

        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()

        const { container, unmount, debug } = render(comp)

        const itemOuterContainer = container.firstChild
        expect(itemOuterContainer).toHaveClass('stgNoticable')
        expect(screen.queryByText(bubbleText)).not.toBeInTheDocument()

        const theInputItem2 = screen.getByLabelText('Username area')
        fireEvent.focus(theInputItem2)
        await waitFor(()=>{
            const bubbleTag = screen.queryByText(bubbleText)
            expect(bubbleTag).toBeInTheDocument()
            expect(bubbleTag).toHaveStyle('position: absolute')
        })
        fireEvent.focusOut(theInputItem2)
        await waitFor(()=>{
            const bubbleTag = screen.queryByText(bubbleText)
            expect(bubbleTag).not.toBeInTheDocument()
        })
        unmount()
    })
})