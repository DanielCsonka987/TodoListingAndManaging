const mongoose = require('mongoose');
const assert = require('chai').assert;
const expect = require('chai').expect;

const dbaccess = require('../../config/appConfig.js').db_access;
const TodoSchema = require('../../model/todoItem.js');
const ProfileSchema = require('../../model/profileItem.js');

let todoTestDatas = require('./todoTestDatas').todos;
let newTodoItem = require('./todoTestDatas').newTodos[0];

before(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
      .once('open', ()=> console.log('MongoDB test connection established'))
      .once('close', ()=> console.log('MongoDB test connection closed'))
      .on('error', (error)=> console.log('MongoDB error ', error));
      // console.log(mongoose.connection);

      mongoose.connection.collections.todos.drop(err=>{
        if(err) console.log('MongoDB todo collection is not empty!');
        TodoSchema.insertMany(todoTestDatas, (err)=>{
          if(err) console.log('Failed insertion of test datas to MongoDB');
          resolve();
        })
      });
    }).catch(err=>{ console.log(err) })
});

after(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connection.close();
    resolve();
  }).catch(err=>{ console.log(err) })
});

describe('Model TodoItem CRUD operations', ()=>{
  describe('Read attempts', ()=>{
    it('Read in single Todo doc', ()=>{
      return TodoSchema.findOne({priority: 4}, (err, doc)=>{
        expect(err).to.be.a('null');
        expect(doc).to.not.be.a('null');
        assert.equal(doc.task, 'Do the loundry', 'Not proper doc content at read single');
      }).catch(err=>{ console.log(err) })
    });

    it('Read in all Todo docs', ()=>{
      return TodoSchema.find((err, docs)=>{
        expect(err).to.be.a('null');
        expect(docs).to.not.be.a('null');
        assert.equal(docs.length, 3, 'Not all docs has been found at read all1')
      }).catch(err=>{ console.log(err) })
    });

  });

  describe('Manipulate attempts', ()=>{
    it('Create new Todo',()=>{
      return new Promise((resolve, reject)=>{
        TodoSchema.create(newTodoItem, (err, doc)=>{
          expect(err).to.be.a('null');
          expect(doc).to.not.be.a('null');
          expect(doc._id).to.not.be.a('null');
          resolve();
        })
      }).catch(err=>{ console.log(err) })
    });
    it('Update existing Todo',()=>{
      return TodoSchema.updateOne({priority: 7}, {status: "Finished"}, (err, rep)=>{
        expect(err).to.be.a('null');
        expect(rep).to.be.not.a('null');
        assert.equal(rep.nModified, 1, 'Update process failed');
      }).catch(err=>{ console.log(err) })
    });
    it('Delete existing Todo',()=>{
      return TodoSchema.deleteOne({notation: 'JS Healthcare-revisor'}, (err, rep)=>{
        console.log(err);
        expect(err).to.be.a('null');
        expect(rep).to.not.be.a('null');
        assert.equal(rep.deletedCount, 1, 'Deletion process failed');
      }).catch(err=>{ console.log(err) })
    });
  });

});
