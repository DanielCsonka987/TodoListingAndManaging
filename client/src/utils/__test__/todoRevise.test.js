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
            expect( getType(res) ).toBe('object')
            expect( res.name ).toBe('MyClientValidateException')
            expect( getType(res.errorFields) ).toBe('array')
            expect( res.errorFields[0].field ).toBe('notation')
            expect( res.errorFields[0].message ).toBe('Too long notation text!')
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
            expect( getType(res) ).toBe('object')
            expect( res.name ).toBe('MyClientValidateException')
            expect( getType(res.errorFields) ).toBe('array')
            expect( res.errorFields[0].field).toBe('task')
            expect( res.errorFields[0].message).toBe('A task title required!')
        })
    })
    test('Negative todo input - too big priority', ()=>{
        return todoNewRev(todoDatas.incorExpls[1]).catch(res=>{
            expect( getType(res) ).toBe('object')
            expect( res.name ).toBe('MyClientValidateException')
            expect( getType(res.errorFields) ).toBe('array')
            expect( res.errorFields[0].field).toBe('priority')
            expect( res.errorFields[0].message).toBe('A priority is needed in range from 1 to 10!')
        })
    })
    test('Negative todo input - too low priority', ()=>{
        return todoNewRev(todoDatas.incorExpls[2]).catch(res=>{
            expect( getType(res) ).toBe('object')
            expect( res.name ).toBe('MyClientValidateException')
            expect( getType(res.errorFields) ).toBe('array')
            expect( res.errorFields[0].field).toBe('priority')
            expect( res.errorFields[0].message).toBe('A priority is needed in range from 1 to 10!')
        })
    })
    test('Inaproppiate todo input - invalid format, task', ()=>{
        return todoNewRev(todoDatas.incorExpls[3]).catch(res=>{
            expect( getType(res) ).toBe('object')
            expect( res.name ).toBe('MyClientError')
        })
    })
    test('Inaproppiate todo input - invalid format, prioirty', ()=>{
        return todoNewRev(todoDatas.incorExpls[4]).catch(res=>{
            expect( getType(res) ).toBe('object')
            expect( res.name ).toBe('MyClientError')
        })
    })
})