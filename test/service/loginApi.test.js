const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');

const api = require('../../server.js');
const dbaccess = require('../testConfig').testDBConnection;
const ProfileModel = require('../../model/ProfileModel.js')

const usersForDB = require('../todoTestDatas').profilesWithTodos
const regUserDatasForPwd = require('../registProfileDatas').profiles
let alreadyRegUsers = [];
let usersForTest = []

const findProfId = require('../testingMethods').forUrls.extinctProfIdFromUrl
const findLoginPassword = require('../testingMethods').forFormParams.extinctPwd

const testRespBasics = require('../testingMethods').forMsgs.testRespMsgBasics;
const testJSONBasics = require('../testingMethods').forMsgs.testJSONMsgBasics;
const testRespCookie = require('../testingMethods').forMsgs.testRespMsgCookie;
const testRespNoCookie = require('../testingMethods').forMsgs.testRespMsgNoCookie;
const testRespHeaders = require('../testingMethods').forMsgs.testRespMsgHeaders;

const testProfList = require('../testingMethods').forMsgs.reviseListOfProfiles;
const testProfDetailes = require('../testingMethods').forMsgs.reviseProfDetailedContent;
const testTodoItem = require('../testingMethods').forMsgs.testTodoItem

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
        testJSONBasics(resJSON, 'success', 'arr')
        testProfList(resJSON.report.value, 5)

        resJSON.report.value.forEach(item=>{
          usersForTest.push({
            id: findProfId(item.loginUrl),
            usrnm: item.username,
            psswrd: findLoginPassword(item.username, regUserDatasForPwd),
            lgnurl: item.loginUrl
          })
        })
        const actUser = usersForTest[0]
        return chaiAgent.keepOpen()
          .post(actUser.lgnurl)
          .type('form')
          .send( loginForm(actUser.usrnm, actUser.psswrd) )
          .then((nextResp)=>{
            testRespBasics(nextResp, 200)
            testRespHeaders(nextResp)
            testRespCookie(nextResp, 'session', actUser.id)
            const loginJSON = JSON.parse(nextResp.text)
            testJSONBasics(loginJSON, 'success', 'obj')
            testProfDetailes(loginJSON.report.value)
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
        testJSONBasics(resJSON, 'success', 'arr')
        testProfList(resJSON.report.value, 5)

        const actUser = {
          id: findProfId(resJSON.report.value[0].loginUrl),
          usrnm: resJSON.report.value[0].username,
          psswrd: findLoginPassword(resJSON.report.value[0].username, regUserDatasForPwd),
          lgnurl: resJSON.report.value[0].loginUrl
        }
        return chaiAgent.keepOpen()
          .post(actUser.lgnurl)
          .type('form')
          .send( loginForm(actUser.usrnm, actUser.psswrd) )
          .then((nextResp)=>{
            testRespBasics(nextResp, 200)
            testRespHeaders(nextResp)
            testRespCookie(nextResp, 'session', actUser.id)
            const loginJSON = JSON.parse(nextResp.text)
            testJSONBasics(loginJSON, 'success', 'obj')
            testProfDetailes(loginJSON.report.value)
            expect(loginJSON.message).to.equal('You have logged in!');

            return chaiAgent.keepOpen()
              .get(loginJSON.report.value.logoutUrl)
              .send()
              .then(thirdResp=>{
                testRespBasics(thirdResp, 200)
                testRespHeaders(thirdResp)
                testRespNoCookie(thirdResp, 'session')
                const logoutJSON = JSON.parse(thirdResp.text)
                testJSONBasics(logoutJSON, 'success', '')
                expect(logoutJSON.message).to.equal('You have logged out!')
            })
          })
    })
  })
})

