const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');

const api = require('../../app.js');
const dbaccess = require('../../config/appConfig.js').db_access;
const ProfileSchema = require('../../model/profileItem.js')

const userForTestRegister = require('./profileTestDatas').registGoodProfile;
let alreadyRegUserId = '';

before(()=>{
  return new Promise((resolve, reject)=>{
    mongoose.connect(dbaccess, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection.on('error', err=>{ console.log('MongoDB error ', err) })
    .once('open', ()=>{ console.log('MongooseDB connection occured for test!') })
    .once('close', ()=>{ console.log('MongooseDB connection closed!') })
    resolve();

  }).catch(err=>{ console.log(err) });
})

after(function(){
  return new Promise((resolve, reject)=>{
    ProfileSchema.deleteOne({username: userForTestRegister.username}, (err, rep)=>{
      mongoose.connection.close();
      resolve();
    })
  }).catch(err=>{ console.log(err) });
})

describe('Read all user from api', function(){
  
  // it contains testdatas, theoreticly !! //
  it('Read the users from api', function(){
    return chai.request(api).keepOpen()
      .get('/api/')
      .then((res)=>{
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        expect(res.text).to.be.a('string');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('array');
        expect(resJSON.report).to.not.be.empty;
        expect(resJSON.report[0].id).to.be.a('string');
        expect(resJSON.report[0].username).to.be.a('string');
      })
  })
})

describe('Proper login-out attempts', function(){
    // no issue should come !! //
    it('Register a new users and login with that', function(){
      let agent = chai.request.agent(api);
      return agent.keepOpen()
        .post('/api/register')
        .type('form')
        .send(userForTestRegister)
        .then((res)=>{
          expect(res).to.have.status(201);
          expect(res.text).to.be.a('string');

          const resJSON = JSON.parse(res.text);
          expect(resJSON.report).to.be.a('object');
          expect(resJSON.report.id).to.be.a('string');
          expect(resJSON.report.username).to.be.a('string');
          expect(resJSON.report.fullname).to.be.a('string');
          expect(resJSON.report.occupation).to.be.a('string');
          expect(resJSON.message).to.be.a('string');
          alreadyRegUserId = resJSON.report.id;

          expect(res).to.have.cookie('session', alreadyRegUserId);

          return agent.post(`/api/${alreadyRegUserId}/login`)
            .type('form')
            .send({
              'username': userForTestRegister.username,
              'password': userForTestRegister.password
            })
            .then((nextRes)=>{
              expect(nextRes).to.have.status(200);
              expect(nextRes).to.have.cookie('session', alreadyRegUserId);
              expect(nextRes.text).to.be.a('string');

              const nextResJSON = JSON.parse(nextRes.text);
              expect(nextResJSON).to.be.a('object');
              expect(nextResJSON.message).to.equal('You are logged in!')
            })
        })
    })

    it('Login to existing account, getting personal datas', function(){
      let agent = chai.request.agent(api);
      return agent.keepOpen()
        .post(`/api/${alreadyRegUserId}/login`)
        .type('form')
        .send({
          'username': userForTestRegister.username,
          'password': userForTestRegister.password
        })
        .then((res)=>{
          expect(res).to.have.status(200);
          expect(res).to.have.cookie('session');
          expect(res.text).to.be.a('string');

          const resJSON = JSON.parse(res.text);
          expect(resJSON.report).to.be.a('string');
          expect(resJSON.report).to.equal('Access granted!')

          return agent.keepOpen()
            .get(`/api/${alreadyRegUserId}`)
            .then((nextRes)=>{
              expect(nextRes).to.have.status(200);
              expect(nextRes).to.have.cookie('session', alreadyRegUserId);
              expect(nextRes.text).to.be.a('string');
              const resJSON = JSON.parse(nextRes.text);
              expect(resJSON.report).to.be.a('object');
              expect(resJSON.report.id).to.be.a('string');
              expect(resJSON.report.username).to.be.a('string');
              expect(resJSON.report.fullname).to.be.a('string');
              expect(resJSON.report.occupation).to.be.a('string');
              expect(resJSON.message).to.be.a('string');
            })
        })
    })

    it('Login and logout process', function(){
      let agent = chai.request.agent(api);
      return agent.keepOpen()
        .post(`/api/${alreadyRegUserId}/login`)
        .type('form')
        .send({
          'username': userForTestRegister.username,
          'password': userForTestRegister.password
        })
        .then((res)=>{
          expect(res).to.have.status(200);
          expect(res).to.have.cookie('session', alreadyRegUserId);
          expect(res.text).to.be.a('string');

          return agent.get(`/api/${alreadyRegUserId}/logout`)
            .send()
            .then((nextRes)=>{
              expect(nextRes).to.have.status(200);
              expect(nextRes.text).to.be.a('string');
              expect(nextRes).to.not.have.cookie('session', alreadyRegUserId);

              const resJSON = JSON.parse(nextRes.text);
              expect(resJSON.report).to.be.a('string');
              expect(resJSON.report).to.equal('Access terminated!')
            })
        })
    })
})

describe('Uncorrect login-out attempts', function(){
  it('Login with wrong profileID in path', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(`/api/1234567890/login`)
      .type('form')
      .send({
        'username': userForTestRegister.username,
        'password': userForTestRegister.password,
      })
      .then(res=>{
        expect(res).to.have.status(400)
        expect(res).to.not.have.cookie('session');
        expect(res.text).to.be.a('string');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Not correct path ID!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Management is permitted only at your account!');
      })
  })
  it('Login with wrong username', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(`/api/${alreadyRegUserId}/login`)
      .type('form')
      .send({
        'username': '1234567890',
        'password': userForTestRegister.password
      })
      .then(res=>{
        expect(res).to.have.status(400)
        expect(res).to.not.have.cookie('session');
        expect(res.text).to.be.a('string');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Not correct username is sent!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Wrong username or password!');
      })
  })
  it('Login with wrong, but possibly good password', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(`/api/${alreadyRegUserId}/login`)
      .type('form')
      .send({
        'username': userForTestRegister.username,
        'password': '1234567890'
      })
      .then(res=>{
        expect(res).to.have.status(400)
        expect(res).to.not.have.cookie('session');
        expect(res.text).to.be.a('string');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Password authentication failed at login!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Wrong username or password!');
      })
  })
  it('Login without login datas', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(`/api/${alreadyRegUserId}/login`)
      .type('form')
      .send({
        'username': '',
        'password': ''
      })
      .then(res=>{
        expect(res).to.have.status(400)
        expect(res).to.not.have.cookie('session');
        expect(res.text).to.be.a('string');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Validation error!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Wrong username or password!');
      })
  })
  it('Login without an important form field', function(){
    let agent = chai.request.agent(api);
    return agent.keepOpen()
      .post(`/api/${alreadyRegUserId}/login`)
      .type('form')
      .send({
        'username': userForTestRegister.username
      })
      .then(res=>{
        expect(res).to.have.status(400)
        expect(res).to.not.have.cookie('session');
        expect(res.text).to.be.a('string');

        const resJSON = JSON.parse(res.text);
        expect(resJSON).to.be.a('object');
        expect(resJSON.report).to.be.a('string');
        expect(resJSON.report).to.equal('Validation error!');
        expect(resJSON.message).to.be.a('string');
        expect(resJSON.message).to.equal('Wrong username or password!');
      })
  })
})
