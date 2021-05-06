import React from 'react'
import { waitFor, fireEvent, screen, render } from '@testing-library/react'
import FormInputUnit from '../FormInputUnit'
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';
import { toMatchDiffSnapshot } from 'snapshot-diff'

describe('Form input test', ()=>{
    test('Component set to textbox without popup bubble', ()=>{
        const changeFunc = jest.fn()
        const enterFunc = jest.fn()
        const comp = <FormInputUnit
            label='Username area' classes='stgNoticable'
            type='text' name='username' id='unameLabelBound'
            value='stg' funcChange={changeFunc} funcHitEnter={enterFunc}
        >
        </FormInputUnit>

        //const tree = renderer.create(comp).toJSON
        //expect(tree).toMatchSnapshot()

        const { container, unmount, debug } = render(comp)

        const itemContainer = container.firstChild
        expect(itemContainer).toHaveClass('stgNoticable')

        const inputWrapper = screen.getByLabelText('Username area')
        debug(inputWrapper)

        const theInputItem = screen.getByDisplayValue('stg')
        expect(theInputItem).toHaveAttribue('name', 'username')
        expect(theInputItem).toHaveAttribue('type', 'text')

        const emptyBubble = itemContainer.lastChild
        expect(emptyBubble).not.toHaveTextContent('')
        unmount()

    })

    test('Component set to textbox with little popup bubble', ()=>{
        const changeFunc = jest.fn()
        const enterFunc = jest.fn()
        const bubbleText = 'Test text to test this'
        const comp = <FormInputUnit
            label='Username area' classes='stgNoticable'
            type='textbox' name='username' id='unameLabelBound'
            value='stg' funcChange={changeFunc} funcHitEnter={enterFunc}
        >
        </FormInputUnit>
    })
})