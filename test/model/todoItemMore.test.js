const mongoose = require('mongoose');
const expect = require('chai').expect;

const dbaccess = require('../testConfig').testDBConnection;
const ProfileModel = require('../../model/ProfileModel.js');

const profilesTodoTestDatas = require('../todoTestDatas').profilesWithTodos;
const newProfiles = require('../todoTestDatas').newProfilesWithoutTodos;
const bareTodos = require('../todoTestDatas').bareNewTodos

const reviseDBMainStructure = require('../testingMethods').forMsgs.reviseDBMessageBasics
const reviseProfileContent = require('../testingMethods').forMsgs.reviseProfDetailedContent
const reviseTodoContent = require('../testingMethods').forMsgs.reviseTodoContent

const extinctProfId = require('../testingMethods').forUrls.extinctProfIdFromUrl
const extinctTodoId = require('../testingMethods').forUrls.extinctTodoIdFromUrl

before(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
      .once('open', ()=> console.log('MongoDB test connection established'))
      .once('close', ()=> console.log('MongoDB test connection closed'))
      .on('error', (error)=> console.log('MongoDB error ', error));

      mongoose.connection.collections.profiles.drop(err=>{
        if(err){ 
          console.log('MongoDB todo collection is not empty!');
          console.log(err)
          reject();
        }
        ProfileModel.insertMany(profilesTodoTestDatas, (error)=>{
          if(error){ 
            console.log('Failed insertion of test datas to MongoDB');
            console.log(error)
            reject();
          }
          //setTimeout(()=>{
            resolve();
          //}, 400)
        })
      });
    }).catch((e)=>{
      mongoose.connection.close();
    })
});

after(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connection.close();
    resolve();
  })
});

describe('Integrated profile-todo tests', ()=>{

  it('Create a user, add some todo in a profile', (done)=>{
    ProfileModel.createNewProfile(newProfiles[0], (res)=>{
      expect(res).to.have.property('status')
      expect(res.status).to.equal('success')
      reviseProfileContent(res.report)
      expect(res.report.todos).to.be.empty

      newProfiles[0]._id = res.report.id.toString();
      ProfileModel.addNewTodo(newProfiles[0]._id, bareTodos[0], (result)=>{
        expect(result).to.have.property('status')
        expect(result.status).to.equal('success')

        expect(result.report).to.have.property('removingUrl')
        bareTodos[0].id = extinctTodoId(result.report.removingUrl)
        reviseTodoContent(result.report)
        expect(result.report.task).to.equal(bareTodos[0].task)
        bareTodos[0].update = result.report.update
        expect(result.report.priority).to.equal(bareTodos[0].priority)
        done();
      })
    })
  })
  

  it('Previous user logs in and update todo status', (done)=>{
    const targetProf = newProfiles[0]._id
    ProfileModel.findThisProfileToLogin(targetProf, (res)=>{
      reviseDBMainStructure(res, 'success')

      expect(res.report).to.have.property('logoutUrl')
      expect(extinctProfId(res.report.logoutUrl)).to.equal(targetProf.toString())

      expect(res.report.todos).to.be.a('array')
      expect(res.report.todos).to.have.lengthOf(1)
      expect(res.report.todos[0]).to.have.property('removingUrl')
      const targetTodo = extinctTodoId(res.report.todos[0].removingUrl)

      ProfileModel.modifyTodoStatus(targetProf, targetTodo, 'Finished', (result)=>{
        reviseDBMainStructure(result, 'success')
        
        expect(result.report).to.be.instanceOf(Date)
        expect(result.report).to.gt(bareTodos[0].update)
        done()
      })
    })
  })

  it('Update todo notation, adding another one', (done)=>{
    const targetProf = newProfiles[0]._id
    const targetTodo = bareTodos[0].id
    ProfileModel.modifyTodoNotation(targetProf, targetTodo, 'I dont know, stg', res=>{
      reviseDBMainStructure(res, 'success')
      expect(res.report).to.be.instanceOf(Date)
      expect(res.report).to.gt(bareTodos[0].update)

      ProfileModel.addNewTodo(newProfiles[0]._id, bareTodos[1], (result)=>{
        reviseDBMainStructure(result, 'success')
        
        reviseTodoContent(result.report)
        expect(result.report).to.have.own.property('removingUrl')
        bareTodos[1].id = extinctTodoId(result.report.removingUrl);
  
        expect(result.report.task).to.equal(bareTodos[1].task)
        bareTodos[1].update = result.report.update
        expect(result.report.priority).to.equal(bareTodos[1].priority)
        done();
      })
    })
  })

  it('Delete first todo, check second\'s existence', (done)=>{
    const targetProf = newProfiles[0]._id
    const targetTodo = bareTodos[0].id
    const remainingTodo = bareTodos[1].id
    ProfileModel.removeThisTodo(targetProf, targetTodo, res=>{
      reviseDBMainStructure(res, 'success')
      expect(res.report).to.equal('')

      setTimeout(()=>{
        ProfileModel.findThisProfileToLogin(targetProf, result=>{
          reviseDBMainStructure(result, 'success')
          expect(result.report).to.have.own.property('changePwdDelAccUrl')

          expect(extinctProfId(result.report.changePwdDelAccUrl)).to.equal(targetProf)
          expect(result.report).to.have.own.property('todos')
          expect(result.report.todos).to.be.a('array')
          expect(result.report.todos).to.have.lengthOf(1)
  
          const remaingTodo = result.report.todos[0]
          expect(remaingTodo).to.have.property('statusChangeUrl')

          expect(extinctTodoId(remaingTodo.statusChangeUrl)).to.equal(remainingTodo)
          done()
        })
      }, 200)
    })
  })
})