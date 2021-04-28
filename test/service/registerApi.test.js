const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');

const api = require('../../server.js');
const dbaccess = require('../testConfig').testDBConnection;
let alreadyRegUserID = [];

const testRespBasics = require('../testingMethods').forMsgs.testRespMsgBasics;
const testRespCookie = require('../testingMethods').forMsgs.testRespMsgCookie;
const testHeaders = require('../testingMethods').forMsgs.testRespMsgHeaders;
const testJSONBasics = require('../testingMethods').forMsgs.testJSONMsgBasics;

const testProfileList = require('../testingMethods').forMsgs.reviseListOfProfiles
const testProfDetailedContent = require('../testingMethods').forMsgs.reviseProfDetailedContent
  
const registForm = require('../testingMethods').forFormParams.smblRegistForm;
const findProfId = require('../testingMethods').forUrls.extinctProfIdFromUrl

const userForTestRegister = require('../registProfileDatas').profiles;

before(function(){
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
    .on('error', (err)=>{ console.log('MongoDB error: ', err); })
    .once('open', ()=>{ console.log('Test DB connection established!') })
    .once('close', ()=>{ console.log('Test DB connection closed') });
    mongoose.connection.collections.profiles.drop(err=>{
      if(err && err.code !== 26){
        console.log('Collection empting failed! ' + err)
        reject();
      }
      resolve();
    })
  }).catch(err=>{ mongoose.connection.close() });
});

after(function(){
  return new Promise((resolve, reject)=>{
    mongoose.connection.close();
    resolve();
  })
})

