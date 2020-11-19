const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const mongoose = require('mongoose');
const expect = require('chai').expect;

const ProfileItem = require('../../model/profileItem.js');
const dbAccess = require('../../config/appConfig.js').db_access;
const api = require('../../app.js');

const newUserTest = require('./profileTestDatas.js').registGoodProfile;
let justRegisterdUserId = '';
let theNewPassword = 'stgDifferentWord'

before(function(){
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbAccess, { useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection
    .once('open', ()=>{ console.log('Mongoose test DB opened!') })
    .once('close', ()=>{ console.log('Mongoose test DB closed!') })
    .on('error', (err)=>{ console.log('Mongoose error occured! ', err) })
    resolve();
  })
  .then(()=>{
    return chai.request(api).keepOpen()
    .post('/api/register')
    .type('form')
    .send(newUserTest)
    .then(res=>{
      // console.log(res.text);
      expect(res).to.have.status(201);
      const datas = JSON.parse(res.text);
      justRegisterdUserId = datas.report.id;
    })
  })
  .catch(err=>{
    expect(err).to.be.a('undefined');
  })
})

after(function(){
  return new Promise((resolve, reject)=>{
    ProfileItem.deleteOne({_id: justRegisterdUserId}, (err,rep)=>{
      // expect(err).to.be.a('null');
      // expect(rep).to.be.a('object');
      mongoose.connection.close();
      resolve();
    })
  })
  .catch(err=>{  expect(err).to.be.a('undefined')  })
})


describe('Read in user porfile',function(){
  it('Login and read all users profile', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      // console.log(res.text);
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId)

      return agent
      .get('/api/')
      .send()
      .then(nextRes=>{
        expect(nextRes).to.have.status(200);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId)
        expect(nextRes.text).to.be.a('string')

        const resJSON = JSON.parse(nextRes.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('array');
        expect(resJSON.report).to.not.be.empty;
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Reading done!');
      })
    })
    .catch(err=>{  expect(err).to.be.a('undefined')  })
  })
})

describe('Update password', function(){
  it('Login and change pwd - correct way', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': newUserTest.password
    })
    .then(res=>{
      // console.log(res.text);
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId)

      return agent
      .put(`/api/${justRegisterdUserId}/`)
      .type('form')
      .send({
        'new_password': theNewPassword,
        'old_password': newUserTest.password
      })
      .then(res=>{
        expect(res).to.have.status(200);
        expect(res).to.have.cookie('session', justRegisterdUserId);
        expect(res.text).to.be.a('string');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('object');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Updating done!');
      })
      .catch(err=>{  expect(err).to.be.a('undefined')  })
    })
    .catch(err=>{  expect(err).to.be.a('undefined')  })
  })
  it('Login and change pwd - no new password', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': theNewPassword
    })
    .then(res=>{
      // console.log(res.text);
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId)

      return agent
      .put(`/api/${justRegisterdUserId}/`)
      .type('form')
      .send({
        'new_password': '',
        'old_password': theNewPassword
      })
      .then(res=>{
        // console.log(res.text)
        expect(res).to.have.status(400);
        expect(res).to.have.cookie('session', justRegisterdUserId);
        expect(res.text).to.be.a('string');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Validation error!');
        expect(resJSON.involvedId).to.be.a('object');
        expect(resJSON.involvedId.field).to.be.a('string');
        expect(resJSON.involvedId.field).to.equal('new_password');
        expect(resJSON.involvedId.input).to.equal('');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Wrong new or original password!');
      })
      .catch(err=>{  expect(err).to.be.a('undefined')  })
    })
    .catch(err=>{  expect(err).to.be.a('undefined')  })
  })
  it('Login and change pwd - no old password', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': theNewPassword
    })
    .then(res=>{
      // console.log(res.text);
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId)

      return agent
      .put(`/api/${justRegisterdUserId}/`)
      .type('form')
      .send({
        'new_password': newUserTest.password,
        'old_password': ''
      })
      .then(res=>{
        // console.log(res.text)
        expect(res).to.have.status(400);
        expect(res).to.have.cookie('session', justRegisterdUserId);
        expect(res.text).to.be.a('string');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Validation error!');
        expect(resJSON.involvedId).to.be.a('object');
        expect(resJSON.involvedId.field).to.be.a('string');
        expect(resJSON.involvedId.field).to.equal('old_password');
        expect(resJSON.involvedId.input).to.equal('');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Wrong new or original password!');
      })
      .catch(err=>{  expect(err).to.be.a('undefined')  })
    })
    .catch(err=>{  expect(err).to.be.a('undefined')  })
  })
  it('Login and change pwd - wrong old password', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': theNewPassword
    })
    .then(res=>{
      // console.log(res.text);
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId)

      return agent
      .put(`/api/${justRegisterdUserId}/`)
      .type('form')
      .send({
        'new_password': newUserTest.password,
        'old_password': 'forSureNotGood'
      })
      .then(res=>{
        // console.log(res.text);
        expect(res).to.have.status(400);
        expect(res).to.have.cookie('session', justRegisterdUserId);
        expect(res.text).to.be.a('string');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Old password is wrong!');
        expect(resJSON.involvedId).to.be.a('object');
        expect(resJSON.involvedId.field).to.be.a('string');
        expect(resJSON.involvedId.field).to.equal('old_password');
        expect(resJSON.involvedId.input).to.be.a('string');
        expect(resJSON.involvedId.input).to.equal('forSureNotGood');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Wrong given password!');
      })
      .catch(err=>{  expect(err).to.be.a('undefined')  })
    })
    .catch(err=>{  expect(err).to.be.a('undefined')  })
  })
})

