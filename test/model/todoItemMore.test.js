const mongoose = require('mongoose');
const expect = require('chai').expect;

const dbaccess = require('../../config/appConfig.js').db_access_local;
const ProfileModel = require('../../model/ProfileItem.js');
const TodoSchema = require('../../model/TodoSchema')

const profilesTodoTestDatas = require('./todoTestDatas').profilesWithTodos;
const newProfiles = require('./todoTestDatas').newProfilesWithoutTodos;
const bareTodos = require('./todoTestDatas').bareNewTodos

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
      expect(res).to.be.a('object')
      expect(res).to.have.own.property('status')
      expect(res.status).to.equal('success')

      expect(res).to.have.own.property('report')
      expect(res.report).to.be.a('object')
      expect(res.report).to.have.own.property('id')
      expect(res.report.id).to.be.a('object')
      newProfiles[0]._id = res.report.id

      expect(res.report).to.have.own.property('username')
      expect(res.report).to.have.own.property('first_name')
      expect(res.report).to.have.own.property('last_name')
      expect(res.report).to.have.own.property('age')
      expect(res.report).to.have.own.property('occupation')
      expect(res.report).to.have.own.property('todos')
      expect(res.report.todos).to.be.a('array')
      expect(res.report.todos).to.be.empty


      ProfileModel.addNewTodo(newProfiles[0]._id, bareTodos[0], (result)=>{
        expect(result).to.be.a('object')
        expect(result).to.have.own.property('status')
        expect(result.status).to.be.a('string')
        expect(result.status).to.equal('success')

        expect(result.report).to.be.a('object')
        expect(result.report).to.have.own.property('id')
        bareTodos[0].id = result.report.id;

        expect(result.report).to.have.own.property('task')
        expect(result.report.task).to.equal(bareTodos[0].task)
        expect(result.report).to.have.own.property('start')
        expect(result.report).to.have.own.property('update')
        bareTodos[0].update = result.report.update
        expect(result.report).to.have.own.property('notation')
        expect(result.report).to.have.own.property('priority')
        expect(result.report.priority).to.equal(bareTodos[0].priority)
        done();
      })
    })
  })
  

  it('Previous user logs in and update todo status', (done)=>{
    const targetProf = newProfiles[0]._id
    ProfileModel.findThisProfileToLogin(targetProf, (res)=>{
      expect(res).to.be.a('object')
      expect(res).to.have.own.property('status')
      expect(res.status).to.equal('success')
      
      expect(res).to.have.own.property('report')
      expect(res.report).to.have.own.property('id')
      expect(res.report.id).to.deep.equal(targetProf)
      expect(res.report).to.have.own.property('todos')
      expect(res.report.todos).to.be.a('array')
      expect(res.report.todos).to.have.lengthOf(1)
      
      const targetTodo = res.report.todos[0].id
      ProfileModel.modifyTodoStatus(targetProf, targetTodo, 'Finished', (result)=>{
        expect(result).to.be.a('object')
        expect(result).to.have.own.property('status')
        expect(result.status).to.equal('success')
        
        expect(result).to.have.own.property('report')
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
      expect(res).to.be.a('object')
      expect(res).to.have.own.property('status')
      expect(res.status).to.equal('success')
      
      expect(res).to.have.own.property('report')
      expect(res.report).to.be.instanceOf(Date)
      expect(res.report).to.gt(bareTodos[0].update)

      ProfileModel.addNewTodo(newProfiles[0]._id, bareTodos[1], (result)=>{
        expect(result).to.be.a('object')
        expect(result).to.have.own.property('status')
        expect(result.status).to.be.a('string')
        expect(result.status).to.equal('success')
  
        expect(result.report).to.be.a('object')
        expect(result.report).to.have.own.property('id')
        bareTodos[1].id = result.report.id;
  
        expect(result.report).to.have.own.property('task')
        expect(result.report.task).to.equal(bareTodos[1].task)
        expect(result.report).to.have.own.property('start')
        expect(result.report).to.have.own.property('update')
        bareTodos[1].update = result.report.update
        expect(result.report).to.have.own.property('notation')
        expect(result.report).to.have.own.property('priority')
        expect(result.report.priority).to.equal(bareTodos[1].priority)
        done();
      })
    })
  })

  it('Delete first todo, check second\'s existence', (done)=>{
    const targetProf = newProfiles[0]._id
    const targetTodo = bareTodos[0].id
    ProfileModel.removeThisTodo(targetProf, targetTodo, res=>{
      expect(res).to.be.a('object')
      expect(res).to.have.own.property('status')
      expect(res.status).to.equal('success')

      expect(res).to.have.own.property('report')
      expect(res.report).to.equal('')

      setTimeout(()=>{
        ProfileModel.findThisProfileToLogin(targetProf, result=>{
          expect(result).to.be.a('object')
          expect(result).to.have.own.property('status')
          expect(result.status).to.equal('success')
          
          expect(result).to.have.own.property('report')
          expect(result.report).to.have.own.property('id')
          expect(result.report.id).to.deep.equal(targetProf)
          expect(result.report).to.have.own.property('todos')
          expect(result.report.todos).to.be.a('array')
          expect(result.report.todos).to.have.lengthOf(1)
  
          const remaingTodo = result.report.todos[0]
          expect(remaingTodo.id).to.deep.equal(bareTodos[1].id)
          done()
        })
      }, 200)
    })
  })
})