describe('Register on api empty db', function(){

  it('Register a new users and read back', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
      .post('/profile/register')
      .type('form')
      .send( registForm(userForTestRegister[0]) )
      .then((res)=>{
        testRespBasics(res, 200)
        testHeaders(res)
        const resJSON = JSON.parse(res.text);
        testJSONBasics(resJSON, 'success', 'obj')
        testProfDetailedContent(resJSON.report.value)
        expect(resJSON.report.process).to.equal('regPersist')
        expect(resJSON.message).to.equal('Registration done!')

        alreadyRegUserID.push( findProfId(resJSON.report.value.logoutUrl) )
        testRespCookie(res, 'session', alreadyRegUserID[0])

        return agent.get(`/profile/`)
          .type('form')
          .send()
          .then((nextRes)=>{
            testRespBasics(nextRes, 200)
            const resNextJSON = JSON.parse(nextRes.text);
            testJSONBasics(resNextJSON, 'success', 'arr')
            expect(resNextJSON.report.process).equal('readProf')
            expect(resNextJSON.message).to.equal('Reading done!')

            testProfileList(resNextJSON.report.value, 1)
            const readBackID = findProfId(resNextJSON.report.value[0].loginUrl)
            expect(readBackID).to.be.a('string')
            expect(readBackID).to.equal(alreadyRegUserID[0])
          })
      })
  })
  it('Register another users and read back', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
      .post('/profile/register')
      .type('form')
      .send( registForm(userForTestRegister[1]) )
      .then((res)=>{
        testRespBasics(res, 200)
        const resJSON = JSON.parse(res.text);
        testJSONBasics(resJSON, 'success', 'obj')
        testProfDetailedContent(resJSON.report.value)
        
        expect(resJSON.report.process).equal('regPersist')
        expect(resJSON.message).to.equal('Registration done!')
        alreadyRegUserID.push( findProfId(resJSON.report.value.logoutUrl) )
        testRespCookie(res, 'session', alreadyRegUserID[1])

        return agent.get(`/profile/`)
          .type('form')
          .send()
          .then((nextRes)=>{
            testRespBasics(nextRes, 200)
            testHeaders(res)
            const resNextJSON = JSON.parse(nextRes.text);
            testJSONBasics(resNextJSON, 'success', 'arr')
            expect(resNextJSON.report.process).equal('readProf')
            expect(resNextJSON.message).to.equal('Reading done!')

            testProfileList(resNextJSON.report.value, 2)
            const readBackID1 = findProfId(resNextJSON.report.value[0].loginUrl)
            const readBackID2 = findProfId(resNextJSON.report.value[1].loginUrl)
            expect(readBackID1).to.not.equal(readBackID2)

            expect(readBackID2).to.be.a('string')
            expect(readBackID2).to.equal(alreadyRegUserID[1])
          })
      })
  })


  it('Register without all needed datas - username empty', function(){
    const faultyUserForm = {... userForTestRegister[2] }
    faultyUserForm.username = ''
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.post('/profile/register')
      .type('form')
      .send( registForm(faultyUserForm) ) //no username
      .then((res)=>{
        testRespBasics(res, 400);
        testHeaders(res)
        expect(res.header['session']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        testJSONBasics(resJSON, 'failed', 'str')
        expect(resJSON.report.process).to.equal('regValidate')
        expect(resJSON.report.value).to.equal('username')
        expect(resJSON.message).to.equal('Validation error! The chosen username is not permitted!')

        return chaiAgent.get('/profile/')
          .then((nextRes)=>{
            testRespBasics(nextRes, 200);
            const resNextJSON = JSON.parse(nextRes.text);
            testJSONBasics(resNextJSON, 'success', 'arr')
            expect(resNextJSON.report.process).to.equal('readProf')
            expect(resNextJSON.message).equal('Reading done!')
            testProfileList(resNextJSON.report.value, 2)
          })
      })
  })

  it('Register without all needed datas - password empty', function(){
    const faultyUserForm = {... userForTestRegister[2] }
    faultyUserForm.password = ''
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.post('/profile/register')
      .type('form')
      .send( registForm(faultyUserForm) ) //no username
      .then((res)=>{
        testRespBasics(res, 400);
        testHeaders(res)
        expect(res.header['session']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        testJSONBasics(resJSON, 'failed', 'str')
        expect(resJSON.report.process).to.equal('regValidate')
        expect(resJSON.report.value).to.equal('password')
        expect(resJSON.message).to.equal('Validation error! The chosen password is not permitted!')

        return chaiAgent.get('/profile/')
          .then((nextRes)=>{
            testRespBasics(nextRes, 200);
            const resNextJSON = JSON.parse(nextRes.text);
            testJSONBasics(resNextJSON, 'success', 'arr')
            expect(resNextJSON.report.process).to.equal('readProf')
            expect(resNextJSON.message).equal('Reading done!')
            testProfileList(resNextJSON.report.value, 2)
          })
      })
  })
  it('Register without all needed datas - password confirmation empty', function(){
    const faultyUserForm = {... userForTestRegister[2] }
    faultyUserForm.password_repeat = ''
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.post('/profile/register')
      .type('form')
      .send( registForm(faultyUserForm) ) //no username
      .then((res)=>{
        testRespBasics(res, 400);
        testHeaders(res)
        expect(res.header['session']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        testJSONBasics(resJSON, 'failed', 'str')
        expect(resJSON.report.value).to.equal('password_repeat')
        expect(resJSON.report.process).to.equal('regValidate')
        expect(resJSON.message).to.equal('Validation error! No match between the password and its confirmation!')

        return chaiAgent.get('/profile/')
          .then((nextRes)=>{
            testRespBasics(nextRes, 200);
            const resNextJSON = JSON.parse(nextRes.text);
            testJSONBasics(resNextJSON, 'success', 'arr')
            expect(resNextJSON.report.process).to.equal('readProf')
            expect(resNextJSON.message).equal('Reading done!')
            testProfileList(resNextJSON.report.value, 2)
          })
      })
  })
  it('Register without all needed datas - firstname empty', function(){
    const faultyUserForm = {... userForTestRegister[2] }
    faultyUserForm.first_name = ''
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.post('/profile/register')
      .type('form')
      .send( registForm(faultyUserForm) ) //no username
      .then((res)=>{
        testRespBasics(res, 400);
        testHeaders(res)
        expect(res.header['session']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        testJSONBasics(resJSON, 'failed', 'str')
        expect(resJSON.report.process).to.equal('regValidate')
        expect(resJSON.report.value).to.equal('first_name')
        expect(resJSON.message).to.equal('Validation error! This firstname is not permitted!')

        return chaiAgent.get('/profile/')
          .then((nextRes)=>{
            testRespBasics(nextRes, 200);
            const resNextJSON = JSON.parse(nextRes.text);
            testJSONBasics(resNextJSON, 'success', 'arr')
            expect(resNextJSON.report.process).to.equal('readProf')
            expect(resNextJSON.message).equal('Reading done!')
            testProfileList(resNextJSON.report.value, 2)
          })
      })
  })

  it('Register with uncorrect demanded fields - short username', function(){
    const faultyUserForm = {... userForTestRegister[2] }
    faultyUserForm.username = 'e'
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.post('/profile/register')
      .type('form')
      .send( registForm(faultyUserForm) ) //no username
      .then((res)=>{
        testRespBasics(res, 400);
        testHeaders(res)
        expect(res.header['session']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        testJSONBasics(resJSON, 'failed', 'str')
        expect(resJSON.report.process).to.equal('regValidate')
        expect(resJSON.report.value).to.equal('username')
        expect(resJSON.message).to.equal('Validation error! The chosen username is not permitted!')

        return chaiAgent.get('/profile/')
          .then((nextRes)=>{
            testRespBasics(nextRes, 200);
            const resNextJSON = JSON.parse(nextRes.text);
            testJSONBasics(resNextJSON, 'success', 'arr')
            expect(resNextJSON.report.process).to.equal('readProf')
            expect(resNextJSON.message).equal('Reading done!')
            testProfileList(resNextJSON.report.value, 2)
          })
      })
  })

  it('Register with uncorrect demanded fields - failed password confirmation', function(){
    const faultyUserForm = {... userForTestRegister[2] }
    faultyUserForm.password_repeat = 'e'
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.post('/profile/register')
      .type('form')
      .send( registForm(faultyUserForm) ) //no username
      .then((res)=>{
        testRespBasics(res, 400);
        testHeaders(res)
        expect(res.header['session']).to.be.a('undefined');

        const resJSON = JSON.parse(res.text);
        testJSONBasics(resJSON, 'failed', 'str')
        expect(resJSON.report.process).to.be.a('string')
        expect(resJSON.report.value).to.equal('password_repeat')
        expect(resJSON.message).to.equal('Validation error! No match between the password and its confirmation!')

        return chaiAgent.get('/profile/')
          .then((nextRes)=>{
            testRespBasics(nextRes, 200);
            const resNextJSON = JSON.parse(nextRes.text);
            testJSONBasics(resNextJSON, 'success', 'arr')
            expect(resNextJSON.report.process).equal('readProf')
            expect(resNextJSON.message).equal('Reading done!')
            testProfileList(resNextJSON.report.value, 2)
          })
      })
  })

})