describe('Delete the user profile', function(){
  it('Login and profile deletion - attempt wrong pwd confirmation', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': theNewPassword
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId);

      return agent
      .delete(`/api/${justRegisterdUserId}/`)
      .type('form')
      .send({
        'old_password': 'notGoodPassword'
      })
      .then(nextRes=>{
        // console.log(nextRes.text)
        expect(nextRes).to.have.status(400);
        expect(nextRes).to.have.cookie('session', justRegisterdUserId)
        expect(nextRes.text).to.be.a('string');

        const resJSON = JSON.parse(nextRes.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Old password is wrong!');
        expect(resJSON.involvedId).to.be.a('object');
        expect(resJSON.involvedId.field).to.be.a('string');
        expect(resJSON.involvedId.field).to.equal('old_password');
        expect(resJSON.involvedId.input).to.be.a('string');
        expect(resJSON.involvedId.input).to.equal('notGoodPassword');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Wrong given password!')

      })
      .catch(err=>{ expect(err).to.be.a('undefined')  })
    })
    .catch(err=>{ expect(err).to.be.a('undefined')  })
  })

  it('Login and profile deletion - good pwd confirmation', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
    .post(`/api/${justRegisterdUserId}/login`)
    .type('form')
    .send({
      'username': newUserTest.username,
      'password': theNewPassword
    })
    .then(res=>{
      expect(res).to.have.status(200);
      expect(res).to.have.cookie('session', justRegisterdUserId);

      return agent
      .delete(`/api/${justRegisterdUserId}/`)
      .type('form')
      .send({
        'old_password': theNewPassword
      })
      .then(nextRes=>{
        expect(nextRes).to.have.status(200);
        expect(nextRes).to.not.have.cookie('session', justRegisterdUserId)
        expect(nextRes).to.have.cookie('session', '')
        expect(nextRes.text).to.be.a('string');

        const resJSON = JSON.parse(nextRes.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('object');
        expect(resJSON.report.profile).to.be.a('string');
        expect(resJSON.report.profile).to.equal(justRegisterdUserId);
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Deletion done!')
      })
      .catch(err=>{ expect(err).to.be.a('undefined')  })
    })
    .catch(err=>{  expect(err).to.be.a('undefined')  })
  })


})
