const expect = require('chai').expect;

const PasswordEncoder = require('../../utils/passwordManagers.js').encodeThisPassword;
const PasswordVerifyer = require('../../utils/passwordManagers.js').verifyThisPassword;

describe('Password encoding-verifications', ()=>{
  it('Positive 1', function(){
    return PasswordEncoder('stg')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      PasswordVerifyer('stg',hashRes)
      .then(verifRes=>{
        expect(verifRes).to.be.a('string');
        expect(verifRes).to.equal('stg')
      })
      .catch(verifErr=> {
        expect(verifErr).to.be.a('undefined');
      })
    })
    .catch(hashErr=>{
      expect(hashErr).to.be.a('undefined')
    })
  })
  it('Positive 2', function(){
    return PasswordEncoder('12')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      PasswordVerifyer('12',hashRes)
      .then(verifRes=>{
        expect(verifRes).to.be.a('string');
        expect(verifRes).to.equal('12')
      })
      .catch(verifErr=> expect(verifErr).to.be.a('undefined'))
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative encoding 1 - no text', function(){
    return PasswordEncoder('')
    .then(hashRes=>{
      expect(hashRes).to.be.a('undefined');
    })
    .catch(hashErr=> {
      expect(hashErr).to.be.a('string')
      expect(hashErr).to.equal('')
    })
  })
  it('Negative encoding 2 - null text', function(){
    return PasswordEncoder()
    .then(hashRes=>{
      expect(hashRes).to.be.a('undefined');
    })
    .catch(hashErr=> {
      expect(hashErr).to.be.a('null')
    })
  })
  it('Negative validating 1 - differnce', function(){
    return PasswordEncoder('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      PasswordVerifyer('text', hashRes)
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('incorrect');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative validating 2 - no plain text to verify', function(){
    return PasswordEncoder('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      PasswordVerifyer('', hashRes)
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('incorrect');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative validating 3 - null plain text to verify', function(){
    return PasswordEncoder('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      PasswordVerifyer(hashRes)
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('error');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative validating 4 - no hash text to verify', function(){
    return PasswordEncoder('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      PasswordVerifyer('data', '')
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('error');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative validating 5 - no proper hash text to verify', function(){
    return PasswordEncoder('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      PasswordVerifyer('data', '12345')
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('error');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
  it('Negative validating 6 - null hash text to verify', function(){
    return PasswordEncoder('data')
    .then(hashRes=>{
      expect(hashRes).to.be.a('string');
      expect(hashRes.length).to.equal(60);

      PasswordVerifyer('data')
      .then(verifRes=>{ expect(verifRes).to.be.a('undefined') })
      .catch(verifErr=>{
        expect(verifErr).to.be.a('string');
        expect(verifErr).to.equal('error');
      })
    })
    .catch(hashErr=> expect(hashErr).to.be.a('undefined'))
  })
});
