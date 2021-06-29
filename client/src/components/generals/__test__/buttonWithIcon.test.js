import React from 'react'
import { waitFor, fireEvent, screen, render } from '@testing-library/react'
import ButtonWithIcon from '../ButtonWithIcon'
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';
import { toMatchDiffSnapshot } from 'snapshot-diff'
expect.extend({ toMatchDiffSnapshot })

describe('Button complex, big and small version', ()=>{

    test('Component test - big config structure and activity', async ()=>{

        const testingFunc = jest.fn()
        const comp = <ButtonWithIcon 
            sizing='big' wrapperBlockClasses='noticable'
            naming='buttonAndInner'
            iconDef='cancel' funcClickActivity={ testingFunc }
        
        >Cancel button</ButtonWithIcon>
        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()
        
        const { container, unmount } = render(comp)
        const wrapperContainer = container.firstChild
        expect(wrapperContainer).toHaveClass('noticable')
    
        const theButton = screen.getByRole('button')
        expect(theButton).toBeInTheDocument()
        expect(theButton).toHaveClass('clickable')
        expect(theButton).toHaveClass('btnObjBig')
        expect(theButton).toHaveClass('noticable')
        expect(theButton).toHaveAttribute('name', 'buttonAndInner')
    
        const buttonContent = theButton.firstChild
        expect(buttonContent).toHaveClass('iconAndTextTogether')
        expect(buttonContent).toHaveAttribute('name', 'buttonAndInner')
    
        const iconArea = screen.getByText('cancel')
        expect(iconArea).toHaveClass('material-icons')
        expect(iconArea).toHaveClass('iconItself')
        expect(iconArea).toHaveAttribute('name', 'buttonAndInner')
        const textArea = screen.getByText('Cancel button')
        expect(textArea).toHaveClass('textNextToIcon')
    
        expect(buttonContent).toContainElement(iconArea)
        expect(buttonContent).toContainElement(textArea )
        
        fireEvent.click(theButton)
        await waitFor(()=>{
            expect(testingFunc).toHaveBeenCalled()
        })
        unmount()
        
    })

    test('Component test - small config structure and activity', async ()=>{
        let testingFunc = jest.fn()
        const comp = <ButtonWithIcon 
            classes = 'identifier'
            sizing='small' wrapperBlockClasses='noticable'
            naming='buttonAndInner'
            iconDef='cancel' funcClickActivity={ testingFunc }
        
        >Cancel button</ButtonWithIcon>
        
        const { act } = renderer
        const theComponent = renderer.create(comp)
        const tree = theComponent.toJSON()
        expect(tree).toMatchSnapshot()
        
        const { container, unmount, debug } = render(comp)
        const theButton = screen.getByRole('button')
        expect(theButton).toBeInTheDocument()
        expect(theButton).toHaveClass('clickable')
        expect(theButton).toHaveClass('btnObjSmall')
        expect(theButton).toHaveClass('noticable')
        expect(theButton).toHaveAttribute('name', 'buttonAndInner')

        const iconArea = screen.getByText('cancel')
        expect(iconArea).toHaveClass('material-icons')
        expect(iconArea).toHaveClass('iconItself')
        expect(iconArea).toHaveAttribute('name', 'buttonAndInner')
        
        expect(screen.queryByText('Cancel button')).not.toBeInTheDocument()

        fireEvent.focusIn(theButton)    //popup appeares
        await waitFor( ()=>{
            const textArea = screen.getByText('Cancel button')
            expect(textArea).toBeInTheDocument()
            
            act(()=>{
                theComponent.root.findAllByType('button')[0].props.onFocus()
            })
            const treeUpdate = theComponent.toJSON()
            expect(tree).toMatchDiffSnapshot(treeUpdate)
        })
        
        fireEvent.focusOut(theButton)
        await waitFor(()=>{
            expect(screen.queryByText('Cancel button')).not.toBeInTheDocument()
        })
        fireEvent.click(theButton)
        await waitFor(()=>{
            expect(testingFunc).toHaveBeenCalled()
        })
        unmount()
    })

})