const assert = require('chai').assert;
const expect = require('chai').expect;
const mongoose = require('mongoose');

const dbaccess = require('../../config/appConfig.js').db_access;
const TodoSchema = require('../../model/todoItem.js');
const ProfileSchema = require('../../model/profileItem.js');
const todoProcesses = require('../../model/todoProcesses.js');

let ownerProfile = require('./profileTestDatas.js').newProfiles[0];
let todoTestDatas = require('./todoTestDatas.js').todos;
let newRawTodos = require('./todoTestDatas.js').newTodos;

before( ()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, { useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
      .once('open', ()=>{ console.log('MongoDB connection establisehd')})
      .once('close', ()=>{ console.log('MongoDB closed properly')})
      .on('error', (err)=>{ console.log('MongoDB error ' + err)});
  // console.log(mongoose.connection);
    mongoose.connection.collections.todos.drop(()=>{
      ProfileSchema.create(ownerProfile, (err, doc)=>{
        expect(err).to.be.a('null');
        ownerProfile = doc;
        todoTestDatas.forEach((item, i) => {
          let sch = new TodoSchema(item);
          sch.owner = ownerProfile._id;
          sch.save();
        });
        resolve();
      })
    })
  })
})

after(()=>{
  return new Promise((resolve, reject)=>{
    ProfileSchema.deleteOne({_id: ownerProfile._id}, (rep)=>{
      mongoose.connection.close();
      resolve();
    });
  })
});

describe('Todo middleware processes test - positive set', ()=>{

  it('Revise the content of all component', ()=>{
    return todoProcesses
      .loadInProfileTodos(ownerProfile._id)
      .then((readInfo)=>{
        expect(readInfo).to.be.a('object');
        expect(readInfo.report).to.be.a('array');
        expect(readInfo.report.length).to.equal(3);
        expect(readInfo.report[0]).to.have.property('id');
        expect(readInfo.report[1]).to.have.property('priority');
        expect(readInfo.report[1].priority).to.be.within(2, 10);
        expect(readInfo.message).to.be.a('string');
        expect(readInfo.message).to.equal('Reading done!');
      })
  })

  it('Revise creation todo item', ()=>{
    return todoProcesses
      .createTodo(ownerProfile._id, newRawTodos[0])
      .then((creationInfo)=>{
        expect(creationInfo).to.be.a('object');
        expect(creationInfo.report).to.be.a('object');
        expect(creationInfo.report.id).to.be.a('object');
        expect(creationInfo.report.task).to.equal(newRawTodos[0].task);
        expect(creationInfo.message).to.be.a('string');
        expect(creationInfo.message).to.equal('Creation done!');

        newRawTodos[0] = creationInfo.report;
      })
      .then(()=>{
        return todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((readInfo)=>{
          expect(readInfo).to.be.a('object');
          expect(readInfo.report).to.not.be.empty;
          let createdOne = readInfo.report.filter(item => item.id.equals(newRawTodos[0].id));
          expect(createdOne).to.not.be.empty;
          expect(createdOne.length).to.equal(1);
        })
      })
      .then(()=>{
        todoProcesses.createTodo(ownerProfile._id, newRawTodos[1])
        .then(nextCreateRes=>{
          expect(nextCreateRes).to.be.a('object');
          newRawTodos[1] = nextCreateRes.report;
        })
      })
  })

  it('Revise update status', ()=>{
    return todoProcesses
      .updateStateTodo(newRawTodos[0].id, 'true')
      .then((updateInfo)=>{
        expect(updateInfo.report).to.be.a('object');
        expect(updateInfo.message).to.be.a('string');
        expect(updateInfo.message).to.equal('Updating done!');
        return updateInfo.report.todo;
      })
      .then((updatedTodoId)=>{
        todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((readInfo)=>{
          expect(readInfo).to.be.a('object');
          expect(readInfo.report).to.not.be.empty;
          let updateResult = readInfo.report.filter(item=> item.id.equals(updatedTodoId));
          expect(updateResult).to.not.be.empty;
          expect(updateResult.length).to.equal(1);
          expect(updateResult[0].status).to.equal('Finished');
          // expect(updateResult[0].startingDate).to.be.above(updateResult[0].lastModfingDate);
        })
      })
  })

  it('Revise update notation', ()=>{
    return todoProcesses
      .updateNotationTodo(newRawTodos[0].id, 'No one else would do this')
      .then((updateInfo)=>{
        expect(updateInfo).to.be.a('object');
        expect(updateInfo.report).to.be.a('object');
        expect(updateInfo.message).to.be.a('string');
        expect(updateInfo.message).to.equal('Updating done!');
        return updateInfo.report.todo;
      })
      .then((updatedTodoId)=>{
        todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((readInfo)=>{
          let updateResult = readInfo.report.filter(item => item.id.equals(updatedTodoId) );
          expect(updateResult).to.be.a('array');
          expect(updateResult).to.not.be.empty;
          expect(updateResult.length).to.equal(1);
          expect(updateResult[0].notation).to.equal('No one else would do this');
          // expect(updateResult[0].startingDate).to.be.above(updateResult[0].lastModfingDate);
        })
      })
  })

  it('Revise deletion single todo item', ()=>{
    return todoProcesses
      .deleteThisTodo(ownerProfile._id, newRawTodos[0].id)
      .then((deletionInfo)=>{
        expect(deletionInfo).to.be.a('object');
        expect(deletionInfo.report).to.be.a('object');
        expect(deletionInfo.message).to.be.a('string');
        expect(deletionInfo.message).to.equal('Deletion done!');
        return deletionInfo.report.todo;
      })
      .then((deletedTodoId)=>{
        return todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((readInfo) =>{
          expect(readInfo).to.be.a('object');
          expect(readInfo.report).to.be.a('array');
          let supposedToDelete = readInfo.report.filter(item =>  item.id.equals(deletedTodoId) );
          expect(supposedToDelete).to.be.empty;
        })
      })
  })

  it('Revise deletion all todo items', ()=>{
    return todoProcesses
      .deleteAllTodos(ownerProfile._id)
      .then((deletionInfo)=>{
        expect(deletionInfo).to.be.a('object');
        expect(deletionInfo.report).to.be.a('object');
        expect(deletionInfo.report.profile).to.be.a('object');
        expect(deletionInfo.report.deletedTodo).to.be.a('number');
        expect(deletionInfo.report.deletedTodo).to.above(0);
      })
      .then(()=>{
        return todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((readInfo)=>{
          expect(readInfo).to.be.a('object');
          expect(readInfo.report).to.be.a('array');
          expect(readInfo.report).to.be.empty;
        })
      })
  })

})

