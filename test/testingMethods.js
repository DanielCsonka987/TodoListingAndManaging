const expect = require('chai').expect;
const testingHeaderArray = require('./testConfig').headerArrayToTest
const profileIDPos = require('./testConfig').profileIDPosInUrl
const todoIDPos = require('./testConfig').todoIDPosInUrl
const profURLSchema = require('./testConfig').profURLRegexp
const todoURLSchema = require('./testConfig').todoURLRegexp

module.exports.forMsgs = {

  testRespMsgBasics: (resp, expStatusCode) =>{
    expect(resp).to.have.status(expStatusCode)
    expect(resp).to.be.json
  },
  testRespMsgCookie: (resp, expLabel, expContent)=>{
    expect(resp).to.have.cookie(expLabel, expContent)
  },
  testRespMsgNoCookie: (resp, expLabel)=>{
    if(resp.header['set-cookie']){
      expect(resp).to.have.cookie(expLabel, '')
    }
  },
  extinctRespCookieExpireDate: (resp, expLabel)=>{
    const cookies = resp.header['set-cookie']
    let cookiedate = null
    cookies.forEach(item=>{
      if(item.includes(expLabel)){
        const content = item.split(';')
        const dateString = content[2].substring(9)
        cookiedate = new Date(dateString)
      }
    })
    return cookiedate
  },
  testRespMsgHeaders: (resp)=>{
    expect(resp).to.have.headers
    
    testingHeaderArray.forEach((head)=>{
      expect(resp).to.have.header(head[0], head[1])
    })
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
  reviseListOfProfiles: (report, expLength)=>{
    expect(report).to.be.a('array')
    expect(report).to.have.lengthOf(expLength)
    if(report.length > 0){
      const urlExam = new RegExp(profURLSchema.loginProf)

      report.forEach(item=>{
        expect(item).to.have.property('username')
        expect(item.username).to.be.a('string')
        expect(item).to.have.property('loginUrl')
        expect(item.loginUrl).to.be.a('string')
        expect( urlExam.test(item.loginUrl) ).to.be.true
      })
    }
  },
  reviseProfDetailedContent: (report)=>{
    expect(report).to.have.own.property('username')
    expect(report.username).to.be.a('string')
    expect(report.username).to.not.equal('')
    expect(report).to.have.own.property('first_name')
    expect(report.first_name).to.be.a('string')
    expect(report.first_name).to.not.equal('')
    expect(report).to.have.own.property('last_name')
    expect(report).to.have.own.property('age')
    expect(report).to.have.own.property('occupation')
    expect(report).to.have.own.property('todos')
    expect(report.todos).to.be.a('array')

    expect(report).to.have.own.property('changPwdDelAccUrl')
    expect(report.changPwdDelAccUrl).to.be.a('string')
    const urlExam1 = new RegExp(profURLSchema.changePwdRemoveProf)
    expect( urlExam1.test(report.changPwdDelAccUrl) ).to.be.true
    
    expect(report).to.have.own.property('logoutUrl')
    expect(report.logoutUrl).to.be.a('string')
    const urlExam2 = new RegExp(profURLSchema.logoutProf)
    expect( urlExam2.test(report.logoutUrl) ).to.be.true
  },
    
  reviseTodoContent: (report)=>{
    expect(report).to.have.own.property('task')
    expect(report.task).to.be.a('string')
    expect(report.task).to.not.equal('')
    expect(report).to.have.own.property('start')
    expect(report).to.have.own.property('update')

    expect(report).to.have.own.property('status')
    expect(report.status).to.be.a('string')
    expect(report).to.have.own.property('notation')

    expect(report).to.have.own.property('notationChangeUrl')
    expect(report.notationChangeUrl).to.be.a('string')
    const urlExam1 = new RegExp(todoURLSchema.changeNote)
    expect(urlExam1.test(report.notationChangeUrl) ).to.be.true

    expect(report).to.have.own.property('statusChangeUrl')
    expect(report.statusChangeUrl).to.be.a('string')
    const urlExam2 = new RegExp(todoURLSchema.changeStatus)
    expect( urlExam2.test(report.statusChangeUrl) ).to.be.true

    expect(report).to.have.own.property('removingUrl')
    expect(report.removingUrl).to.be.a('string')
    const urlExam3 = new RegExp(todoURLSchema.remove)
    expect( urlExam3.test(report.removingUrl) ).to.be.true
  },
  testThisTodoDating: (todoItem, expRelation)=>{
    const starting = new Date(todoItem.start)
    const updating = new Date(todoItem.update)
    if(expRelation === 'equal'){
      expect(starting).to.equal(updating)
    }else{
      expect(starging).to.be.below(updating)
    }
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
      'password': profObj.password,
      'password_repeat': profObj.password_repeat,
      'first_name': profObj.first_name,
      'last_name': profObj.last_name,
      'age': profObj.age,
      'occupation': profObj.occupation
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
  },
  extinctLogindDatas: (seekedUname, datapool)=>{
    const { username, password } = datapool.filter(item =>{
        return item.username === seekedUname 
      })[0]
    return [ username, password ]
  },
  extinctPwd: (seekedUname, datapool)=>{
    const { password } = datapool.filter(item =>{
      return item.username === seekedUname
    })[0];
    return password
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