describe('Login, than revise the cookie lifetime', ()=>{
  it('Login, client app reloded', ()=>{
    const agent = chai.request.agent(api);
    expect(usersForTest).to.be.a('array')
    expect(usersForTest).to.not.be.empty
    const u1 = usersForTest[1]
    agent.post(u1.lgnurl)
    .type('form')
    .send( loginForm( u1.usrnm, u1.psswrd ) )
    .then(res=>{
      testRespBasics(res, 200)
      testRespHeaders(res)
      testRespCookie(res, 'session', u1.id)

      const resJSON = JSON.parse(res.text)
      testJSONBasics(resJSON, 'success', 'obj')

      return agent.get('/profile/revise')
      .then(nextRes=>{
        testRespBasics(nextRes, 200)
        testRespHeaders(nextRes)
        testRespNoCookie(nextRes, 'session')  // no cookie renewing

        const nextJSON = JSON.parse(nextRes.text)
        testJSONBasics(nextJSON, 'success', 'arr')  //at user pointer 1 no content there
        nextJSON.report.value.forEach(item=>{
          testTodoItem(item)
        })
        expect(nextJSON.message).to.equal('You are still logged in!')
      })
    })
  })
  it('No Login, client app reloaded', ()=>{
    const agent = chai.request.agent(api);
    return agent.get('/profile/revise')
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeaders(nextRes)
      testRespNoCookie(nextRes, 'session')

      const nextJSON = JSON.parse(nextRes.text)
      testJSONBasics(nextJSON, 'failed', '')
      expect(nextJSON.report.value).to.be.a('string')
      expect(nextJSON.report.value).to.equal('')
      expect(nextJSON.message).to.equal('You are not logged in!')
    })
  })
})

describe('Uncorrect login-out attempts', function(){
  
  it('Login with no password', function(){
    expect(usersForTest).to.be.a('array')
    expect(usersForTest).to.not.be.empty

    const user = usersForTest[1]
    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(user.lgnurl)
      .type('form')
      .send( loginForm(user.usrnm, '')   )
      .then(res=>{
        testRespBasics(res, 400)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed', '')
        expect(resJSON.report.process).to.equal('loginDataFail')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with not acceptable password', function(){
    expect(usersForTest).to.be.a('array')
    expect(usersForTest).to.not.be.empty

    const user = usersForTest[2]
    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(user.lgnurl)
      .type('form')
      .send( loginForm(user.usrnm, 'a')   )
      .then(res=>{
        testRespBasics(res, 400)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed', '')
        expect(resJSON.report.process).to.equal('loginDataFail')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with no username', function(){
    expect(usersForTest).to.be.a('array')
    expect(usersForTest).to.not.be.empty

    const user = usersForTest[2]
    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(user.lgnurl)
      .type('form')
      .send( loginForm('', user.psswrd)   )
      .then(res=>{
        testRespBasics(res, 400)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed', '')
        expect(resJSON.report.process).to.equal('loginDataFail')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with no sent form', function(){
    expect(usersForTest).to.be.a('array')
    expect(usersForTest).to.not.be.empty

    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(usersForTest[3].lgnurl)
      .type('form')
      .send( '' )
      .then(res=>{
        testRespBasics(res, 400)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed', '')
        expect(resJSON.report.process).to.equal('loginDataFail')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with unregistered username', function(){

    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(usersForTest[1].lgnurl)
      .type('form')
      .send( loginForm('someBidy', 'noGoodUser')   )
      .then(res=>{
        testRespBasics(res, 400)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed', '')
        expect(resJSON.report.process).to.equal('loginLackOfUser')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with changed url id', function(){
    expect(usersForTest).to.be.a('array')
    expect(usersForTest).to.not.be.empty

    const notGoodUrl = usersForTest[0].lgnurl
    const userParams = usersForTest[2]
   
    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(notGoodUrl)
      .type('form')
      .send( loginForm(userParams.usrnm, userParams.psswrd)   )
      .then(res=>{
        testRespBasics(res, 400)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed', '')
        expect(resJSON.report.process).to.equal('loginDiffParams')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
  it('Login with wrong, but possibly good password', function(){
    expect(usersForTest).to.be.a('array')
    expect(usersForTest).to.not.be.empty

    const fakePwd = 'notGoodForSure'
    const user = usersForTest[0]

    const agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(user.lgnurl)
      .type('form')
      .send( loginForm(user.usrnm, fakePwd)   )
      .then(res=>{
        testRespBasics(res, 400)
        testRespHeaders(res)
        testRespNoCookie(res, 'session')
        const resJSON = JSON.parse(res.text)
        testJSONBasics(resJSON, 'failed', '')
        expect(resJSON.report.process).to.equal('loginAuth')
        expect(resJSON.message).to.equal('Wrong username or password!') 
      })
  })
})
