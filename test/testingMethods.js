const expect = require('chai').expect;
const profileIDPos = require('./testConfig').profileIDPosInUrl
const todoIDPos = require('./testConfig').todoIDPosInUrl
const profURLSchema = require('./testConfig').profShortURLRegexp
const todoURLSchema = require('./testConfig').todoShortURLRegexp
const todoLongURLLong = require('./testConfig').todoLongURLRegexp

module.exports.forMsgs = {
    reviseMessageContent: (res, expRes)=>{
        expect(res).to.be.a('object')
        expect(res).to.have.own.property('status')
        expect(res.status).to.equal(expRes)
        expect(res).to.have.own.property('report')
    },
    reviseListOfProfiles: (report)=>{
      expect(report).to.be.a('array')
      expect(report).to.have.deep.property('username')
      expect(report).to.have.deep.property('loginUrl')
    },
    reviseProfDetailedContent: (report)=>{
        expect(report).to.have.own.property('username')
        expect(report.username).to.be.a('string')
        expect(report.username).to.not.equal('')
        expect(report).to.have.own.property('first_name')
        expect(report.firt_name).to.be.a('string')
        expect(report.first_name).to.not.equal('')
        expect(report).to.have.own.property('last_name')
        expect(report).to.have.own.property('age')
        expect(report).to.have.own.property('occupation')
        expect(report).to.have.own.property('todos')

        expect(report).to.have.own.property('changPwdDelAccUrl')
        expect(report).to.have.own.property('logoutUrl')
    },
      
    reviseTodoContent: (report)=>{
        expect(report).to.have.own.property('task')
        expect(report).to.have.own.property('start')
        expect(report).to.have.own.property('update')
        expect(report).to.have.own.property('notation')
        expect(report).to.have.own.property('priority')
        expect(report).to.have.own.property('update')
        expect(report).to.have.own.property('start')
    },

    testRespMsgBasics: (resp, expStatusCode) =>{
        expect(resp).to.have.status(expStatusCode)
        expect(resp).to.be.json
    },
    testJSONMsgBasics: (msg, expState) =>{
        expect(msg).to.be.a('object');
        expect(msg).to.have.property('status')
        expect(msg).to.have.property('report')
        expect(msg).to.have.property('message')

        expect(msg.status).to.be.a('string')
        expect(msg.status).to.equal(expState)
        expect(msg.message).to.be.a('string')
    },
    testRespMsgCookie: (resp, expLabel, expContent)=>{
        expect(resp).to.have.cookie(expLabel, expContent)
    },
    testRepHeaders: (resp)=>{

    }
}
module.exports.forFormParams = { 
    smblLoginForm: (uname, pwd)=>{
      return {
        'username': uname,
        'password': pwd
      }
    },
    smblRegistForm: (profObj)=>{
      return {
        'username': profObj.username,
        'password': pwd1,
        'password_repeat': pwd2,
        'first_name': firstn,
        'last_name': lastn,
        'age': age,
        'occupation': ocup
      }
    },
    smblPwdChangeForm: (pwdOld, pwdNew)=>{
      return{
        'old_password': pwdOld,
        'new_password': pwdNew
      }
    },
    smblProfDelForm: (pwd)=>{
      return {
        'old_password': pwd
      }
    },

    smblNewTodoForm: (todoObj)=>{
      return {
        'task': todoObj.task,
        'priority': todoObj.priority,
        'notation': todoObj.notation
      }
    },
    smblTodoNoteChangeForm: (note)=>{
      return{
        'notation': note
      }
    },
    smblTodoStatusChangeForm: (sts)=>{
      return{
        'status': sts
      }
    }
      
}
module.exports.forUrls = {
    extinctProfIdFromUrl: (url) =>{
      return url.split('/')[profileIDPos]
    },
    
    extinctTodoIdFromUrl: (url)=>{
      return url.split('/')[todoIDPos]
    }

}