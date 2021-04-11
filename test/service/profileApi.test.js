const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const mongoose = require('mongoose');
const expect = require('chai').expect;

const ProfileModel = require('../../model/ProfileModel.js');
const dbaccess = require('../testConfig').testDBConnection;
const api = require('../../server.js');

let userToManage = null
let userToNegativeManage = null;

const testDatas = require('../todoTestDatas').profilesWithTodos;
const registDatas = require('../registProfileDatas').profiles

const testRespBasics = require('../testingMethods').forMsgs.testRespMsgBasics
const testRespHeader = require('../testingMethods').forMsgs.testRespMsgHeaders
const testRespCookie = require('../testingMethods').forMsgs.testRespMsgCookie
const testRespNoCookie = require('../testingMethods').forMsgs.testRespMsgNoCookie
const testJSONContent = require('../testingMethods').forMsgs.testJSONMsgBasics

const testProfList = require('../testingMethods').forMsgs.reviseListOfProfiles
const testLoginResp = require('../testingMethods').forMsgs.reviseProfDetailedContent

const findProfId = require('../testingMethods').forUrls.extinctProfIdFromUrl
const findRespCookieDate = require('../testingMethods').forMsgs.extinctRespCookieExpireDate
const findLoginDatas = require('../testingMethods').forFormParams.extinctLogindDatas
const findOldPwd = require('../testingMethods').forFormParams.extinctOldPwd

const loginForm = require('../testingMethods').forFormParams.smblLoginForm
const pwdChangeForm = require('../testingMethods').forFormParams.smblPwdChangeForm
const deleteProfForm = require('../testingMethods').forFormParams.smblProfDelForm

const chaiAgent = chai.request.agent(api);

