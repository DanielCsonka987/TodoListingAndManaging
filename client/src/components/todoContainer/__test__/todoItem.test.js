import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import todoItem from '../TodoItem'

const datas = {
        id: '1234567890abcdef12345678',
        task: 'Finish this app',
        priority: '9',
        notation: 'Too long developing time',
        start: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
        update: 'Sat May 22 2021 20:11:50 GMT+0200 (GMT+02:00)',
        notationChangeUrl: 'todo/123/note',
        statusChangeUrl: 'todo/123/status',
        removingUrl: 'todo/123'
    }

describe('Todo items testing', ()=>{
    test('General structure test', ()=>{

    })
})