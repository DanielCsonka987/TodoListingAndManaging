const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');

const api = require('../../server.js');
const dbaccess = require('../testConfig').testDBConnection;
const ProfileModel = require('../../model/ProfileModel.js')

const usersForDB = require('../todoTestDatas').profilesWithTodos
const regUserDatas = require('../registProfileDatas').profiles
let alreadyRegUserId = [];
let usersForNegativeTests = []

const findProfId = require('../testingMethods').forUrls.extinctProfIdFromUrl
const findLoginData = require('../testingMethods').forFormParams.extinctLogindDatas

const testRespBasics = require('../testingMethods').forMsgs.testRespMsgBasics;
const testJSONBasics = require('../testingMethods').forMsgs.testJSONMsgBasics;
const testRespCookie = require('../testingMethods').forMsgs.testRespMsgCookie;
const testRespNoCookie = require('../testingMethods').forMsgs.testRespMsgNoCookie;
const testRespHeaders = require('../testingMethods').forMsgs.testRespMsgHeaders;

const testProfList = require('../testingMethods').forMsgs.reviseListOfProfiles;
const testProfDetailes = require('../testingMethods').forMsgs.reviseProfDetailedContent;

const loginForm = require('../testingMethods').forFormParams.smblLoginForm;

before(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
    .on('error', err=>{ console.log('MongoDB error ', err) })
    .once('open', ()=>{ console.log('MongooseDB connection occured for test!') })
    .once('close', ()=>{ console.log('MongooseDB connection closed!') })

    mongoose.connection.collections.profiles.drop((err)=>{
      if(err){
        console.log('Collection empting failed!')
        reject();
      }
      ProfileModel.insertMany(usersForDB, (err, resp)=>{
        if(err || resp.length !== usersForDB.length){
          console.log('Collection filling in failed')
          reject();
        }
        console.log('Test DB redy to operate!')
        resolve();
      })
      
    })
  })
})

after(function(){
  return new Promise((resolve, reject)=>{
    mongoose.connection.close();
    resolve();
  })
})


describe('Proper login-out attempts', function(){

    it('Read all users, login with one', function(){
      const chaiAgent = chai.request.agent(api);
      return chaiAgent.keepOpen()
        .get(`/profile`)
        .send()
        .then((res)=>{

          testRespBasics(res, 200)
          testRespHeaders(res)
          const resJSON = JSON.parse(res.text);
          testJSONBasics(resJSON, 'success')
          testProfList(resJSON.report, 5)

          usersForNegativeTests = resJSON.report
          alreadyRegUserId.push( findProfId(resJSON.report[0].loginUrl) )
          const loginDatas = findLoginData(resJSON.report[0].username, regUserDatas)
          return chaiAgent.keepOpen()
            .post(resJSON.report[0].loginUrl)
            .type('form')
            .send( loginForm(loginDatas[0], loginDatas[1]) )
            .then((nextResp)=>{
              testRespBasics(nextResp, 200)
              testRespHeaders(nextResp)
              testRespCookie(nextResp, 'session', alreadyRegUserId[0])
              const loginJSON = JSON.parse(nextResp.text)
              testJSONBasics(loginJSON, 'success')
              testProfDetailes(loginJSON.report)
              expect(loginJSON.message).to.equal('You have logged in!');
            })
        })
    })

    it('Read all users, login and out with one', function(){
      const chaiAgent = chai.request.agent(api);
      return chaiAgent.keepOpen()
        .get(`/profile`)
        .send()
        .then((res)=>{
          testRespBasics(res, 200)
          testRespHeaders(res)
          const resJSON = JSON.parse(res.text);
          testJSONBasics(resJSON, 'success')
          testProfList(resJSON.report, 5)

          alreadyRegUserId.push( findProfId(resJSON.report[1].loginUrl) )
          const loginDatas = findLoginData(resJSON.report[1].username, regUserDatas)
          return chaiAgent.keepOpen()
            .post(resJSON.report[1].loginUrl)
            .type('form')
            .send( loginForm(loginDatas[0], loginDatas[1]) )
            .then((nextResp)=>{
              testRespBasics(nextResp, 200)
              testRespHeaders(nextResp)
              testRespCookie(nextResp, 'session', alreadyRegUserId[1])
              const loginJSON = JSON.parse(nextResp.text)
              testJSONBasics(loginJSON, 'success')
              testProfDetailes(loginJSON.report)
              expect(loginJSON.message).to.equal('You have logged in!');

              return chaiAgent.keepOpen()
                .get(loginJSON.report.logoutUrl)
                .send()
                .then(thirdResp=>{
                  testRespBasics(thirdResp, 200)
                  testRespHeaders(thirdResp)
                  testRespNoCookie(thirdResp, 'session')
                  const logoutJSON = JSON.parse(thirdResp.text)
                  testJSONBasics(logoutJSON, 'success')
                  expect(logoutJSON.message).to.equal('You have logged out!')
              })
            })
        })
    })

})

