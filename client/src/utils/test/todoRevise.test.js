const getType = require('jest-get-type')

const todoNoteRev = require('../inputRevise').todoNotationInputRevise
const todoNewRev = require('../inputRevise').todoInputRevise

const noteDatas = require('./testDatas').todoNotation
const todoDatas = require('./testDatas').newTodo
describe('Todo notation revision', ()=>{
    test('Good input 1', ()=>{
        return todoNoteRev(noteDatas.corExpls[0]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Good input 2', ()=>{
        return todoNoteRev(noteDatas.corExpls[1]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Negative input - too long', ()=>{
        return todoNoteRev(noteDatas.incorExpls[0]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resObj = JSON.parse(res)
            expect( resObj.errorType ).toBe('validation')
            expect( getType(resObj.report) ).toBe('array')
        })
    })
})
describe('Todo creation revision', ()=>{
    test('Good input 1', ()=>{
        return todoNewRev(todoDatas.corExpls[0]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Good input 1', ()=>{
        return todoNewRev(todoDatas.corExpls[1]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Negative todo input = empty task', ()=>{
        return todoNewRev(todoDatas.incorExpls[0]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect( resJSON.errorType ).toBe('validation')
            expect( resJSON.report[0].field).toBe('task')
            expect( resJSON.report[0].message).toBe('A task title required!')
        })
    })
    test('Negative todo input - too big priority', ()=>{
        return todoNewRev(todoDatas.incorExpls[1]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect( resJSON.errorType ).toBe('validation')
            expect( resJSON.report[0].field).toBe('priority')
            expect( resJSON.report[0].message).toBe('A priority is needed in range from 1 to 10!')
        })
    })
    test('Negative todo input - too low priority', ()=>{
        return todoNewRev(todoDatas.incorExpls[2]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect( resJSON.errorType ).toBe('validation')
            expect( resJSON.report[0].field).toBe('priority')
            expect( resJSON.report[0].message).toBe('A priority is needed in range from 1 to 10!')
        })
    })
    test('Inaproppiate todo input - invalid format, task', ()=>{
        return todoNewRev(todoDatas.incorExpls[3]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect( resJSON.errorType ).toBe('client')
        })
    })
    test('Inaproppiate todo input - invalid format, prioirty', ()=>{
        return todoNewRev(todoDatas.incorExpls[4]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect( resJSON.errorType ).toBe('client')
        })
    })
})