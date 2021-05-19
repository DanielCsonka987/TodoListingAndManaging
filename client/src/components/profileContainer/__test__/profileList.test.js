import React from 'react'
import { waitFor, fireEvent, screen, render, queryAllByText } from '@testing-library/react'
import ProfileItem from '../ProfileItem'
import '@testing-library/jest-dom/extend-expect'
import renderer from 'react-test-renderer';
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { expect as chaiExpect } from 'chai';
import userEvent from '@testing-library/user-event'
import { text } from 'body-parser';

test('Stg', ()=>{

})