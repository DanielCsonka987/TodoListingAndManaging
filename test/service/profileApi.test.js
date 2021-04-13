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
const findPwd = require('../testingMethods').forFormParams.extinctPwd

const loginForm = require('../testingMethods').forFormParams.smblLoginForm
const pwdChangeForm = require('../testingMethods').forFormParams.smblPwdChangeForm
const deleteProfForm = require('../testingMethods').forFormParams.smblProfDelForm

before(function(){
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, { useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
    .once('open', ()=>{ console.log('Mongoose test DB opened!') })
    .once('close', ()=>{ console.log('Mongoose test DB closed!') })
    .on('error', (err)=>{ console.log('Mongoose error occured! ', err) })

    mongoose.connection.collections.profiles.drop(error=>{
      if(error){
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
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .get('/profile/')
    .then(res=>{
      testRespBasics(res, 200)
      testRespHeader(res)
      const resJSON = JSON.parse(res.text)

      testJSONContent(resJSON, 'success')
      testProfList(resJSON.report, 5)
      const u1 = resJSON.report[0]
      const loginPwdParam = findPwd(u1.username, registDatas) 
      userToManage = { 
        id: findProfId(u1.loginUrl),
        srnm: u1.username,
        psswrd: loginPwdParam,
        pwdHash: findPwd(u1.username, testDatas),
        lgnurl: u1.loginUrl,
      }
    })
  })

  it('Login a users, change pwd, revise in DB and cookie date changes check', function(){
    const chaiAgent = chai.request.agent(api);
    return chaiAgent
    .post(userToManage.lgnurl)
    .type('form')
    .send( loginForm(userToManage.srnm, userToManage.psswrd) )
    .then(res=>{
      testRespBasics(res, 200)
      testRespHeader(res)
      testRespCookie(res, 'session', userToManage.id)
      const cookieDating1 = findRespCookieDate(res, 'session');
      
      const firtsJSON = JSON.parse(res.text);
      testJSONContent(firtsJSON, 'success')
      testLoginResp(firtsJSON.report)

      userToManage.pwdChngPrfDl = firtsJSON.report.changPwdDelAccUrl

      const newPwd = 'testPwd'
      return chaiAgent.keepOpen()
      .put(userToManage.pwdChngPrfDl)
      .type('form')
      .send( pwdChangeForm( userToManage.psswrd, newPwd ) )
      .then(nextRes=>{
        testRespBasics(nextRes, 200)
        testRespHeader(nextRes)
        testRespCookie(nextRes, 'session', userToManage.id)
        const cookieDating2 = findRespCookieDate(nextRes, 'session');
        //console.log(cookieDating1)
        //console.log(cookieDating2)
        expect(cookieDating1).to.not.equal(cookieDating2)

        const secJSON = JSON.parse(nextRes.text)
        testJSONContent(secJSON, 'success')
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
    const chaiAgent = chai.request.agent(api);
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
      .send( deleteProfForm(userToManage.nwpsswrd) )
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
    const chaiAgent = chai.request.agent(api);
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
        pwdHash: findPwd(u2.username, testDatas),
        lgnurl: u2.loginUrl
      }
      const loginPwdParam = findPwd(u2.username, registDatas) 

      userToNegativeManage.psswrd = loginPwdParam
    })
  })

  it('Password change, empty old password', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd))
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      const cookieDate1 = findRespCookieDate(nextRes, 'session') 

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      userToNegativeManage.pwdDelUrl = nextJSON.report.changPwdDelAccUrl

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( pwdChangeForm( '', 'testPwd') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        const cookieDate2 = findRespCookieDate(thirdRes, 'session') 
        expect(cookieDate1).to.not.equal(cookieDate2)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('old_password')
        expect(thirdJSON.message).to.equal('This old password is not permitted!')

        return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')
          expect(doc.password).to.equal(userToNegativeManage.pwdHash)
        })


      })
    })

  })

  it('Password change, not proper old password', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd) )
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      const cookieDate1 = findRespCookieDate(nextRes, 'session') 

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( pwdChangeForm( 'sureNotPwd', 'testPwd') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        const cookieDate2 = findRespCookieDate(thirdRes, 'session') 
        expect(cookieDate1).to.not.equal(cookieDate2)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('old_password')
        expect(thirdJSON.message).to.equal('This old password is not correct!')

        return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')
          expect(doc.password).to.equal(userToNegativeManage.pwdHash)
        })

      })
    })
  })

  it('Password change, empty new password', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd) )
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      const cookieDate1 = findRespCookieDate(nextRes, 'session') 

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( pwdChangeForm( userToNegativeManage.psswrd, '') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        const cookieDate2 = findRespCookieDate(thirdRes, 'session') 
        expect(cookieDate1).to.not.equal(cookieDate2)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('new_password')
        expect(thirdJSON.message).to.equal('This new password is not permitted!')

        return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')
          expect(doc.password).to.equal(userToNegativeManage.pwdHash)
        })
      })
    })
  })

  it('Password change, too short new password', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd) )
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      const cookieDate1 = findRespCookieDate(nextRes, 'session') 

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( pwdChangeForm( userToNegativeManage.psswrd, 't') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        const cookieDate2 = findRespCookieDate(thirdRes, 'session') 
        expect(cookieDate1).to.not.equal(cookieDate2)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('new_password')
        expect(thirdJSON.message).to.equal('This new password is not permitted!')

        return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')
          expect(doc.password).to.equal(userToNegativeManage.pwdHash)
        })
      })
    })
  })

  it('Password change, no form', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd) )
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      const cookieDate1 = findRespCookieDate(nextRes, 'session') 

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .put(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( '' )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        const cookieDate2 = findRespCookieDate(thirdRes, 'session') 
        expect(cookieDate1).to.not.equal(cookieDate2)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('old_password')
        expect(thirdJSON.message).to.equal('This old password is not permitted!')

        return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')
          expect(doc.password).to.equal(userToNegativeManage.pwdHash)
        })
      })
    })
  })

  it('Password change, not existiong user - changed url paramter', ()=>{
    
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd) )
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      const cookieDate1 = findRespCookieDate(nextRes, 'session') 
      expect(cookieDate1).to.be.a('Date')
      
      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      const alteredPwdChangeUrl = userToNegativeManage.pwdDelUrl.replace(
        new RegExp('[0-9a-f]{24}'), '0123456789adcdef01234567'
      )
      
      return chaiAgent.keepOpen()
      .put(alteredPwdChangeUrl)
      .type('form')
      .send( pwdChangeForm(userToNegativeManage.psswrd, 'newPwd') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespNoCookie(thirdRes, 'session') //no cookie renewing this case!!

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('')
        expect(thirdJSON.message).to.equal('Management is permitted only at your account!')

        return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')
          expect(doc.password).to.equal(userToNegativeManage.pwdHash)
        })

      })
    })
  })

  it('Deletion, empty password', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd) )
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      const cookieDate1 = findRespCookieDate(nextRes, 'session') 

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .delete(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( deleteProfForm('') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        const cookieDate2 = findRespCookieDate(thirdRes, 'session') 
        expect(cookieDate1).to.not.equal(cookieDate2)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('old_password')
        expect(thirdJSON.message).to.equal('This old password is not permitted!')

        return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')
          expect(doc._id.toString()).to.equal(userToNegativeManage.id)
        })
      })
    })
  })

  it('Deletion, not proper password', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd) )
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      const cookieDate1 = findRespCookieDate(nextRes, 'session') 

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .delete(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( deleteProfForm('sureNotGood') )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        const cookieDate2 = findRespCookieDate(thirdRes, 'session') 
        expect(cookieDate1).to.not.equal(cookieDate2)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('old_password')
        expect(thirdJSON.message).to.equal('This old password is not correct!')

        return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')
          expect(doc._id.toString()).to.equal(userToNegativeManage.id)
        })
      })
    })
  })

  it('Deletion, empty form', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd) )
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      const cookieDate1 = findRespCookieDate(nextRes, 'session') 

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      return chaiAgent.keepOpen()
      .delete(userToNegativeManage.pwdDelUrl)
      .type('form')
      .send( '' )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespCookie(thirdRes, 'session', userToNegativeManage.id)
        const cookieDate2 = findRespCookieDate(thirdRes, 'session') 
        expect(cookieDate1).to.not.equal(cookieDate2)

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('old_password')
        expect(thirdJSON.message).to.equal('This old password is not permitted!')

        return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')
          expect(doc._id.toString()).to.equal(userToNegativeManage.id)
        })
      })
    })
  })

  it('Deletion, no existing user to delete - changed url parameter', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .post(userToNegativeManage.lgnurl)
    .type('form')
    .send( loginForm(userToNegativeManage.srnm, userToNegativeManage.psswrd) )
    .then(nextRes=>{
      testRespBasics(nextRes, 200)
      testRespHeader(nextRes)
      testRespCookie(nextRes, 'session', userToNegativeManage.id)
      const cookieDate1 = findRespCookieDate(nextRes, 'session') 
      expect(cookieDate1).to.be.a('Date')

      const nextJSON = JSON.parse(nextRes.text)
      testJSONContent(nextJSON, 'success')

      const alteredPwdChangeUrl = userToNegativeManage.pwdDelUrl.replace(
        new RegExp('[0-9a-f]{24}'), '0123456789adcdef01234567'
      )

      return chaiAgent.keepOpen()
      .delete(alteredPwdChangeUrl)
      .type('form')
      .send( deleteProfForm(userToNegativeManage.psswrd) )
      .then(thirdRes=>{
        testRespBasics(thirdRes, 200)
        testRespHeader(thirdRes)
        testRespNoCookie(thirdRes, 'session') //no cookie renewing this case!!

        const thirdJSON = JSON.parse(thirdRes.text)
        testJSONContent(thirdJSON, 'failed')

        expect(thirdJSON.report).to.equal('')
        expect(thirdJSON.message).to.equal('Management is permitted only at your account!')

        return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
          expect(err).to.be.a('null')
          expect(doc).to.be.a('object')
          expect(doc._id.toString()).to.equal(userToNegativeManage.id)
        })
      })
    })
  })

  it('Make a pwdchange change without login', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .put(userToNegativeManage.pwdDelUrl)
    .type('form')
    .send( pwdChangeForm( userToNegativeManage.psswrd, 'testPwd') )
    .then(thirdRes=>{
      testRespBasics(thirdRes, 200)
      testRespHeader(thirdRes)
      testRespNoCookie(thirdRes, 'session')

      const thirdJSON = JSON.parse(thirdRes.text)
      testJSONContent(thirdJSON, 'failed')

      expect(thirdJSON.report).to.equal('')
      expect(thirdJSON.message).to.equal('Please, log in to use such service!')

      return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
        expect(err).to.be.a('null')
        expect(doc).to.be.a('object')
        expect(doc.password).to.equal(userToNegativeManage.pwdHash)
      })
    })
  })

  it('Make a account delete without login', ()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.keepOpen()
    .delete(userToNegativeManage.pwdDelUrl)
    .type('form')
    .send( deleteProfForm(userToNegativeManage.psswrd) )
    .then(thirdRes=>{
      testRespBasics(thirdRes, 200)
      testRespHeader(thirdRes)
      testRespNoCookie(thirdRes, 'session')

      const thirdJSON = JSON.parse(thirdRes.text)
      testJSONContent(thirdJSON, 'failed')

      expect(thirdJSON.report).to.equal('')
      expect(thirdJSON.message).to.equal('Please, log in to use such service!')

      return ProfileModel.findOne({ _id: userToNegativeManage.id }, (err, doc)=>{
        expect(err).to.be.a('null')
        expect(doc).to.be.a('object')
        expect(doc._id.toString()).to.equal(userToNegativeManage.id)
      })
    })
  })
})

