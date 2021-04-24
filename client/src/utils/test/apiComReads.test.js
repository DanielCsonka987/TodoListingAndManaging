const getType = require('jest-get-type')
const respObjs = require('./mockDatas').readAllMock
const apiComm = require('../apiMessenger.js').doAjaxSending

global.fetch = jest.fn()

describe('Read messages', ()=>{
  afterEach(()=>{
    fetch.mockClear()
  })
  test('Read all users', async ()=>{
    expect.assertions(4);
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
    }finally{
      expect(fetch).toHaveBeenCalledTimes(1)
    }
  })
  test('Server GET error 404 - not proper processing', async ()=>{
    expect.assertions(4);
    fetch.mockImplementationOnce(()=>{
      return  respObjs.incorResp404
    })
    try{
      const res = await apiComm('/profile/', 'GET', '');
      expect(res).toBeUndefined
    }catch(e){
      expect(e).toBeDefined();
      expect( getType(e) ).toBe('object')
      expect(e.message).toBe('Api error! No such service!')
    }finally{
      expect(fetch).toHaveBeenCalledTimes(1)
    }
  })
  test('Server GET error 400 - normal service refuse', async ()=>{
    expect.assertions(4);
    fetch.mockImplementationOnce(  ()=>{
      return respObjs.incorResp400
    })
    try{
      const res = await apiComm('/profile/', 'GET', '');
      expect(res).toBeUndefined
    }catch(e){
      expect(e).toBeDefined();
      expect( getType(e) ).toBe('object')
      expect(e.message).toBe('Please login!')
    }finally{
      expect(fetch).toHaveBeenCalledTimes(1)
    }
  })
  test('Server GET error 500 - normal service refuse', async ()=>{
    expect.assertions(4);
    fetch.mockImplementationOnce(  ()=>{
      return respObjs.incorResp500
    })
    try{
      const res = await apiComm('/profile/', 'GET', '');
      expect(res).toBeUndefined
    }catch(e){
      expect(e).toBeDefined();
      expect( getType(e) ).toBe('object')
      expect(e.message).toBe('DB process error!')
    }finally{
      expect(fetch).toHaveBeenCalledTimes(1)
    }
  })

  test('Inproper handled apiMessenger - no path', async ()=>{
    expect.assertions(4)
    fetch.mockImplementationOnce(()=>{
      return Promise.resolve({ status: 200 })

    })
    try{
      const res = await apiComm('', 'POST', '')
      expect(res).toBeUndefined
    }catch(e){
      expect( getType(e) ).toBe('object')
      expect(e.name).toBe('MyClientException')
      expect(e.message).toBe('Front development error - no path!')
    }finally{
      expect(fetch).toHaveBeenCalledTimes(0)
    }
  })

  test('Inproper handled apiMessenger - no method', async ()=>{
    expect.assertions(4)
    fetch.mockImplementationOnce(()=>{
      return Promise.resolve({ status: 200 })
    })
    try{
      const res = await apiComm('/profile/', '', '')
      expect(res).toBeUndefined
    }catch(e){
      expect( getType(e) ).toBe('object')
      expect(e.name).toBe('MyClientException')
      expect(e.message).toBe('Front development error - no method!')
    }finally{
      expect(fetch).toHaveBeenCalledTimes(0)
    }
  })
})