describe('Login, than revise the cookie lifetime', ()=>{
  before(()=>{

  })
  it('Login, client app reloded', ()=>{

  })
  it('No Login, client app reloaded', ()=>{

  })
})

describe('Uncorrect login-out attempts', function(){
  
  it('Login with no password', function(){
    expect(usersForNegativeTests).to.be.a('array')
    expect(usersForNegativeTests).to.not.be.empty

    const loginDatas = findLoginData(usersForNegativeTests[2].username, regUserDatas)
    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(usersForNegativeTests[2].loginUrl)
      .type('form')
      .send( loginForm(loginDatas[0], '')   )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed')
        expect(resJSON.report).to.equal('dataFail')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with not acceptable password', function(){
    expect(usersForNegativeTests).to.be.a('array')
    expect(usersForNegativeTests).to.not.be.empty

    const loginDatas = findLoginData(usersForNegativeTests[2].username, regUserDatas)
    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(usersForNegativeTests[2].loginUrl)
      .type('form')
      .send( loginForm(loginDatas[0], 'a')   )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed')
        expect(resJSON.report).to.equal('dataFail')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with no username', function(){
    expect(usersForNegativeTests).to.be.a('array')
    expect(usersForNegativeTests).to.not.be.empty

    const loginDatas = findLoginData(usersForNegativeTests[2].username, regUserDatas)
    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(usersForNegativeTests[2].loginUrl)
      .type('form')
      .send( loginForm('', loginDatas[1])   )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed')
        expect(resJSON.report).to.equal('dataFail')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with no sent form', function(){
    expect(usersForNegativeTests).to.be.a('array')
    expect(usersForNegativeTests).to.not.be.empty

    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(usersForNegativeTests[2].loginUrl)
      .type('form')
      .send( '' )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed')
        expect(resJSON.report).to.equal('dataFail')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with unregistered username', function(){

    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(usersForNegativeTests[2].loginUrl)
      .type('form')
      .send( loginForm('someBidy', 'noGoodUser')   )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed')
        expect(resJSON.report).to.equal('lackOfUser')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with changed url id', function(){
    expect(usersForNegativeTests).to.be.a('array')
    expect(usersForNegativeTests).to.not.be.empty

    const notGoodUrl = usersForNegativeTests[0].loginUrl
    const loginDatas = findLoginData(usersForNegativeTests[2].username, regUserDatas)
    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(notGoodUrl)
      .type('form')
      .send( loginForm(loginDatas[0], loginDatas[1])   )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed')
        expect(resJSON.report).to.equal('differentParams')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with wrong, but possibly good password', function(){
    expect(usersForNegativeTests).to.be.a('array')
    expect(usersForNegativeTests).to.not.be.empty

    const fakePwd = 'notGoodForSure'
    const loginDatas = findLoginData(usersForNegativeTests[3].username, regUserDatas)

    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(usersForNegativeTests[3].loginUrl)
      .type('form')
      .send( loginForm(loginDatas[0], fakePwd)   )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed')
        expect(resJSON.report).to.equal('authentication')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
})
