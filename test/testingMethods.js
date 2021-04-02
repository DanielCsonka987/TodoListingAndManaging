const expect = require('chai').expect;
const profileUrlPosPattern = require('./testConfig').profileUrlPosPattern
const todoUrlPosPattern = require('./testConfig').todoUrlPosPattern

module.exports.forMsgs = {
    reviseMessageContent: (res, expRes)=>{
        expect(res).to.be.a('object')
        expect(res).to.have.own.property('status')
        expect(res.status).to.equal(expRes)
        expect(res).to.have.own.property('report')
      },
      
      reviseProfileContent: (report)=>{
        expect(report).to.have.own.property('username')
        expect(report).to.have.own.property('first_name')
        expect(report).to.have.own.property('last_name')
        expect(report).to.have.own.property('age')
        expect(report).to.have.own.property('occupation')
        expect(report).to.have.own.property('todos')
      },
      
      reviseTodoContent: (report)=>{
        expect(report).to.have.own.property('task')
        expect(report).to.have.own.property('start')
        expect(report).to.have.own.property('update')
        expect(report).to.have.own.property('notation')
        expect(report).to.have.own.property('priority')
      },
      
      
    }
    
module.exports.forUrls = {
    extinctProfIdFromUrl: (url) =>{
      return url.split('/')[profileUrlPosPattern]
    },
    
    extinctTodoIdFromUrl: (url)=>{
      return url.split('/')[todoUrlPosPattern]
    }

}