before(function(){
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, { useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
    .once('open', ()=>{ console.log('Mongoose test DB opened!') })
    .once('close', ()=>{ console.log('Mongoose test DB closed!') })
    .on('error', (err)=>{ console.log('Mongoose error occured! ', err) })

    mongoose.connection.collections.profiles.drop(err=>{
      if(err){
        console.log('Collection is not empty!')
        reject()
      }
      ProfileModel.insertMany(testDatas, (err, resp)=>{
        if(err || resp.length !== testDatas.length){
          console.log('Collection insertion failed!')
          reject();
        }
        console.log('Test database ready to use!')
        resolve()
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


describe('Password change attempts',function(){

  before(()=>{
    //const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .get('/profile/')
    .then(res=>{
      testRespBasics(res, 200)
      testRespHeader(res)
      const resJSON = JSON.parse(res.text)

      testJSONContent(resJSON, 'success')
      testProfList(resJSON.report, 5)
      const u1 = resJSON.report[0]
      const loginParam = findLoginDatas(u1.username, registDatas) 
      userToManage = { 
        id: findProfId(u1.loginUrl),
        srnm: loginParam[0],
        psswrd: loginParam[1],
        pwdHash: findOldPwd(u1.username, testDatas),
        lgnurl: u1.loginUrl,
      }
    })
  })

  it('Login a users, change pwd, revise in DB and cookie date changes check', function(){
    //const chaiAgent = chai.request.agent(api);
    return chaiAgent
    .post()
    .type('form')
    .send( loginForm(userToManage.srnm, userToManage.psswrd) )
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToManage.id)
      const cookieDating1 = findRespCookieDate(nextRes, 'session');

      
      const secJSON = JSON.parse(nextRes.text);
      testJSONContent(secJSON, 'success')
      testLoginResp(secJSON.report)

      userToManage.pwdChngPrfDl = secJSON.report.changPwdDelAccUrl

      const newPwd = 'testPwd'
      return chaiAgent.keepOpen()
      .put(userToManage.pwdChngPrfDl)
      .type('form')
      .send( pwdChangeForm( userToManage.psswrd, newPwd ) )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespCookie(thirdRes, 'session', userToManage.id)
        const cookieDating2 = findRespCookieDate(thirdRes, 'session');
        //console.log(cookieDating1)
        //console.log(cookieDating2)
        expect(cookieDating1).to.not.equal(cookieDating2)

        const thrJSON = JSON.parse(thirdRes.text)
        testJSONContent(thrJSON, 'success')
        userToManage.nwpsswrd = newPwd

        return ProfileModel.findOne({ _id: userToManage.id}, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')

          expect(doc.password).to.not.equal(userToManage.pwdHash)

        })
      })
    })
    
  })


  it('Login a user, delete its account, revise ind DB', ()=>{
    //const chaiAgent = chai.request.agent(api);
    expect(userToManage).to.be.a('object')

    return chaiAgent
    .post(userToManage.lgnurl)
    .type('form')
    .send( loginForm(userToManage.srnm, userToManage.nwpsswrd) )
    .then(res=>{
      testRespBasics(res, 200)
      testRespHeader(res)
      testRespCookie(res, 'session', userToManage.id)
      const resJSON = JSON.parse(res.text);
      testJSONContent(resJSON, 'success')
      testLoginResp(resJSON.report)

      return chaiAgent.keepOpen()
      .delete(userToManage.pwdChngPrfDl)
      .type('form')
      .send( deleteProfForm(userToManage.psswrd) )
      .then(nextRes=>{
        testRespBasics(nextRes, 200)
        testRespHeader(nextRes)
        testRespNoCookie(nextRes, 'session')

        const secJSON = JSON.parse(nextRes.text)
        testJSONContent(secJSON, 'success')

        return chaiAgent.keepOpen()
        .get('/profile/')
        .then(thirdRes=>{
          testRespBasics(thirdRes, 200)
          testRespHeader(thirdRes)
          testRespNoCookie(thirdRes, 'session')

          const thirdJSON = JSON.parse(thirdRes.text)
          testJSONContent(thirdJSON, 'success')
          testProfList(thirdJSON.report, 4)

          const noUser = thirdJSON.report.filter(item=>{
            item.uername === userToManage.srrnm
          })[0]
          expect(noUser).to.be.a('undefined')
        })
      })
    })
  })

})


describe('Negative account change tests', ()=>{  
  before(()=>{
    //const chaiAgent = chai.request.agent(api);
    return chaiAgent
    .get('/profile/')
    .then(res=>{
      testRespBasics(res, 200)
      testRespHeader(res)
      const resJSON = JSON.parse(res.text)

      testJSONContent(resJSON, 'success')
      testProfList(resJSON.report, 4)
      const u2 = resJSON.report[3]

      userToNegativeManage = { 
        id: findProfId(u2.loginUrl),
        srnm: u2.username,
        pwdHash: findOldPwd(u2.username, testDatas),
        lgnurl: u2.loginUrl
      }
      const loginParam = findLoginDatas(u1.username, registDatas) 

      userToNegativeManage.psswrd = loginParam[1]
    })
  })

  it('Password change, empty old password', ()=>{
    //const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd))
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      testRespHeader(nextRes)

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      userToNegativeManage.pwdDelUrl = nextJSON.report.changPwdDelAccUrl

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( pwdChangeForm( '', 'testPwd') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        testRespHeader(thirdRes)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('old_password')
        expect(thirdJSON.message).to.equal('This old password is not correct!')

        return ProfileModel.findOne({}, (err, doc)=>{

        })


      })
    })

  })

  it('Password change, not proper old password', ()=>{
    //const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(u2.loginUrl)
    .type('form')
    .send(loginParam[0], loginParam[1])
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      testRespHeader(nextRes)

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( pwdChangeForm( 'sureNotPwd', 'testPwd') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        testRespHeader(thirdRes)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('old_password')
        expect(thirdJSON.message).to.equal('This old password is not correct!')

        return ProfileModel.findOne({}, (err, doc)=>{
          
        })
      })
    })
  })





  it('Password change, empty new password', ()=>{
    return chaiAgent.keepOpen()
    .post(u2.loginUrl)
    .type('form')
    .send(loginParam[0], loginParam[1])
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      testRespHeader(nextRes)

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( pwdChangeForm( userToNegativeManage.psswrd, '') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        testRespHeader(thirdRes)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('new_password')
        expect(thirdJSON.message).to.equal('')

        return ProfileModel.findOne({}, (err, doc)=>{

        })
      })
    })
  })

  it('Password change, too short new password', ()=>{
    return chaiAgent.keepOpen()
    .post(u2.loginUrl)
    .type('form')
    .send(loginParam[0], loginParam[1])
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      testRespHeader(nextRes)

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( pwdChangeForm( userToNegativeManage.psswrd, 't') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        testRespHeader(thirdRes)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('new_pssword')
        expect(thirdJSON.message).to.equal('')

        return ProfileModel.findOne({}, (err, doc)=>{

        })
      })
    })
  })

  it('Password change, no form', ()=>{
    return chaiAgent.keepOpen()
    .post(u2.loginUrl)
    .type('form')
    .send(loginParam[0], loginParam[1])
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      testRespHeader(nextRes)

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( '' )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        testRespHeader(thirdRes)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('')
        expect(thirdJSON.message).to.equal('')

        return ProfileModel.findOne({}, (err, doc)=>{

        })
      })
    })
  })

  it('Password change, not existiong user - changed url paramter', ()=>{

  })

  it('Deletion, empty password', ()=>{
    return chaiAgent.keepOpen()
    .post(u2.loginUrl)
    .type('form')
    .send(loginParam[0], loginParam[1])
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      testRespHeader(nextRes)

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( deleteProfForm('') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        testRespHeader(thirdRes)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('')
        expect(thirdJSON.message).to.equal('')
      })
    })
  })

  it('Deletion, not proper password', ()=>{
    
  })

  it('Deletion, empty form', ()=>{

  })

  it('Deletion, no existing user to delete - changed url parameter', ()=>{

  })

  it('Make a pwdchange change without login', ()=>{
    return chaiAgent.keepOpen()
    .put(userToNegativeManage.pwdDelUrl)
    .type('form')
    .send( pwdChangeForm( userToNegativeManage.psswrd, 'testPwd') )
    .then(thirdRes=>{
      testRespBasics(thirdRes, 200)
      testRespNoCookie(thirdRes, 'session')
      testRespHeader(thirdRes)

      const thirdJSON = JSON.parse(thirdRes.text)
      testJSONContent(thirdJSON, 'failed')

      expect(thirdJSON.report).to.equal('')
      expect(thirdJSON.message).to.equal('')
    })
  })

  it('Make a account delete without login', ()=>{
    return chaiAgent.keepOpen()
    .delete(userToNegativeManage.pwdDelUrl)
    .type('form')
    .send( deleteProfForm(userToNegativeManage.psswrd) )
    .then(thirdRes=>{
      testRespBasics(thirdRes, 200)
      testRespNoCookie(thirdRes, 'session')
      testRespHeader(thirdRes)

      const thirdJSON = JSON.parse(thirdRes.text)
      testJSONContent(thirdJSON, 'failed')

      expect(thirdJSON.report).to.equal('')
      expect(thirdJSON.message).to.equal('')
    })
  })
})

