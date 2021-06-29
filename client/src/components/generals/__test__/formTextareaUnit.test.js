import React from 'react'
import { waitFor, screen, render } from '@testing-library/react'
import FormTextareaUnit from '../FormTextareaUnit'
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event'
import { toMatchDiffSnapshot } from 'snapshot-diff'
expect.extend({ toMatchDiffSnapshot })

describe('Textarea unit testing', ()=>{
    it('Textarea unit without tooltip, starting with empty input', async ()=>{
        const funcChng = jest.fn()
        const comp = <FormTextareaUnit
            classes='TestingClass'
            id='txt' label='For test:'
            value='' name='txtarea' maxCharLength='80'
            funcChange={funcChng}
        ></FormTextareaUnit>
        const { container, rerender, unmount } = render(comp)
    
        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()
        
        //revision input existence and its some properties
        const txtr = screen.getByLabelText('For test:')
        expect(txtr).toBeInTheDocument()
        expect(txtr).toHaveClass('formTextareaInput')

        //revise container
        expect(container.firstChild).toHaveClass('TestingClass')
        expect(container.firstChild).toHaveClass('formTextareaOuterWrapper')
    
        //revise inner container
        const inner = container.firstChild.firstChild
        expect(inner).toHaveClass('formTextareaInnerWrapper')

        //revise counter
        const counterTxt = screen.getByText(/^\(Remained/);
        expect(counterTxt).toBeInTheDocument()
        expect(counterTxt).toHaveClass('formTextareaCounter')
        const conunterWholeTxt = document.querySelector('.formTextareaCounter')
        expect(conunterWholeTxt).toHaveTextContent('(Remained 80 from 80)')

        //set focus on input
        userEvent.click(txtr)
        await waitFor(()=>{
            expect(tree).toMatchSnapshot()
        })
        expect(document.querySelector('.textareaTooltipBubble'))
            .not.toBeInTheDocument()

        //typing
        userEvent.type(txtr, 'Stg to test')
        await waitFor(()=>{
            expect(funcChng).toHaveBeenCalledTimes(11)
        })

        //updateing value of component
        const comp2 = <FormTextareaUnit
            classes='TestingClass'
            id='txt' label='For test:'
            value='Stg to test' name='txtarea' maxCharLength='80'
            funcChange={funcChng}
        ></FormTextareaUnit>
        rerender(comp2)

        //revise updated parameters
        const updatedTree = renderer.create(comp2).toJSON()
        expect(updatedTree).toMatchSnapshot()
        expect(document.querySelector('.formTextareaCounter'))
            .toHaveTextContent('(Remained 69 from 80)')
        
        expect(tree).toMatchDiffSnapshot(updatedTree)
        unmount()
    })

    it('Textarea unit with some tooltip', async ()=>{
        const funcChng = jest.fn()
        const comp = <FormTextareaUnit
            id='txt' label='For test:'
            value='' name='txtarea' maxCharLength='80'
            funcChange={funcChng}
        >Testing text here</FormTextareaUnit>
        const { unmount } = render(comp)
    
        const theCompRenderer = renderer.create(comp)
        const tree = theCompRenderer.toJSON()
        expect(tree).toMatchSnapshot()
    
        const txtr = screen.getByLabelText('For test:')

        //set focus on input and test tooltip appearence
        userEvent.click(txtr)
        expect(await screen.findByText('Testing text here')).toBeInTheDocument()
        expect(document.querySelector('.textareaTooltipBubble')).toBeInTheDocument()

        const treeUpdate = theCompRenderer.toJSON()
        expect(tree).toMatchDiffSnapshot(treeUpdate)
    
        unmount()
    })


})