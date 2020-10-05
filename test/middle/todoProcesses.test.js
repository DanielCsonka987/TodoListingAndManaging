let todoProcess = require('../../middleware/todoProcesses.js');
let assert = require('chai').assert;
let expect = require('chai').expect;

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

  setTimeout(()=>{ done(); }, 800);
});

after((done)=>{
  mongoose.connection.close();
  done();
});

describe('Todo middleware processes test', ()=>{

  it('Revise the content of all component', (done)=>{
    done();
  })



});