describe('Todo middleware processes - negative set', ()=>{

  it('Readin docs without profile id', (done)=>{
    todoProcesses.loadInProfileTodos()
    .then(readInfo=>{
      expect(readInfo).to.be.a('object');
      expect(readInfo.message).to.be.a('string');
      expect(readInfo.message).to.equal('No content to show!');
      expect(readInfo.report).to.be.a('array');
      expect(readInfo.report).to.be.empty;
    })
    done();
  })

  it('Readin docs without proper profile id', (done)=>{
    //must be a single String of 12 bytes or a string of 24 hex characters
    todoProcesses.loadInProfileTodos('123456789012')
    .then(readInfo=>{
      expect(readInfo).to.be.a('object');
      expect(readInfo.report).to.be.a('array');
      expect(readInfo.report).to.be.empty;
      expect(readInfo.message).to.be.a('string');
      expect(readInfo.message).to.equal('No content to show!');
    })
    done();
  })

  it('Updte state without an identifier',(done)=>{
    todoProcesses.updateStateTodo('123456789012', 'true')
    .then(updateInfo=>{
      expect(updateInfo).to.be.a('null');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('String');
      expect(err.report).to.equal('No target to update');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.todo).to.be.a('string');
      expect(err.involvedId.todo).to.equal('123456789012');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Updating unsuccessful!');
    });
    done();
  })

  it('Update notation without a existing profile identifier', (done)=>{
    todoProcesses.updateNotationTodo('123456789012', 'No reason to persist')
    .then(updateInfo=>{
      expect(updateInfo).to.be.a('null');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('No target to update');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.todo).to.be.a('string');
      expect(err.involvedId.todo).to.equal('123456789012');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Updating unsuccessful!');

    });
    done();
  })

  it('Single deletion without an identifier', (done)=>{
    todoProcesses.deleteThisTodo('123456789012', '123456789012')
    .then(deletionInfo=>{
      expect(deletionInfo).to.be.a('null');
    })
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('No target to delete!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.profile).to.not.be.a('null');
      expect(err.involvedId.profile).to.equal('123456789012');
      expect(err.involvedId.todo).to.not.be.a('null');
      expect(err.involvedId.todo).to.equal('123456789012');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Deletion unsuccessful!');
    });
    done();
  })

  it('All deletion without an identifier', (done)=>{
    todoProcesses.deleteAllTodos('123456789012')
    .then(deletionInfo=>{})
    .catch(err=>{
      expect(err).to.be.a('object');
      expect(err.report).to.be.a('string');
      expect(err.report).to.equal('No target to delete!');
      expect(err.involvedId).to.be.a('object');
      expect(err.involvedId.profile).to.be.a('string');
      expect(err.involvedId.profile).to.equal('123456789012');
      expect(err.involvedId.deletedTodo).to.be.a('number');
      expect(err.involvedId.deletedTodo).to.equal('0');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Deletion unsuccessful!');

    });
    done();
  })

})
