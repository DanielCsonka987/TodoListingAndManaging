import React from 'react'
import { waitFor, fireEvent, screen, render } from '@testing-library/react'
import CardTileTextAndContent from '../CardTileTextAndContent'
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { expect as chaiExpect } from 'chai';
import userEvent from '@testing-library/user-event'

describe('Card entity tests', ()=>{
    test('Normal assembling', ()=>{
        const funcForClicking = jest.fn()
        const funcForTyping = jest.fn()
        const cardHeader = 'Test Tile Text'
        const cardIdentifClass = 'stgToTest'
        const cardContent = 'Test text for card content'
        const iconDefinition = 'cancel'

        const inner = <p className={cardIdentifClass}>{cardContent}</p>
        const comp = <CardTileTextAndContent 
            wrapperBlockClasses='cardStyleClass'
            wrapperInlineClasses='cardContnetnClass'
            funcClickActivity={funcForClicking}
            funcKeyPressActivity={funcForTyping}
            iconDef={iconDefinition} tabIndexing='0'
            tileText={cardHeader}
        >
            <span>{inner}</span>
        </CardTileTextAndContent>

        const tree = renderer.create(comp).toJSON()
        expect(tree).toMatchSnapshot()

        const { container, debug, unmount } = render(comp)

        const baseTag = container.firstChild
        expect(baseTag).toHaveClass('cardArea')
        expect(baseTag).toHaveClass('profileCardWidth')
        expect(baseTag).toHaveClass('wrapperColumnAllCenter')
        expect(baseTag).toHaveClass('cardStyleClass')

        //header examination
        const iconTileTextWrapper = baseTag.firstChild
        expect(iconTileTextWrapper).toBeInTheDocument()
        expect(iconTileTextWrapper).toHaveClass('iconTextTogether')
        expect(iconTileTextWrapper).toHaveClass('cardContnetnClass')

        const iTag = screen.queryByText(iconDefinition)
        expect(iTag).toBeInTheDocument()
        expect(iTag).toHaveClass('material-icons')
        expect(iTag).toHaveClass('iconItself')

        const headerText = screen.queryByText(cardHeader)
        expect(headerText).toBeInTheDocument()
        expect(headerText).toHaveClass('textNextToIcon')
        expect(headerText).toHaveClass('tileNameText')

        //content examination
        const innerContent = screen.queryByText(cardContent)
        expect(innerContent).toBeInTheDocument()
        expect(innerContent).toHaveClass(cardIdentifClass)

        unmount()
    })

    test('Selection of card test', ()=>{

        const listOfTileCards = <div>
            <CardTileTextAndContent 
                tabIndexing='0'
                tileText='firstHeader'
            >
                <span>{'First'}</span>
            </CardTileTextAndContent>
            <CardTileTextAndContent 
                tabIndexing='0'
                tileText='secondHeader'
            >
                <span>{'Second'}</span>
            </CardTileTextAndContent>
            <CardTileTextAndContent 
                tabIndexing='-1'
                tileText='thirdHeader'
            >
                 <span>{'Third'}</span>
            </CardTileTextAndContent>
            <CardTileTextAndContent 
                tabIndexing='0'
                tileText='forthHeader'
            >
                <span>{'Forth'}</span>
            </CardTileTextAndContent>
        </div>

        const { container, debug, unmount} = render(listOfTileCards)

        expect(document.body).toHaveFocus()
        userEvent.tab()
        expect(screen.getByText('firstHeader').parentElement).toHaveFocus()
        userEvent.tab()
        expect(screen.getByText('secondHeader').parentElement).toHaveFocus()
        userEvent.tab()
        expect(screen.getByText('forthHeader').parentElement).toHaveFocus()
        userEvent.tab()
        expect(document.body).toHaveFocus()
        userEvent.tab()
        expect(screen.getByText('firstHeader').parentElement).toHaveFocus()

        unmount()
    })
    

})