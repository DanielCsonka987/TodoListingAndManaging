const assert = require('chai').assert;
const expect = require('chai').expect;
const mongoose = require('mongoose');

const dbaccess = require('../../config/appConfig.js').dbaccess;
const TodoSchema = require('../../model/todoItem.js');
const ProfileSchema = require('../../model/profileItem.js');
const todoProcesses = require('../../model/todoProcesses.js');

let ownerProfile = new ProfileSchema({
  first_name: 'Steve',
  last_name: 'Jobs',
  username: 'apple',
  password: 'donotforget',
  age: 56,
  occupation: 'bussinessman'
});
let todoTestDatas = [
  new TodoSchema({
    task: 'Do the loundry',
    priority: 4
  }),
  new TodoSchema({
    task: 'Make javascript project model layer',
    priority: 7,
    notation: 'The deadhline is this weekend!',
  }),
  new TodoSchema({
    task: 'Call the partner company - what are the other requirements of software',
    priority: 3,
    notation: 'IdealReality ltd. - Healthcare-revisor project',
  })
];
let newRawTodos = [
  {
    task: 'Finish the testing of model layer',
    priority: 5,
    notation: 'JS Healthcare-revisor',
    status: 'Proceeding'
  },
  {
    task: 'Refactor new components',
    priority: 1
  }
]

before( (done)=>{
  mongoose.connect(dbaccess, { useNewUrlParser: true, useUnifiedTopology: true});
  mongoose.connection
    .once('open', ()=>{ console.log('MongoDB connection establisehd')})
    .once('close', ()=>{ console.log('MongoDB closed properly')})
    .on('error', (err)=>{ console.log('MongoDB error ' + err)});
  // console.log(mongoose.connection);
  mongoose.connection.collections.todos.drop(()=>{
    ownerProfile.save(()=>{
      todoTestDatas.forEach((item, i) => {
        item.owner = ownerProfile._id;
        let sch = new TodoSchema(item);
        sch.save();
      });
    });
  });

  setTimeout(()=>{ done(); }, 1000);
});

after((done)=>{

  ProfileSchema.deleteOne({_id: ownerProfile._id}, (rep)=>{
    mongoose.connection.close();

  });
  done();
});


describe('Todo middleware processes test - positive set', ()=>{

  it('Revise the content of all component', (done)=>{
    todoProcesses
      .loadInProfileTodos(ownerProfile._id)
      .then((readInfo)=>{
        expect(readInfo).to.not.be.a('null');
        expect(readInfo.report).to.not.be.a('null');
        expect(readInfo.report.length).to.equal(3);
        expect(readInfo.report[0]).to.have.property('_id');
        expect(readInfo.report[1]).to.have.property('priority');
        expect(readInfo.report[1].priority).to.be.within(2, 10);
        expect(readInfo.message).to.be.a('string');
        expect(readInfo.message).to.equal('Reading done!');
      })
      .catch(err=>{ console.log('Error happened ', err)  });
      done();
  })

  it('Revise creation todo item', (done)=>{
    todoProcesses
      .createTodo(ownerProfile._id, newRawTodos[0])
      .then((creationInfo)=>{
        expect(creationInfo).to.not.be.a('null');
        expect(creationInfo.report).to.not.be.a('null');
        expect(creationInfo.report._id).to.not.be.a('null');
        expect(creationInfo.report.task).to.equal(newRawTodos[0].task);
        expect(creationInfo.message).to.be.a('string');
        expect(creationInfo.message).to.equal('Creation done!');

        newRawTodos[0] = creationInfo.report;
      })
      .then(()=>{
        todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((readInfo)=>{
          expect(readInfo).to.not.be.a('null');
          expect(readInfo.report).to.not.be.empty;
          let createdOne = readInfo.report
            .filter(item => item._id.equals(newRawTodos[0]._id));
          expect(createdOne).to.not.be.empty;
          expect(createdOne.length).to.equal(1);
        })
        .catch(err=>{ console.log('Readback problem ', err)});
      })
      .catch(err=>{ console.log('Error happened ', err)  });

      setTimeout(()=>{ done(); }, 50);
  })

  it('Revise update status', (done)=>{
    todoProcesses
      .updateStateTodo(todoTestDatas[1]._id, true)
      .then((updateInfo)=>{
        // console.log(updatedInfo);
        expect(updateInfo.report).to.not.be.a('null');
        expect(updateInfo.message).to.be.a('string');
        expect(updateInfo.message).to.equal('Updating done!');
        return updateInfo.report;
      })
      .then((updatedTodoId)=>{
        todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((readInfo)=>{
          expect(readInfo).to.not.be.a('null');
          expect(readInfo.report).to.not.be.empty;
          let updateResult = readInfo.report
            .filter(item=> item._id.equals(updatedTodoId));
          expect(updateResult).to.not.be.empty;
          expect(updateResult.length).to.equal(1);
          expect(updateResult[0].status).to.equal('Finished');
          // expect(updateResult[0].startingDate).to.be.above(updateResult[0].lastModfingDate);
        });
      })
      .catch(err=>{ console.log('Error happened ', err)  });
      setTimeout(()=>{ done(); }, 50);

  })

  it('Revise update notation', (done)=>{
    todoProcesses
      .updateNotationTodo(todoTestDatas[0]._id, 'No one else would do this')
      .then((updateInfo)=>{
        expect(updateInfo).to.not.be.a('null');
        expect(updateInfo.report).to.not.be.a('null');
        expect(updateInfo.message).to.be.a('string');
        expect(updateInfo.message).to.equal('Updating done!');
        return updateInfo.report;
      })
      .then((updatedTodoId)=>{
        todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((readInfo)=>{
          let updateResult = readInfo.report
            .filter(item => item._id.equals(updatedTodoId) );
          expect(updateResult).to.be.a('array');
          expect(updateResult).to.not.be.empty;
          expect(updateResult.length).to.equal(1);
          expect(updateResult[0].notation).to.equal('No one else would do this');
          // expect(updateResult[0].startingDate).to.be.above(updateResult[0].lastModfingDate);
        });
      })
      .catch(err=>{ console.log('Error happened ', err)  });
      setTimeout(()=>{ done(); }, 50);

  })

  it('Revise deletion single todo item', (done)=>{
    todoProcesses
      .deleteThisTodo(ownerProfile._id, newRawTodos[0]._id)
      .then((deletionInfo)=>{
        expect(deletionInfo).to.not.be.a('null');
        expect(deletionInfo.report).to.not.be.a('null');
        expect(deletionInfo.message).to.be.a('string');
        expect(deletionInfo.message).to.equal('Deletion done!');
        return deletionInfo.report;
      })
      .then((deletedTodoId)=>{
        todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((readInfo) =>{
          expect(readInfo).to.not.be.a('null');
          expect(readInfo.report).to.not.be.a('null');
          let supposedToDelete = readInfo.report
            .filter(item =>  item._id.equals(deletedTodoId) );
          expect(supposedToDelete).to.be.empty;
        })
        .catch(err=>{ console.log('Readback problem ', err)} );
      })
      .catch( err=>{ console.log('Error happened ', err); });
      done();
  })
  //
  it('Revise deletion all todo items', (done)=>{
    todoProcesses
      .deleteAllTodos(ownerProfile._id)
      .then((deletionInfo)=>{
        expect(deletionInfo).to.not.be.a('null');
        expect(deletionInfo.report).to.not.be.a('null');
        expect(deletionInfo.report.profile).to.not.be.a('null');
        expect(deletionInfo.report.deleted).to.not.be.a('null');
        expect(deletionInfo.report.deleted).to.above(0);
      })
      .then(()=>{
        todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((readInfo)=>{
          expect(readInfo).to.not.be.a('null');
          expect(readInfo.report).to.not.be.a('null');
          expect(readInfo.report).to.be.empty;
        })
        .catch(err=>{throw new Error('Readback problem ', err)});
      })
      .catch(err=>{ console.log('Error happened ', err) });
      done();
  })

});


