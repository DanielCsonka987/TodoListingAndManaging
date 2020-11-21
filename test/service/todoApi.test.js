const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const mongoose = require('mongoose');
const expect = require('chai').expect;

const dbaccess = require('../../config/appConfig.js').db_access;
const ProfileSchema = require('../../model/profileItem.js');
const TodoSchema = require('../../model/todoItem.js');
const api = require('../../app.js');
const newUserTest = require('./profileTestDatas.js').registGoodProfile;
const anotherUserTest = require('./profileTestDatas.js').registAnotherProfile;
const properTodos = require('./todoTestDatas.js').properTodos;
const faultyTodos = require('./todoTestDatas.js').faultyTodos;

let justRegisterdUserId_1 = '';
let justRegisterdUserId_2 = '';
let successfullyUplodadedTodos = [];
let todoIdThatNeedToProcess_1 = '';
let todoIdThatNeedToProcess_2 = '';

before(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true})
    mongoose.connection
    .once('open', ()=>{ console.log('Test DB connection established') })
    .once('close', ()=>{ console.log('Test DB connection terminated') })
    .on('error', (err)=>{ console.log('Test DB error occured ', err) })
    resolve();
  })
  .then(()=>{
    return chai.request(api)
    .post('/api/register')
    .type('form')
    .send(newUserTest)
    .then(res=>{
      expect(res).to.have.status(201);
      expect(res.text).to.be.a('string');

      const resJSON = JSON.parse(res.text);
      expect(resJSON.report.id).to.be.a('string');
      justRegisterdUserId_1 = resJSON.report.id;

      expect(res).to.have.cookie('session', justRegisterdUserId_1);
      setTimeout(()=>{},400)  //it solvs timing problems
    })
  })
  .then(()=>{
    return chai.request(api)
    .post('/api/register')
    .type('form')
    .send(anotherUserTest)
    .then(res=>{
      expect(res).to.have.status(201);
      expect(res.text).to.be.a('string');

      const resJSON = JSON.parse(res.text);
      expect(resJSON.report.id).to.be.a('string');
      justRegisterdUserId_2 = resJSON.report.id;

      expect(res).to.have.cookie('session', justRegisterdUserId_2);
      setTimeout(()=>{},400)  //it solvs timing problems
    })
  })
})

after(()=>{
  return ProfileSchema.deleteOne({_id: justRegisterdUserId_1})
  .then(()=>{
    mongoose.connection.close();
  })
})

