const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const mongoose = require('mongoose');
const expect = require('chai').expect;

const dbaccess = require('../testConfig').testDBConnection;
const ProfileModel = require('../../model/ProfileModel.js');
const api = require('../../server.js');

const testDatas = require('../todoTestDatas').profilesWithTodos;
const testTodos = require('../todoTestDatas').bareNewTodos
const registDatas = require('../registProfileDatas').profiles

const testRespBasics = require('../testingMethods').forMsgs.testRespMsgBasics
const testRespHeader = require('../testingMethods').forMsgs.testRespMsgHeaders
const testRespCookie = require('../testingMethods').forMsgs.testRespMsgCookie
const testRespNoCookie = require('../testingMethods').forMsgs.testRespMsgNoCookie
const testJSONContent = require('../testingMethods').forMsgs.testJSONMsgBasics
const testProfList = require('../testingMethods').forMsgs.reviseListOfProfiles
const testLoginResp = require('../testingMethods').forMsgs.reviseProfDetailedContent
const testTodoItem = require('../testingMethods').forMsgs.reviseTodoContent
const testTodoDates = require('../testingMethods').forMsgs.testThisTodoDating
const testTodoFrontAndBack = require('../testingMethods').forMsgs.testBackAndFrontTodoEquality

const findRespCookieDate = require('../testingMethods').forMsgs.extinctRespCookieExpireDate
const findPwd = require('../testingMethods').forFormParams.extinctPwd

const loginForm = require('../testingMethods').forFormParams.smblLoginForm
const newTodoForm = require('../testingMethods').forFormParams.smblNewTodoForm
const changeStateForm = require('../testingMethods').forFormParams.smblTodoStatusChangeForm
const changeNoteForm = require('../testingMethods').forFormParams.smblTodoNoteChangeForm

const findProfId = require('../testingMethods').forUrls.extinctProfIdFromUrl

const userToManage = []

before(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true})
    mongoose.connection
    .once('open', ()=>{ console.log('Test DB connection established') })
    .once('close', ()=>{ console.log('Test DB connection terminated') })
    .on('error', (err)=>{ console.log('Test DB error occured ', err) })

    mongoose.connection.collections.profiles.drop(err=>{
      if(err && err.code !== 26){
        console.log('Profile collection is not empty!')
        reject();
      }
      ProfileModel.insertMany( testDatas , (error, resp)=>{
        if(error || resp.length !== testDatas.length){
          console.log('Collection filling up failed!')
          reject();
        }
        console.log('Test DB ready to use!')
        resolve();
      })
    })
  })
})

after(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connection.close();
    resolve()
  })
})

