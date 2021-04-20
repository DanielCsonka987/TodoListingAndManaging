const getType = require('jest-get-type')
const respObjs = require('./mockDatas').readAllMock
const apiComm = require('../apiMessenger.js').doAjaxSending

global.fetch = jest.fn()

describe('Read messages', ()=>{
  afterEach(()=>{
    fetch.mockClear()
  })
  test('Read all users', async ()=>{
    expect.assertions(3);
    fetch.mockImplementationOnce(()=>{
      return respObjs.corResp 
    })
    try{
      const res = await apiComm('/profile/', 'GET', '');

      expect(res).toBeDefined();
      expect( getType(res.report) ).toBe('array');
      expect(res.message).toEqual('Reading done!')
    }catch(e){
      expect(e).toBeUndefined()
    }
  })
  test('Server GET error 404 - not proper processing', async ()=>{
    expect.assertions(3);
    fetch.mockImplementationOnce(()=>{
      return  respObjs.incorResp404
    })
    try{
      const res = await apiComm('/profile/', 'GET', '');
      expect(res).toBeUndefined
    }catch(e){
      expect(e).toBeDefined();
      expect( getType(e) ).toBe('object')
      const content = JSON.parse(e.message)
      expect(content.message).toBe('Api error! No such service!')
    }
  })
  test('Server GET error 400 - normal service refuse', async ()=>{
    expect.assertions(3);
    fetch.mockImplementationOnce(  ()=>{
      return respObjs.incorResp400
    })
    try{
      const res = await apiComm('/profile/', 'GET', '');
      expect(res).toBeUndefined
    }catch(e){
      expect(e).toBeDefined();
      expect( getType(e) ).toBe('object')
      const content = JSON.parse(e.message)
      expect(content.message).toBe('Please login!')
    }
  })
  test('Server GET error 500 - normal service refuse', async ()=>{
    expect.assertions(3);
    fetch.mockImplementationOnce(  ()=>{
      return respObjs.incorResp500
    })
    try{
      const res = await apiComm('/profile/', 'GET', '');
      expect(res).toBeUndefined
    }catch(e){
      expect(e).toBeDefined();
      expect( getType(e) ).toBe('object')
      const content = JSON.parse(e.message)
      expect(content.message).toBe('DB process error!')
    }
  })
})