describe('Create and read back new todos', function(){

  it('Login and creteate some todo to first user', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.keepOpen()
      .post(`/api/${justRegisterdUserId_1}/todos`)
      .type('form')
      .send(properTodos[0])
      .then(nextRes=>{
        expect(nextRes).to.have.status(201);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
        expect(nextRes.text).to.be.a('string');
        // console.log(nextRes.text)
        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('object');
        expect(nextJSON.report.task).to.be.a('string');
        expect(nextJSON.report.task).to.equal(properTodos[0].task);

        return agent.keepOpen()
        .get(`/api/${justRegisterdUserId_1}/todos`)
        .send()
        .then(readRes=>{
          // console.log(readRes);
          expect(readRes).to.have.status(200);
          expect(readRes).to.have.cookie('session', justRegisterdUserId_1);
          expect(readRes.text).to.be.a('string');

          const readJSON = JSON.parse(readRes.text);
          // console.log(readJSON)
          expect(readJSON).to.be.a('object');
          expect(readJSON.report).to.be.a('array');
          expect(readJSON.report).to.not.be.empty;
          // expect(Object.keys(resdJSON.report).length).to.equal(1);
          return agent.post(`/api/${justRegisterdUserId_1}/todos`)
          .type('form')
          .send(properTodos[1])
          .then(thirdRes=>{
            expect(thirdRes).to.have.status(201);
            expect(thirdRes).to.have.cookie('session', justRegisterdUserId_1);
          })
        })
      })
    })
  })

  it('Login and creteate some todo to second user', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_2}/login`)
    .type('form')
    .send({
      'username': anotherUserTest.username,
      'password': anotherUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_2);

      return agent.keepOpen()
      .post(`/api/${justRegisterdUserId_2}/todos`)
      .type('form')
      .send(properTodos[2])
      .then(nextRes=>{
        expect(nextRes).to.have.status(201);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_2);
        expect(nextRes.text).to.be.a('string');
        // console.log(nextRes.text)
        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('object');
        expect(nextJSON.report.task).to.be.a('string');
        expect(nextJSON.report.task).to.equal(properTodos[2].task);

        return agent.keepOpen()
        .get(`/api/${justRegisterdUserId_2}/todos`)
        .send()
        .then(readRes=>{
          // console.log(readRes);
          expect(readRes).to.have.status(200);
          expect(readRes).to.have.cookie('session', justRegisterdUserId_2);
          expect(readRes.text).to.be.a('string');

          const readJSON = JSON.parse(readRes.text);
          // console.log(readJSON)
          expect(readJSON).to.be.a('object');
          expect(readJSON.report).to.be.a('array');
          expect(readJSON.report).to.not.be.empty;
          expect(Object.keys(readJSON.report).length).to.equal(1);
          return agent.post(`/api/${justRegisterdUserId_2}/todos`)
          .type('form')
          .send(properTodos[3])
          .then(nextRes=>{
            expect(nextRes).to.have.status(201);
            expect(nextRes).to.have.cookie('session', justRegisterdUserId_2);
          })
        })
      })
    })
  })

  it('Login and creteate faulty todo to first user 1 - no task', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.post(`/api/${justRegisterdUserId_1}/todos`)
      .type('form')
      .send(faultyTodos[0])
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
      })
    })
  })
  it('Login and creteate faulty todo to first user 2 - no priority', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.post(`/api/${justRegisterdUserId_1}/todos`)
      .type('form')
      .send(faultyTodos[1])
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
      })
    })
  })
  it('Login and creteate faulty todo to first user 3 - empty task', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.post(`/api/${justRegisterdUserId_1}/todos`)
      .type('form')
      .send(faultyTodos[2])
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
      })
    })
  })
  it('Login and creteate faulty todo to first user 4 - high prioirty', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.post(`/api/${justRegisterdUserId_1}/todos`)
      .type('form')
      .send(faultyTodos[3])
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
      })
    })
  })
  it('Login and creteate faulty todo to first user 5 - text prioirty', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.post(`/api/${justRegisterdUserId_1}/todos`)
      .type('form')
      .send(faultyTodos[4])
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
      })
    })
  })
})

describe('Read all todos per user', function(){
  it('Login, read first user\'s todos ', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.get(`/api/${justRegisterdUserId_1}/todos`)
      .send()
      .then(readRes=>{
        expect(readRes).to.have.status(200);
        expect(readRes).to.have.cookie('session', justRegisterdUserId_1);
        expect(readRes.text).to.be.a('string');

        const readJSON = JSON.parse(readRes.text);
        expect(readJSON).to.be.a('object');
        expect(readJSON.report).to.be.a('array');
        expect(Object.keys(readJSON.report).length).to.equal(2);

        expect(readJSON.report[0].task).to.equal(properTodos[0].task)
        todoIdThatNeedToProcess_1 = readJSON.report[0].id;
        expect(todoIdThatNeedToProcess_1).to.be.a('string');
        expect(readJSON.report[1].task).to.equal(properTodos[1].task)
      })
    })
  })
  it('Login, read second user\'s todos ', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_2}/login`)
    .type('form')
    .send({
      'username': anotherUserTest.username,
      'password': anotherUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_2);

      return agent.get(`/api/${justRegisterdUserId_2}/todos`)
      .send()
      .then(readRes=>{
        expect(readRes).to.have.status(200);
        expect(readRes).to.have.cookie('session', justRegisterdUserId_2);
        expect(readRes.text).to.be.a('string');

        const readJSON = JSON.parse(readRes.text);
        expect(readJSON).to.be.a('object');
        expect(readJSON.report).to.be.a('array');
        expect(Object.keys(readJSON.report).length).to.equal(2);

        expect(readJSON.report[0].task).to.equal(properTodos[2].task)
        todoIdThatNeedToProcess_2 = readJSON.report[0].id;
        expect(todoIdThatNeedToProcess_2).to.be.a('string');
        expect(readJSON.report[1].task).to.equal(properTodos[3].task)
      })
    })
  })
})

