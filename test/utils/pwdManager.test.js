const expect = require('chai').expect;

const hashLength = require('../../config/appConfig').validation.actPwdLengthStandard
const encode = require('../../utils/passwordManagers.js').encodeThisPassword;
const verify = require('../../utils/passwordManagers.js').verifyThisPassword;

describe('Password encoding-verifications', ()=>{
  it('Positive 1', function(){
    return encode('stg')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(hashLength);

      return verify('stg', hashRes)
      .then(verifRes=>{
        expect(verifRes).to.be.a('string');
        expect(verifRes).to.equal('stg')
      })
      .catch(e=>{  expect(e).to.be.a('undefined') })
    }).catch(ex=>{ expect(ex).to.be.a('undefined') })
  })
  it('Positive 2', function(){
    return encode('12')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      return verify('12',hashRes)
      .then(verifRes=>{
        expect(verifRes).to.be.a('string');
        expect(verifRes).to.equal('12')
      })
      .catch(e=> expect(e).to.be.a('undefined'))
    })
    .catch(ex=> expect(ex).to.be.a('undefined'))
  })
})
describe('Pwd encode negative tests', ()=>{
  it('Negative encoding 1 - empty text', function(){
    return encode('')
    .then(hashRes=>{
      expect(hashRes).to.be.a('undefined');
    })
    .catch(hashErr=> {
      expect(hashErr).to.be.a('null')
    })
  })
  it('Negative encoding 2 - null as text', function(){
    return encode()
    .then(hashRes=>{
      expect(hashRes).to.be.a('undefined');
    })
    .catch(hashErr=> {
      expect(hashErr).to.be.a('null')
    })
  })
})

describe('Pwd verify negative tests', ()=>{
  it('Negative validating 1 - hash-text missmatch', function(){
    return encode('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      return verify('text', hashRes)
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('incorrect');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative validating 2 - no plain text to verify', function(){
    return encode('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      return verify('', hashRes)
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('incorrect');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative validating 3 - null plain text to verify', function(){
    return encode('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      return verify(hashRes)
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('error');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative validating 4 - no hash text to verify', function(){
    return encode('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      return verify('data', '')
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('error');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative validating 5 - no proper hash text to verify', function(){
    return encode('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      return verify('data', '12345')
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('error');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative validating 6 - null hash text to verify', function(){
    return encode('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      return verify('data')
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('error');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
});
