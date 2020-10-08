let todoProcesses = require('../../middleware/todoProcesses.js');
const assert = require('chai').assert;
const expect = require('chai').expect;

const dbaccess = require('../../config/appConfig.js').dbaccess;
let mongoose = require('mongoose');
let TodoSchema = require('../../model/todoItem.js');
let ProfileSchema = require('../../model/profileItem.js');

let ownerProfile = new ProfileSchema({
  first_name: 'Steve',
  last_name: 'Jobs',
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
  mongoose.connection.close();
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
        expect(creationInfo.message).to.equal('Creation done!');
      })
      .then((creationInfo)=>{
        expect(doc).to.not.be.a('null');
        todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((docs)=>{
          let properCreation = false;
          docs.forEach((item, i) => {
            if(item._id == creationInfo.report._id){
              properCreation = true;
            }
          });
          expect(properCreation).to.be.true;
        });
      })
      .catch(err=>{ console.log('Error happened ', err)  });

      done();
  })

  it('Revise update status', (done)=>{
    todoProcesses
      .updateStateTodo(todoTestDatas[1]._id, true)
      .then((updateInfo)=>{
        // console.log(updatedInfo);
        expect(updateInfo._id).to.not.be.a('null');
        expect(updateInfo.report).to.not.be.a('null');
        expect(updateInfo.message).to.not.be.a('null');
        expect(updateInfo.message).to.equal('Update done!');
      })
      .then((updateInfo)=>{
        todoProcesses.loadInProfileTodos(ownerProfile._id)
        .then((docs)=>{
          let properUpdate = false;
          docs.forEach((item, i) => {
            if(item._id === updateInfo._id){
              if(item.status === 'Finished'
              && item.lastModfingDate > item.startingDate)
                properUpdate == true;
            }
          });
          expect(properUpdate).to.be.true;
        });
      })
      .catch(err=>{ console.log('Error happened ', err)  });
      done();
    })

  // it('Revise update notation', (done)=>{
  //   todoProcesses
  //     .updateNotationTodo()
  //     .then()
  //     .then();
  // })
  //

  //
  // it('Revise deletion todo item', (done)=>{
  //   todoProcesses
  //     .deleteThisTodo()
  //     .then()
  //     .then();
  // })

});