describe('Update todo', function(){
  it('Login, first user first todo\'s status changing', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.keepOpen()
      .put(`/api/${justRegisterdUserId_1}/todos/${todoIdThatNeedToProcess_1}/status`)
      .type('form')
      .send({ 'status': 'true' })
      .then(nextRes=>{
        expect(nextRes).to.have.status(200);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
        expect(nextRes.text).to.be.a('string');
        // console.log(nextRes.text)

        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('object')
        expect(nextJSON.report.outcome).to.be.a('string');
        expect(nextJSON.report.outcome).to.equal('Finished');
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Updating done!');
      })
    })
  })
  it('Login, first user first todo\'s status reversion', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.keepOpen()
      .put(`/api/${justRegisterdUserId_1}/todos/${todoIdThatNeedToProcess_1}/status`)
      .type('form')
      .send({ 'status': 'false' })
      .then(nextRes=>{
        expect(nextRes).to.have.status(200);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
        expect(nextRes.text).to.be.a('string');
        // console.log(nextRes.text)
        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('object')
        expect(nextJSON.report.outcome).to.be.a('string');
        expect(nextJSON.report.outcome).to.equal('Proceeding');
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Updating done!');
      })
    })
  })
  it('Login, second user first todo\'s notation defining', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_2}/login`)
    .type('form')
    .send({
      'username': anotherUserTest.username,
      'password': anotherUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_2);

      return agent.keepOpen()
      .put(`/api/${justRegisterdUserId_2}/todos/${todoIdThatNeedToProcess_2}/notation`)
      .type('form')
      .send({ 'notation': 'Text that should be in the result!' })
      .then(nextRes=>{
        expect(nextRes).to.have.status(200);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_2);
        expect(nextRes.text).to.be.a('string');
        // console.log(nextRes.text)
        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('object')
        expect(nextJSON.report.outcome).to.be.a('string');
        expect(nextJSON.report.outcome).to.equal('Text that should be in the result!');
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Updating done!');
      })
    })
  })
  it('Login, first user first todo\'s status faulty updating', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.keepOpen()
      .put(`/api/${justRegisterdUserId_1}/todos/${todoIdThatNeedToProcess_1}/status`)
      .type('form')
      .send({ 'status': 'wrongInput' })
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
        expect(nextRes.text).to.be.a('string');
        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('string')
        expect(nextJSON.report).to.equal('Validation error!');
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Todo state must be true or false!');
      })
    })
  })
})

describe('Delete todo', function(){
  it('Login, first user and delete first todo', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.keepOpen()
      .delete(`/api/${justRegisterdUserId_1}/todos/${todoIdThatNeedToProcess_1}/`)
      .type('form')
      .send({
        'old_password': newUserTest.password
       })
      .then(nextRes=>{
        // console.log(nextRes.text);
        expect(nextRes).to.have.status(200);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
        expect(nextRes.text).to.be.a('string');

        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('object')
        expect(nextJSON.report.todo).to.be.a('string');
        expect(nextJSON.report.todo).to.equal(todoIdThatNeedToProcess_1);
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Deletion done!');
      })
    })
  })
  it('Login, second user and delete first todo - no password 1', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_2}/login`)
    .type('form')
    .send({
      'username': anotherUserTest.username,
      'password': anotherUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_2);

      return agent.keepOpen()
      .delete(`/api/${justRegisterdUserId_2}/todos/${todoIdThatNeedToProcess_2}/`)
      .type('form')
      .send({
        'old_password': ''
       })
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_2);
        expect(nextRes.text).to.be.a('string');

        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('string')
        expect(nextJSON.report).to.equal('Old password is wrong!');
        expect(nextJSON.involvedId).to.be.a('object');
        expect(nextJSON.involvedId.field).to.be.a('string');
        expect(nextJSON.involvedId.field).to.equal('old_password');
        expect(nextJSON.involvedId.input).to.be.a('string');
        expect(nextJSON.involvedId.input).to.equal('');
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Wrong given password!');
      })
    })
  })
  it('Login, second user and delete first todo - bad password 2', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_2}/login`)
    .type('form')
    .send({
      'username': anotherUserTest.username,
      'password': anotherUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_2);

      return agent.keepOpen()
      .delete(`/api/${justRegisterdUserId_2}/todos/${todoIdThatNeedToProcess_2}/`)
      .type('form')
      .send({
        'old_password': 'notTheGoodPasswordForSure'
       })
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_2);
        expect(nextRes.text).to.be.a('string');

        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('string')
        expect(nextJSON.report).to.equal('Old password is wrong!');
        expect(nextJSON.involvedId).to.be.a('object');
        expect(nextJSON.involvedId.field).to.be.a('string');
        expect(nextJSON.involvedId.field).to.equal('old_password');
        expect(nextJSON.involvedId.input).to.be.a('string');
        expect(nextJSON.involvedId.input).to.equal('notTheGoodPasswordForSure');
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Wrong given password!');
      })
    })
  })

  it('Login, first user delete all its 1 todos - no password', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);
      return agent
      .delete(`/api/${justRegisterdUserId_1}/todos/`)
      .type('form')
      .send({
        'old_password': ''
       })
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
        expect(nextRes.text).to.be.a('string');

        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('string');
        expect(nextJSON.report).to.equal('Old password is wrong!');
        expect(nextJSON.involvedId).to.be.a('object');
        expect(nextJSON.involvedId.field).to.be.a('string');
        expect(nextJSON.involvedId.field).to.equal('old_password');
        expect(nextJSON.involvedId.input).to.be.a('string');
        expect(nextJSON.involvedId.input).to.equal('');
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Wrong given password!');
      })
    })
  })
  it('Login, first user delete all its 1 todos - wrong password', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);
      return agent
      .delete(`/api/${justRegisterdUserId_1}/todos/`)
      .type('form')
      .send({
        'old_password': 'notTheGoodPasswordForSure'
       })
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
        expect(nextRes.text).to.be.a('string');

        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('string');
        expect(nextJSON.report).to.equal('Old password is wrong!');
        expect(nextJSON.involvedId).to.be.a('object');
        expect(nextJSON.involvedId.field).to.be.a('string');
        expect(nextJSON.involvedId.field).to.equal('old_password');
        expect(nextJSON.involvedId.input).to.be.a('string');
        expect(nextJSON.involvedId.input).to.equal('notTheGoodPasswordForSure');
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Wrong given password!');
      })
    })
  })

  it('Login, first user, add 1 and delete all its 2 todos', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.keepOpen()
      .post(`/api/${justRegisterdUserId_1}/todos/`)
      .type('form')
      .send(properTodos[4])
      .then(nextRes=>{
        expect(nextRes).to.have.status(201);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);

        return agent
        .delete(`/api/${justRegisterdUserId_1}/todos/`)
        .type('form')
        .send({
          'old_password': newUserTest.password
         })
        .then(thirdRes=>{
          expect(thirdRes).to.have.status(200);
          expect(thirdRes).to.have.cookie('session', justRegisterdUserId_1);
          expect(thirdRes.text).to.be.a('string');

          const thirdJSON = JSON.parse(thirdRes.text);
          expect(thirdJSON).to.be.a('object');
          expect(thirdJSON.report).to.be.a('object')
          expect(thirdJSON.report.profile).to.be.a('string');
          expect(thirdJSON.report.profile).to.equal(justRegisterdUserId_1);
          expect(thirdJSON.report.deletedTodo).to.be.a('number');
          expect(thirdJSON.report.deletedTodo).to.equal(2);
          expect(thirdJSON.message).to.be.a('string');
          expect(thirdJSON.message).to.equal('Deletion done!');
        })
      })
    })
  })
  it('Login, second user and delete its profile with all 2 todos', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_2}/login`)
    .type('form')
    .send({
      'username': anotherUserTest.username,
      'password': anotherUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_2);

      return agent
      .delete(`/api/${justRegisterdUserId_2}/`)
      .type('form')
      .send({
        'old_password': anotherUserTest.password
       })
      .then(nextRes=>{
        expect(nextRes).to.have.status(200);
        expect(nextRes).to.have.cookie('session', '');
        expect(nextRes.text).to.be.a('string');

        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('object')
        expect(nextJSON.report.profile).to.be.a('string');
        expect(nextJSON.report.profile).to.equal(justRegisterdUserId_2);
        expect(nextJSON.report.deletedTodo).to.be.a('number');
        expect(nextJSON.report.deletedTodo).to.equal(2);
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Deletion done!');
      })
    })
  })

  it('Login, first user profile deletion attempt - no password', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.keepOpen()
      .delete(`/api/${justRegisterdUserId_1}/`)
      .type('form')
      .send({
        'old_password': ''
      })
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
        expect(nextRes.text).to.be.a('string');

        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('string');
        expect(nextJSON.report).to.equal('Old password is wrong!');
        expect(nextJSON.involvedId).to.be.a('object');
        expect(nextJSON.involvedId.field).to.be.a('string');
        expect(nextJSON.involvedId.field).to.equal('old_password');
        expect(nextJSON.involvedId.input).to.be.a('string');
        expect(nextJSON.involvedId.input).to.equal('');
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Wrong given password!');
      })
    })
  })
  it('Login, first user profile deletion attempt - wrong password', function(){
    setTimeout(()=>{}, 200);
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId_1}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId_1);

      return agent.keepOpen()
      .delete(`/api/${justRegisterdUserId_1}/`)
      .type('form')
      .send({
        'old_password': 'notTheGoodPasswordForSure'
      })
      .then(nextRes=>{
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId_1);
        expect(nextRes.text).to.be.a('string');

        const nextJSON = JSON.parse(nextRes.text);
        expect(nextJSON).to.be.a('object');
        expect(nextJSON.report).to.be.a('string');
        expect(nextJSON.report).to.equal('Old password is wrong!');
        expect(nextJSON.involvedId).to.be.a('object');
        expect(nextJSON.involvedId.field).to.be.a('string');
        expect(nextJSON.involvedId.field).to.equal('old_password');
        expect(nextJSON.involvedId.input).to.be.a('string');
        expect(nextJSON.involvedId.input).to.equal('notTheGoodPasswordForSure');
        expect(nextJSON.message).to.be.a('string');
        expect(nextJSON.message).to.equal('Wrong given password!');
      })
    })
  })

})