describe('Todo middleware processes - negative set', ()=>{

  it('Readin docs without profile id', (done)=>{
    todoProcesses.loadInProfileTodos()
    .then(readInfo=>{
      expect(readInfo).to.not.be.a('null');
      expect(readInfo.message).to.not.be.a('null');
      expect(readInfo.message).to.equal('No content to show!');
      expect(readInfo.report).to.be.a('array');
      expect(readInfo.report).to.be.empty;
    })
    .catch(err=>{ console.log('Reading error ',err)});
    done();
  })

  it('Readin docs without proper profile id', (done)=>{
    //must be a single String of 12 bytes or a string of 24 hex characters
    todoProcesses.loadInProfileTodos('123456789012')
    .then(readInfo=>{
      expect(readInfo).to.not.be.a('null');
      expect(readInfo.report).to.be.a('array');
      expect(readInfo.report).to.be.empty;
      expect(readInfo.message).to.be.a('string');
      expect(readInfo.message).to.equal('No content to show!');
    })
    .catch(err=>{ console.log('Read error: ', err); });
    done();
  })

  it('Updte state without an identifier',(done)=>{
    todoProcesses.updateStateTodo('123456789012', true)
    .then(updateInfo=>{
      expect(updateInfo).to.be.a('null');
    })
    .catch(err=>{
      expect(err).to.not.be.a('null');
      expect(err.report).to.not.be.a('null');
      expect(err.report.explanation).to.be.a('String');
      expect(err.report.explanation).to.equal('No target to update');
      expect(err.involvedId).to.not.be.a('null');
      expect(err.involvedId).to.equal('123456789012');
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
      expect(err).to.not.be.a('null');
      expect(err.report).to.not.be.a('null');
      expect(err.report.explanation).to.be.a('string');
      expect(err.report.explanation).to.equal('No target to update');
      expect(err.involvedId).to.not.be.a('null');
      expect(err.involvedId).to.equal('123456789012');
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
      expect(err).to.not.be.a('null');
      expect(err.report).to.be.a('object');
      expect(err.report.explanation).to.be.a('string');
      expect(err.report.explanation).to.equal('No target to delete!');
      expect(err.involvedId).to.not.be.a('null');
      expect(err.involvedId.profile).to.not.be.a('null');
      expect(err.involvedId.profile).to.equal('123456789012');
      expect(err.involvedId.todo).to.not.be.a('null');
      expect(err.involvedId.todo).to.equal('123456789012');
      expect(err.message).to.be.a('string');
      expect(err.message).to.equal('Deletion unsucessful!');
    });
    done();
  })

  it('All deletion without an identifier', (done)=>{
    todoProcesses.deleteAllTodos('123456789012')
    .then(deletionInfo=>{})
    .catch(err=>{
      expect(err).to.not.be.a('null');
      expect(err.report).to.be.a('object');
      expect(err.report.explanation).to.be.a('string');
      expect(err.report.explanation).to.equal('No target to delete!');
      expect(err.involvedId).to.not.be.a('null');
      expect(err.involvedId).to.equal('123456789012');
      expect(err.message).to.not.be.a('null');
      expect(err.message).to.equal('Deletion unsuccessful!');

    });
    done();
  })

})