describe('CRUD of todos', function(){

  before(()=>{
    const chaiAgent = chai.request.agent(api);
    return chaiAgent.get('/profile/')
    .then(res=>{
      testRespBasics(res, 200)
      testRespHeader(res)
      const jsonRes = JSON.parse(res.text)
      testJSONContent(jsonRes, 'success')
      testProfList(jsonRes.report, 5)
      for(let i = 0; i <= 2; i++){
        const user = {
          id: findProfId(jsonRes.report[i].loginUrl),
          srnm: jsonRes.report[i].username,
          psswrd: findPwd(jsonRes.report[i].username, registDatas),
          lgnurl: jsonRes.report[i].loginUrl
        }
        userToManage.push(user)
      }
    })
  })
  describe('Read in some user\'s task list', ()=>{
    it('Read user 1 tasks in system - some should be', ()=>{
      const chaiAgent = chai.request.agent(api);
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespCookie(res, 'session', actUser.id)
        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)
        const todos = logJSON.report.todos;
        expect(todos).to.have.lengthOf(3)
        todos.forEach(item=>{
          testTodoItem(item)
        })

      })
    })
    it('Read user 2 tasks in system - none should be', ()=>{
      const chaiAgent = chai.request.agent(api);
      const actUser = userToManage[1]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespCookie(res, 'session', actUser.id)
        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)
        expect(logJSON.report.todos).to.have.lengthOf(0)
      })
    })
  })
  describe('Create some new todo to a user', ()=>{
    it('Add new todo to a user - aside to some', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)
        //const cookieDate1 = findRespCookieDate(res, 'session')
        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const newTodoUrl = logJSON.report.createNewTodo
        const beforeCreateTodoAmount = logJSON.report.todos.length
        const newTodo = testTodos[0]
        return chaiAgent
        .post(newTodoUrl)
        .type('form')
        .send( newTodoForm(newTodo) )
        .then(nextRes=>{
          testRespBasics(nextRes, 201)
          testRespHeader(nextRes)
          testRespCookie(nextRes, 'session', actUser.id)
          //const cookieDate2 = findRespCookieDate(nextRes, 'session')
          //expect(cookieDate1).to.not.deep.equal(cookieDate2)

          const respJSON = JSON.parse(nextRes.text)
          testJSONContent(respJSON, 'success')
          const newTodoFrontVer = respJSON.report
          testTodoItem(newTodoFrontVer)
          testTodoDates(newTodoFrontVer, 'equal')
          const newTodoID = respJSON.report.id

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            expect(doc.todos).to.have.lengthOf(beforeCreateTodoAmount + 1)
            const newTodoInDB = doc.findThisRawTodo(newTodoID)
            testTodoFrontAndBack(newTodoFrontVer, newTodoInDB)
          })

        })

      })
    })
    it('Add new todo to a user - first one', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[1]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)
        //const cookieDate1 = findRespCookieDate(res, 'session')
        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const newTodoUrl = logJSON.report.createNewTodo
        const beforeCreateTodoAmount = logJSON.report.todos.length
        const newTodo = testTodos[0]
        return chaiAgent
        .post(newTodoUrl)
        .type('form')
        .send( newTodoForm(newTodo) )
        .then(nextRes=>{
          testRespBasics(nextRes, 201)
          testRespHeader(nextRes)
          testRespCookie(nextRes, 'session', actUser.id)
          //const cookieDate2 = findRespCookieDate(nextRes, 'session')
          //expect(cookieDate1).to.not.deep.equal(cookieDate2)

          const respJSON = JSON.parse(nextRes.text)
          testJSONContent(respJSON, 'success')
          const newTodoFrontVer = respJSON.report
          testTodoItem(newTodoFrontVer)
          testTodoDates(newTodoFrontVer, 'equal')
          const newTodoID = respJSON.report.id

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            expect(doc.todos).to.have.lengthOf(beforeCreateTodoAmount + 1)
            const newTodoInDB = doc.findThisRawTodo(newTodoID)
            testTodoFrontAndBack(newTodoFrontVer, newTodoInDB)
          })
        })
      })
    })
  })
  describe('Modfy some todo of some user', ()=>{
    it('Make a todo done state', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[2]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const todoActManage = logJSON.report.todos[0]
        const statusChangeUrl = todoActManage.statusChangeUrl
        return chaiAgent
        .put( statusChangeUrl )
        .type('form')
        .send(  changeStateForm('true') )
        .then(nextRes=>{
          testRespBasics(nextRes, 200)
          testRespHeader(nextRes)
          testRespCookie(nextRes, 'session', actUser.id)
          const noteChangeJSON = JSON.parse(nextRes.text)
          testJSONContent(noteChangeJSON, 'success')

          const frontUpdateDate = new Date(noteChangeJSON.report)
          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const todoFromDB = doc.findThisRawTodo(todoActManage.id)
            expect(todoFromDB).to.be.a('object')
            expect(todoFromDB.status).to.equal('Finished')
            const dbUpdateDate = todoFromDB.lastModfingDate
            expect(dbUpdateDate).to.deep.equal(frontUpdateDate)
          })

        })
      })
    })
    it('Make a todo undone again - the same', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[2]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const todoActManage = logJSON.report.todos[0]
        const statusChangeUrl = todoActManage.statusChangeUrl
        return chaiAgent
        .put( statusChangeUrl )
        .type('form')
        .send(  changeStateForm('false') )
        .then(nextRes=>{
          testRespBasics(nextRes, 200)
          testRespHeader(nextRes)
          testRespCookie(nextRes, 'session', actUser.id)
          const noteChangeJSON = JSON.parse(nextRes.text)
          testJSONContent(noteChangeJSON, 'success')

          const frontUpdateDate = new Date(noteChangeJSON.report)
          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const todoFromDB = doc.findThisRawTodo(todoActManage.id)
            expect(todoFromDB).to.be.a('object')
            expect(todoFromDB.status).to.equal('Proceeding')
            const dbUpdateDate = todoFromDB.lastModfingDate
            expect(dbUpdateDate).to.deep.equal(frontUpdateDate)
          })

        })
      })
    })
    it('Change a todo notation - with some content, that has none', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[2]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const todoActManage = logJSON.report.todos[1] //without notation sure
        const todoOldNotation = todoActManage.notation
        expect(todoOldNotation).to.be.a('string')
        const newNotationText = 'This must be a string to DB'

        const noteChangeUrl = todoActManage.notationChangeUrl
        return chaiAgent
        .put( noteChangeUrl )
        .type('form')
        .send(  changeNoteForm(newNotationText) )
        .then(nextRes=>{
          testRespBasics(nextRes, 200)
          testRespHeader(nextRes)
          testRespCookie(nextRes, 'session', actUser.id)
          const noteChangeJSON = JSON.parse(nextRes.text)
          testJSONContent(noteChangeJSON, 'success')
          const frontUpdateDate = new Date(noteChangeJSON.report)
          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const todoFromDB = doc.findThisRawTodo(todoActManage.id)
            expect(todoFromDB).to.be.a('object')
            expect(todoFromDB.notation).to.not.equal(todoOldNotation)
            expect(todoFromDB.notation).to.equal(newNotationText)
            const dbUpdateDate = todoFromDB.lastModfingDate
            expect(dbUpdateDate).to.deep.equal(frontUpdateDate)
          })

        })
      })
    })
    it('Change a todo notation - with no content, that has some', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[2]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const todoActManage = logJSON.report.todos[0] // with notation sure
        const todoOldNotation = todoActManage.notation
        expect(todoOldNotation).to.be.a('string')
        const newNotationText = ''
        
        const noteChangeUrl = todoActManage.notationChangeUrl
        return chaiAgent
        .put( noteChangeUrl )
        .type('form')
        .send(  changeNoteForm(newNotationText) )
        .then(nextRes=>{
          testRespBasics(nextRes, 200)
          testRespHeader(nextRes)
          testRespCookie(nextRes, 'session', actUser.id)
          const noteChangeJSON = JSON.parse(nextRes.text)
          testJSONContent(noteChangeJSON, 'success')

          const frontUpdateDate = new Date(noteChangeJSON.report)
          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const todoFromDB = doc.findThisRawTodo(todoActManage.id)
            expect(todoFromDB).to.be.a('object')
            expect(todoFromDB.notation).to.not.equal(todoOldNotation)
            expect(todoFromDB.notation).to.equal(newNotationText)
            const dbUpdateDate = todoFromDB.lastModfingDate
            expect(dbUpdateDate).to.deep.equal(frontUpdateDate)
          })

        })
      })
    })
    it('Delete a todo - one among some', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const todosAmount = logJSON.report.todos.length
        const todoActManage = logJSON.report.todos[0] // with notation sure
        const deleteUrl = todoActManage.removingUrl

        return chaiAgent
        .delete(deleteUrl)
        .then(nextRes=>{
          testRespBasics(nextRes, 200)
          testRespHeader(nextRes)
          testRespCookie(nextRes, 'session', actUser.id)

          const delJSON = JSON.parse(nextRes.text)
          testJSONContent(delJSON, 'success')
          expect(delJSON.report).to.be.a('string')
          expect(delJSON.report).to.equal('')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const realTodoAmount = doc.todos.length
            expect(realTodoAmount).to.be.below(todosAmount)
            const attemptFind = doc.todos.filter(item=>{
              return item._id === todoActManage.id
            })
            expect(attemptFind).to.be.empty
          })
        })

      })
    })
    it('Delete a todo - one single item', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[1]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)


        const todoActManage = logJSON.report.todos[0] // with notation sure
        const deleteUrl = todoActManage.removingUrl

        return chaiAgent
        .delete(deleteUrl)
        .then(nextRes=>{
          testRespBasics(nextRes, 200)
          testRespHeader(nextRes)
          testRespCookie(nextRes, 'session', actUser.id)

          const delJSON = JSON.parse(nextRes.text)
          testJSONContent(delJSON, 'success')
          expect(delJSON.report).to.be.a('string')
          expect(delJSON.report).to.equal('')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            expect(doc.todos.length).to.be.equal(0)
          })
        })

      })
    })
  })

})
describe('Negaitve CRUD tests', ()=>{
  describe('Creation attempts', ()=>{
    it('Login, todo create - without task definition', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[1]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const todoActAount = 0
        const createTodoUrl = logJSON.report.createNewTodo
        const newTodo = {
          task: '',
          priority: testTodos[0].priority,
          notation: testTodos[0].notation
        }
        chaiAgent
        .post(createTodoUrl)
        .type('form')
        .send( newTodoForm(newTodo) )
        .then(nextRes=>{
          testRespBasics(nextRes, 400)
          
          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')

          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('task')
          expect(finalJSON.message).to.be.a('string')
          expect(finalJSON.message).to.equal('This task is not permitted!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            expect(doc.todos).to.have.lengthOf(todoActAount)
          })
        })
      })
    })
    it('Login, todo create - without priority definition', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[1]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const todoActAount = 0
        const createTodoUrl = logJSON.report.createNewTodo
        const newTodo = {
          task: testTodos[0].task,
          priority: '',
          notation: testTodos[0].notation
        }
        chaiAgent
        .post(createTodoUrl)
        .type('form')
        .send( newTodoForm(newTodo) )
        .then(nextRes=>{
          testRespBasics(nextRes, 400)
          
          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')

          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('priority')
          expect(finalJSON.message).to.be.a('string')
          expect(finalJSON.message).to.equal('This priority is not permitted!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            expect(doc.todos).to.have.lengthOf(todoActAount)
          })
        })
      })
    })
  })
  describe('Modify state attempts', ()=>{
    it('Login, todo modify state - no good url at todoID, no todo like that', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const actTodo = logJSON.report.todos[0]
        const stateChangeUrl = actTodo.statusChangeUrl.replace(
          new RegExp('[0-9a-f]{24}\/status$'), '0123456789adcdef01234567/status'
        )
        return chaiAgent
        .put(stateChangeUrl)
        .type('form')
        .send( changeStateForm('true') )
        .then(nextRes=>{
          testRespBasics(nextRes, 500)

          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')
          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('DB error occured!')
          expect(finalJSON.message).to.equal('Update failed!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const dbTodo = doc.findThisRawTodo(actTodo.id)
            expect(dbTodo.status.toString()).to.equal('Proceeding')
          })
        })
      })
    })
    it('Login, todo modify state - no good url at profID', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const actTodo = logJSON.report.todos[0]
        const stateChangeUrl = actTodo.statusChangeUrl.replace(
          new RegExp('^\/profile\/[0-9a-f]{24}'), '/profile/0123456789adcdef01234567'
        )
        return chaiAgent
        .put(stateChangeUrl)
        .type('form')
        .send( changeStateForm('true') )
        .then(nextRes=>{
          testRespBasics(nextRes, 400)

          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')
          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('')
          expect(finalJSON.message).to.equal('Management is permitted only at your account!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const dbTodo = doc.findThisRawTodo(actTodo.id)
            expect(dbTodo.status.toString()).to.equal('Proceeding')
          })
        })
      })
    })
    it('Login, todo modify state - not good input', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const actTodo = logJSON.report.todos[0]
        const stateChangeUrl = actTodo.statusChangeUrl
        return chaiAgent
        .put(stateChangeUrl)
        .type('form')
        .send( changeStateForm('vcxy') )
        .then(nextRes=>{
          testRespBasics(nextRes, 400)
          
          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')

          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('status')
          expect(finalJSON.message).to.equal('System error occured!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const dbTodo = doc.findThisRawTodo(actTodo.id)
            expect(dbTodo.status.toString()).to.equal('Proceeding')
          })
        })
      })
    })
    
    it('Login, todo modify state - no form input', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const actTodo = logJSON.report.todos[0]
        const stateChangeUrl = actTodo.statusChangeUrl
        return chaiAgent
        .put(stateChangeUrl)
        .type('form')
        .send( '' )
        .then(nextRes=>{
          testRespBasics(nextRes, 400)
          
          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')

          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('status')
          expect(finalJSON.message).to.equal('System error occured!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const dbTodo = doc.findThisRawTodo(actTodo.id)
            expect(dbTodo.status.toString()).to.equal('Proceeding')
          })
        })
      })
    })
  })
  describe('Modify notation attempts', ()=>{
    it('Login, todo modify notation - no good url at todoID, no todo like that', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const actTodo = logJSON.report.todos[1]
        const noteChangeUrl = actTodo.notationChangeUrl.replace(
          new RegExp('[0-9a-f]{24}\/notation$'), '0123456789adcdef01234567/notation'
        )
        const newNotation = 'Not supposed to be in DB!'
        return chaiAgent
        .put(noteChangeUrl)
        .type('form')
        .send( changeNoteForm(newNotation) )
        .then(nextRes=>{
          testRespBasics(nextRes, 500)

          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')
          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('DB error occured!')
          expect(finalJSON.message).to.equal('Update failed!')

          return ProfileModel.findOne( {_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const dbTodo = doc.findThisRawTodo(actTodo.id)
            expect(dbTodo).to.be.a('object')
            expect(dbTodo.notation).to.not.deep.equal(newNotation)
          })
        })
      })
    })
    it('Login, todo modify notation - no good url at profID', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const actTodo = logJSON.report.todos[1]
        const noteChangeUrl = actTodo.notationChangeUrl.replace(
          new RegExp('^\/profile\/[0-9a-f]{24}'), '/profile/0123456789adcdef01234567'
        )
        const newNotation = 'Not supposed to be in DB!'

        return chaiAgent
        .put(noteChangeUrl)
        .type('form')
        .send( changeNoteForm(newNotation) )
        .then(nextRes=>{
          testRespBasics(nextRes, 400)

          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')
          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('')
          expect(finalJSON.message).to.equal('Management is permitted only at your account!')

          return ProfileModel.findOne( {_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const dbTodo = doc.findThisRawTodo(actTodo.id)
            expect(dbTodo).to.be.a('object')
            expect(dbTodo.notation).to.not.deep.equal(newNotation)
          })
        })
      })
    })
    it('Login, todo modify notation - no form input', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const actTodo = logJSON.report.todos[0]
        const oldNotation = actTodo.notation
        const noteChangeUrl = actTodo.notationChangeUrl
        return chaiAgent
        .put(noteChangeUrl)
        .type('form')
        .send( '' )
        .then(nextRes=>{
          testRespBasics(nextRes, 400)
          
          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')

          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('notation')
          expect(finalJSON.message).to.equal('System error occured!')

          return ProfileModel.findOne( {_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const dbTodo = doc.findThisRawTodo(actTodo.id)
            expect(dbTodo).to.be.a('object')
            expect(dbTodo.toString()).to.not.deep.equal(oldNotation)
          })
        })
      })
    })
  })
  describe('Deletion attempts', ()=>{
    it('Login, todo deletion - no good url at todoID, no todo like that', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const actTodo = logJSON.report.todos[0]
        const deleteTodoUrl = actTodo.removingUrl.replace(
          new RegExp('[0-9a-f]{24}$'), '0123456789adcdef01234567'
        )
        return chaiAgent
        .delete(deleteTodoUrl)
        .then(nextRes=>{
          testRespBasics(nextRes, 500)

          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')
          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('DB error occured!')
          expect(finalJSON.message).to.equal('Deletion failed!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const dbTodo = doc.findThisRawTodo(actTodo.id)
            expect(dbTodo).to.be.a('object')
          })
        })
      })
    })
    it('Login, todo deletion - no good url at profID', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]
      return chaiAgent
      .post(actUser.lgnurl)
      .type('form')
      .send( loginForm(actUser.srnm, actUser.psswrd) )
      .then(res=>{
        testRespBasics(res, 200)
        testRespHeader(res)
        testRespCookie(res, 'session', actUser.id)

        const logJSON = JSON.parse(res.text)
        testJSONContent(logJSON, 'success')
        testLoginResp(logJSON.report)

        const actTodo = logJSON.report.todos[0]
        const deleteTodoUrl = actTodo.notationChangeUrl.replace(
          new RegExp('^\/profile\/[0-9a-f]{24}'), '/profile/0123456789adcdef01234567'
        )

        return chaiAgent
        .delete(deleteTodoUrl)
        .then(nextRes=>{
          testRespBasics(nextRes, 400)
          const finalJSON = JSON.parse(nextRes.text)

          testJSONContent(finalJSON, 'failed')
          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('')
          expect(finalJSON.message).to.equal('Management is permitted only at your account!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const dbTodo = doc.findThisRawTodo(actTodo.id)
            expect(dbTodo).to.be.a('object')
          })

        })
      })
    })
  })
  describe('No login attempts', ()=>{
    it('No login, but attempt create todo', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]

      return ProfileModel.findThisProfileToLogin(actUser.id, (dbresp)=>{
        expect(dbresp).to.be.a('object')
        
        testJSONContent(dbresp, 'success')
        testLoginResp(dbresp.report)

        const todoAmount = dbresp.report.todos.length
        const createUrl = dbresp.report.createNewTodo;
        const newTodo = testTodos[1]
        return chaiAgent
        .post(createUrl)
        .type('form')
        .send( newTodoForm(newTodo) )
        .then(nextRes =>{
          testRespBasics(nextRes, 400)
          testRespHeader(nextRes)
          testRespNoCookie(nextRes, 'session')

          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')
          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('')
          expect(finalJSON.message).to.equal('Please, log in to use such service!')

          return ProfileModel.findOne({ _id: actUser.id }, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')
            expect(doc.todos.length).to.equal(todoAmount)
          })
        })
      })
    })
    it('No login, but attempt todo state change', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]

      return ProfileModel.findThisProfileToLogin(actUser.id, (dbresp)=>{
        expect(dbresp).to.be.a('object')
        
        testJSONContent(dbresp, 'success')
        testLoginResp(dbresp.report)

        const todoTarget = dbresp.report.todos[0]
        const changeStateUrl = todoTarget.statusChangeUrl
        // true input -> setting Finished, false input -> setting Proceeding
        const newState = todoTarget.status === 'Proceeding'? 'true': 'false'
        return chaiAgent
        .post(changeStateUrl)
        .type('form')
        .send( changeStateForm(newState) )
        .then(nextRes =>{
          testRespBasics(nextRes, 400)
          testRespHeader(nextRes)
          testRespNoCookie(nextRes, 'session')

          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')
          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('')
          expect(finalJSON.message).to.equal('Please, log in to use such service!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')
            const dbStateMustBe = newState === 'true'? 'Proceeding' : 'Finished'

            const dbTodo = doc.findThisRawTodo( todoTarget.id )
            expect(dbTodo).to.be.a('object')
            expect(dbTodo.status.toString()).to.equal(dbStateMustBe)
          })
        })
      })
    })
    it('No login, but attempt todo notation change', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]

      return ProfileModel.findThisProfileToLogin(actUser.id, (dbresp)=>{
        expect(dbresp).to.be.a('object')
        
        testJSONContent(dbresp, 'success')
        testLoginResp(dbresp.report)

        const todoTarget = dbresp.report.todos[0]
        const changeNoteUrl = todoTarget.notationChangeUrl

        const newNotation = 'This must be in db, but no login state!'
        return chaiAgent
        .post(changeNoteUrl)
        .type('form')
        .send( changeNoteForm(newNotation) )
        .then(nextRes =>{
          testRespBasics(nextRes, 400)
          testRespHeader(nextRes)
          testRespNoCookie(nextRes, 'session')

          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')
          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('')
          expect(finalJSON.message).to.equal('Please, log in to use such service!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')

            const dbTodo = doc.findThisRawTodo( todoTarget.id )
            expect(dbTodo).to.be.a('object')
            expect(dbTodo.notation.toString()).to.not.equal(newNotation)
          })
        })
      })
    })
    it('No login, but attempt todo deletion', ()=>{
      const chaiAgent = chai.request.agent(api)
      const actUser = userToManage[0]

      return ProfileModel.findThisProfileToLogin(actUser.id, (dbresp)=>{
        expect(dbresp).to.be.a('object')
        
        testJSONContent(dbresp, 'success')
        testLoginResp(dbresp.report)

        const todoAmount = dbresp.report.todos.length
        const todoTarget = dbresp.report.todos[0]
        const deletionUrl = todoTarget.removingUrl

        return chaiAgent
        .post(deletionUrl)
        .then(nextRes =>{
          testRespBasics(nextRes, 400)
          testRespHeader(nextRes)
          testRespNoCookie(nextRes, 'session')

          const finalJSON = JSON.parse(nextRes.text)
          testJSONContent(finalJSON, 'failed')
          expect(finalJSON.report).to.be.a('string')
          expect(finalJSON.report).to.equal('')
          expect(finalJSON.message).to.equal('Please, log in to use such service!')

          return ProfileModel.findOne({_id: actUser.id}, (err, doc)=>{
            expect(err).to.be.a('null')
            expect(doc).to.be.a('object')
            expect(doc.todos.length).to.equal(todoAmount)

            const dbTodo = doc.findThisRawTodo( todoTarget.id )
            expect(dbTodo).to.be.a('object')
          })
        })
      })
    })
  })

})
