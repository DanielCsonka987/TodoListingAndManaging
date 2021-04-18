const getType = require('jest-get-type')

const loginRev = require('../inputRevise').loginInputRevise
const regRev = require('../inputRevise').regInputRevise
const owdChangeRev = require('../inputRevise').pwdChangeInputRevise
const delProfRev = require('../inputRevise').deleteProfInputRevise

const loginDatas = require('./testDatas').loginValues
const regDatas = require('./testDatas').registration
const pwdDatas = require('./testDatas').passwordChange

describe('Login revisions', ()=>{
    test('Normal login 1', ()=>{
        return loginRev(loginDatas.corExpls[0]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Normal login 2', ()=>{
        return loginRev(loginDatas.corExpls[1]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Normal login 3', ()=>{
        return loginRev(loginDatas.corExpls[2]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Negative - no username', ()=>{
        return loginRev(loginDatas.incorExpls[0]).catch(res=>{
            expect(getType(res)).toBe('string')
            const resObj = JSON.parse(res)
            expect(resObj.errorType).toBe('validation')
            expect(getType(resObj.report)).toBe('array')
            expect(resObj.report[0].field).toBe('username')
            expect(resObj.report[0].message).toMatch('Username is not acceptable!')
        })
    })
    test('Negative - no password', ()=>{
        return loginRev(loginDatas.incorExpls[1]).catch(res=>{
            expect(getType(res)).toBe('string')
            const resObj = JSON.parse(res)
            expect(resObj.errorType).toBe('validation')
            expect(getType(resObj.report)).toBe('array')
            expect(resObj.report[0].field).toBe('password')
            expect(resObj.report[0].message).toBe('Password is not acceptable!')
        })
    })
    test('Negative - short pwd', ()=>{
        return loginRev(loginDatas.incorExpls[2]).catch(res=>{
            expect(getType(res)).toBe('string')
            const resObj = JSON.parse(res)
            expect(resObj.errorType).toBe('validation')
            expect(getType(resObj.report)).toBe('array')
            expect(resObj.report[0].field).toBe('password')
            expect(resObj.report[0].message).toBe('Password is not acceptable!')
        })
    })
    test('Negative - short username', ()=>{
        return loginRev(loginDatas.incorExpls[3]).catch(res=>{
            expect(getType(res)).toBe('string')
            const resObj = JSON.parse(res)
            expect(resObj.errorType).toBe('validation')
            expect(getType(resObj.report)).toBe('array')
            expect(resObj.report[0].field).toBe('username')
            expect(resObj.report[0].message).toMatch('Username is not acceptable!')
        })
    })
    test('Inappropoate - invalid format 1', ()=>{
        return loginRev(loginDatas.incorExpls[4]).catch(res=>{
            expect(getType(res)).toBe('string')
            const resObj = JSON.parse(res)
            expect(resObj.errorType).toBe('client')
        })
    })
    test('Inappropoate - invalid format 2', ()=>{
        return loginRev(loginDatas.incorExpls[4]).catch(res=>{
            expect(getType(res)).toBe('string')
            const resObj = JSON.parse(res)
            expect(resObj.errorType).toBe('client')
        })
    })
})

describe('Register revision', ()=>{
    test('Minimal registration input 1', ()=>{
        return regRev(regDatas.corExpls[0]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Minimal registration input 2', ()=>{
        return regRev(regDatas.corExpls[1]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Minimal registration input 3', ()=>{
        return regRev(regDatas.corExpls[2]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Negative reg input - short username', ()=>{
        return regRev(regDatas.incorExpls[0]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect(resJSON.errorType).toBe('validation')
            expect(resJSON.report[0].field).toBe('username')
            expect(resJSON.report[0].message).toMatch('Username is not acceptable!')
        })
    })
    test('Negative reg input - short password', ()=>{
        return regRev(regDatas.incorExpls[1]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect(resJSON.errorType).toBe('validation')
            expect(resJSON.report[0].field).toBe('password')
            expect(resJSON.report[0].message).toBe('Password is not acceptable!')
        })
    })
    test('Negative reg input - password confirmation incorrect', ()=>{
        return regRev(regDatas.incorExpls[2]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect(resJSON.errorType).toBe('validation')
            expect(resJSON.report[0].field).toBe('password_repeat')
            expect(resJSON.report[0].message).toBe('Password confirmation is not matching!')
        })
    })
    test('Negative reg input - empty first name', ()=>{
        return regRev(regDatas.incorExpls[3]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect(resJSON.errorType).toBe('validation')
            expect(resJSON.report[0].field).toBe('first_name')
            expect(resJSON.report[0].message).toBe('Firstname is not acceptable!')
        })
    })
    test('Negative reg input - age unreasonable', ()=>{
        return regRev(regDatas.incorExpls[4]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect(resJSON.errorType).toBe('validation')
            expect(resJSON.report[0].field).toBe('age')
            expect(resJSON.report[0].message).toMatch('as age is not proper!')
        })
    })
    test('Inappropiate reg input - invalid format, username', ()=>{
        return regRev(regDatas.incorExpls[5]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect(resJSON.errorType).toBe('client')
        })
    })
})

describe('Password change revision', ()=>{
    test('Good input', ()=>{
        return owdChangeRev(pwdDatas.corExpls[0]).then(res=>{
            expect(res).toBeUndefined
        })
    })
    test('Negative input, no old password', ()=>{
        return owdChangeRev(pwdDatas.incorExpls[0]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect(resJSON.errorType).toBe('validation')
            expect(resJSON.report[0].field).toBe('old_password')
            expect(resJSON.report[0].message).toMatch('Previous password is not acceptable!')
        })
    })
    test('Negative input, no new password', ()=>{
        return owdChangeRev(pwdDatas.incorExpls[1]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect(resJSON.errorType).toBe('validation')
            expect(resJSON.report[0].field).toBe('new_password')
            expect(resJSON.report[0].message).toMatch('New password is not acceptable!')
        })
    })
    test('Negative input, no new password', ()=>{
        return owdChangeRev(pwdDatas.incorExpls[2]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect(resJSON.errorType).toBe('validation')
            expect(resJSON.report[0].field).toBe('password_repeat')
            expect(resJSON.report[0].message).toMatch('New passwords are not matching!')
        })
    })
    test('Inapporiate, invalid format, old password', ()=>{
        return owdChangeRev(pwdDatas.incorExpls[3]).catch(res=>{
            expect( getType(res) ).toBe('string')
            const resJSON = JSON.parse(res)
            expect( getType(resJSON) ).toBe('object')
            expect(resJSON.errorType).toBe('client')
        })
    })
})
