const mongoose = require('mongoose');
const expect = require('chai').expect;

const dbaccess = require('../../config/appConfig.js').db_access_local;
const ProfileModel = require('../../model/ProfileItem.js');
const TodoSchema = require('../../model/TodoSchema')

const profilesTodoTestDatas = require('./todoTestDatas').profilesWithTodos;
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

describe('Model TodoItem CRUD operations', ()=>{
  describe('Read attempts', ()=>{

    it('Read the todos with profile that has some', (done)=>{
      const seekedUName = profilesTodoTestDatas[0].username
      ProfileModel.findOne({username: seekedUName}, (err, doc)=>{
        expect(err).to.be.a('null')
        expect(doc).to.be.a('object')
        
        const seekedProfId = doc._id
        profilesTodoTestDatas[0]._id = doc._id;

        expect(seekedProfId).to.be.a('object')
        const firstTodoId = doc.forTestShowFirstTodo._id
        expect(firstTodoId).to.be.a('object')
        const privProfDatas = doc.privateDatas;
        expect(privProfDatas).to.be.a('object')
        expect(privProfDatas).to.have.own.property('id')
        expect(privProfDatas.id).to.deep.equal(seekedProfId)

        expect(privProfDatas).to.have.own.property('todos')
        expect(privProfDatas.todos).to.be.a('array')
        expect(privProfDatas.todos).to.not.be.empty
        expect(privProfDatas.todos).to.have.lengthOf(3)
        expect(privProfDatas.todos[0].id).to.deep.equal(firstTodoId)
        done();
      })
    })

    it('Read the todo with profile that has none', (done)=>{
      const seekedUName = profilesTodoTestDatas[1].username
      ProfileModel.findOne({username: seekedUName}, (err, doc)=>{
        expect(err).to.be.a('null')
        expect(doc).to.be.a('object')

        const seekedProfId = doc._id
        profilesTodoTestDatas[1]._id = doc._id

        expect(seekedProfId).to.be.a('object')
        const privProfDatas = doc.privateDatas;
        expect(privProfDatas).to.be.a('object')
        expect(privProfDatas).to.have.own.property('id')
        expect(privProfDatas.id).to.deep.equal(seekedProfId)

        expect(privProfDatas).to.have.own.property('todos')
        expect(privProfDatas.todos).to.be.a('array')
        expect(privProfDatas.todos).to.be.empty
        done();
      })
    })

    it('Read a todo from a strinct profile - findThisRawTodo method', (done)=>{

      const seekedUName = profilesTodoTestDatas[2].username
      ProfileModel.findOne({username: seekedUName}, (err, doc)=>{
        expect(err).to.be.a('null')
        expect(doc).to.be.a('object')

        const seekedProfId = doc._id
        profilesTodoTestDatas[2]._id = doc._id

        expect(seekedProfId).to.be.a('object')
        const privProfDatas = doc.privateDatas;
        expect(privProfDatas).to.be.a('object')
        expect(privProfDatas).to.have.own.property('id')

        expect(privProfDatas).to.have.own.property('todos')
        expect(privProfDatas.todos).to.be.a('array')
        expect(privProfDatas.todos).to.not.be.empty
        const seekedTodo = privProfDatas.todos[0];
        const searchRawRes = doc.findThisRawTodo(seekedTodo.id);

        expect(searchRawRes._id).to.deep.equal(seekedTodo.id)
        expect(searchRawRes.task).to.equal(seekedTodo.task)
        expect(searchRawRes.priority).to.deep.equal(seekedTodo.priority)
        done()
      })
    })
  });

  describe('Manipulate attempts', ()=>{
    it('Create new todo to a user, that already has some', (done)=>{
      const newTodo = bareTodos[0];
      ProfileModel.addNewTodo(profilesTodoTestDatas[2]._id, newTodo, (res)=>{
          expect(res).to.be.a('object')
          expect(res).to.have.own.property('status')
          expect(res.status).to.equal('success')
          expect(res).to.have.own.property('report')
          expect(res.report).to.be.a('object')
          expect(res.report).to.have.own.property('id')
          
          expect(res.report).to.have.own.property('task')
          expect(res.report.task).to.be.a('string')
          expect(res.report.task).to.equal(newTodo.task)
          expect(res.report).to.have.own.property('priority')
          expect(res.report.priority).to.equal(newTodo.priority)
          expect(res).to.have.own.property('message')
          done()
      })
      
    })

    it('Create new todo to a user, that has none', (done)=>{
      const newTodo = bareTodos[1];
      ProfileModel.addNewTodo(profilesTodoTestDatas[1]._id, newTodo, (res)=>{
          expect(res).to.be.a('object')
          expect(res).to.have.own.property('status')
          expect(res.status).to.equal('success')
          expect(res).to.have.own.property('report')
          expect(res.report).to.be.a('object')
          expect(res.report).to.have.own.property('id')
          
          expect(res.report).to.have.own.property('task')
          expect(res.report.task).to.be.a('string')
          expect(res.report.task).to.equal(newTodo.task)
          expect(res.report).to.have.own.property('priority')
          expect(res.report.priority).to.equal(newTodo.priority)
          expect(res).to.have.own.property('message')
          done()
      })
    })

    it('Update todo notation', (done)=>{
      const text = 'Stg that easy to recognize in DB';
      ProfileModel.findOne({ _id: profilesTodoTestDatas[0]._id},
         (err, profDoc)=>{
        expect(err).to.be.a('null')
        expect(profDoc).to.be.a('object')

        const todoTarget = profDoc.forTestShowFirstTodo.id;
        ProfileModel.modifyTodoNotation(profDoc._id, todoTarget, text, (res)=>{
          expect(res).to.be.a('object');
          expect(res.status).to.be.a('string')
          expect(res.status).to.equal('success')

          const updateTime = res.report
          expect(updateTime).to.be.instanceOf(Date)

          setTimeout(()=>{
            ProfileModel.findOne({ _id: profDoc._id }, (err, profDoc2)=>{
              expect(err).to.be.a('null')
              expect(profDoc2).to.be.a('object')
  
              const rawTodo = profDoc2.findThisRawTodo(todoTarget)
              expect(rawTodo).to.be.a('object')
              expect(rawTodo.notation).to.equal(text)
              expect(rawTodo.lastModfingDate).to.deep.equal(updateTime)
              done()
            })
          }, 200)
        });
        
      })
    })

    it('Update todo status', (done)=>{
      ProfileModel.findOne({ _id: profilesTodoTestDatas[0]._id},
        (err, profDoc)=>{
        expect(err).to.be.a('null')
        expect(profDoc).to.be.a('object')

        const todoTarget = profDoc.forTestShowFirstTodo.id;
        ProfileModel.modifyTodoStatus(profDoc._id, todoTarget, 'Finished', (res)=>{
          expect(res).to.be.a('object');
          expect(res.status).to.be.a('string')
          expect(res.status).to.equal('success')
          const updateTime = res.report
          expect(updateTime).to.be.instanceOf(Date)

          setTimeout(()=>{
            ProfileModel.findOne({ _id: profDoc._id }, (err, profDoc2)=>{
              expect(err).to.be.a('null')
              expect(profDoc2).to.be.a('object')
  
              const rawTodo = profDoc2.findThisRawTodo(todoTarget)
              expect(rawTodo.status).to.be.a('string')
              expect(rawTodo.status).to.equal('Finished')
              expect(rawTodo.lastModfingDate).to.deep.equal(updateTime)
              done()
            })
          }, 200)
        });
      })
    })

    it('Remove an existiong todo, from few', (done)=>{
      const seekedUName = profilesTodoTestDatas[3].username
      ProfileModel.findOne({ username: seekedUName }, (err, profDoc)=>{
        expect(err).to.be.a('null')
        expect(profDoc).to.be.a('object')

        profilesTodoTestDatas[3]._id = profDoc._id
        const targetTodo = profDoc.forTestShowFirstTodo._id;

        ProfileModel.removeThisTodo(profDoc._id, targetTodo, (res)=>{
          expect(res).to.be.a('object')
          expect(res).to.have.own.property('status')
          expect(res.status).to.be.a('string')
          expect(res.status).to.equal('success')

          setTimeout(()=>{
            ProfileModel.findOne({ _id: profDoc._id}, (err, profDoc2)=>{
              expect(err).to.be.a('null')
              expect(profDoc2).to.be.a('object')
              
              const todoNow = profDoc2.findThisRawTodo(targetTodo);
              expect(todoNow).to.be.a('undefined')
              done();
          }, 200)
          })
        });
      })
    })

    it('Remove an existiong todo, that is single', (done)=>{
      ProfileModel.findOne({ _id: profilesTodoTestDatas[1]._id }, (err, profDoc)=>{
        expect(err).to.be.a('null')
        expect(profDoc).to.be.a('object')

        const targetTodo = profDoc.forTestShowFirstTodo._id;
        ProfileModel.removeThisTodo(profDoc._id, targetTodo, (res)=>{
          expect(res).to.be.a('object')
          expect(res).to.have.own.property('status')
          expect(res.status).to.be.a('string')
          expect(res.status).to.equal('success')

          setTimeout(()=>{
            ProfileModel.findOne({ _id: profDoc._id}, (err, profDoc2)=>{
              expect(err).to.be.a('null')
              expect(profDoc2).to.be.a('object')

              const todoNow = profDoc2.findThisRawTodo(targetTodo);
              expect(todoNow).to.be.a('undefined')
              done();
          }, 200)
          })
        });
      })
    })

  });

  describe('Negative provesses', ()=>{

    it('Create todo that is not exists, empty content', (done)=>{
      ProfileModel.addNewTodo(profilesTodoTestDatas[1]._id, {}, (res)=>{
        expect(res).to.be.a('object')
        expect(res).to.have.own.property('status')
        expect(res.status).to.equal('failed')
        done();
      })
    })

    it('Create todo that is partly exists', (done)=>{
      const newTodo = { task: 'Stg to test' }
      ProfileModel.addNewTodo(profilesTodoTestDatas[1]._id, newTodo, (res)=>{
        expect(res).to.be.a('object')
        expect(res).to.have.own.property('status')
        expect(res.status).to.equal('failed')
        done();
      })
    })

    it('Update todo notation that is not exists', (done)=>{
      ProfileModel.modifyTodoNotation(profilesTodoTestDatas[1]._id, '11',
        'Stg', (res)=>{
        expect(res).to.be.a('object')
        expect(res).to.have.own.property('status')
        expect(res.status).to.equal('failed')
        done();
      })
    })

    it('Update todo status that is not exists', (done)=>{
      ProfileModel.modifyTodoStatus(profilesTodoTestDatas[1]._id, '11',
        'Finished', (res)=>{
        expect(res).to.be.a('object')
        expect(res).to.have.own.property('status')
        expect(res.status).to.equal('failed')
        done();
      })
    })
    it('Remove todo that is not exists', (done)=>{
      ProfileModel.removeThisTodo(profilesTodoTestDatas[1]._id, '11', (res)=>{
        expect(res).to.be.a('object')
        expect(res).to.have.own.property('status')
        expect(res.status).to.equal('failed')
        done();
      })
    })

  })

})
